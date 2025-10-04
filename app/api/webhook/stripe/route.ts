import { headers } from "next/headers";
import Stripe from "stripe";
import { prisma } from "@/lib/prisma";
import {
  sendOrderConfirmationEmail,
  sendAdminOrderNotificationEmail,
} from "@/utils/email";
import siteMeta from "@/data/site-meta";
// import { sendEventToClient } from "@/app/api/order-updates/route";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-10-28.acacia",
});

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: Request) {
  const body = await req.text();
  const headersList = await headers();
  const sig = headersList.get("stripe-signature");

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, sig!, endpointSecret);
  } catch (err: any) {
    return new Response(`Webhook Error: ${err.message}`, { status: 400 });
  }

  // Handle the event
  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;

      // Update order status and decrease stock
      const order = await prisma.order.update({
        where: {
          stripeSessionId: session.id,
        },
        data: {
          status: "PAID",
          paidAt: new Date(),
        },
        include: {
          items: {
            include: {
              product: {
                select: {
                  name: true,
                  id: true,
                },
              },
            },
          },
          address: true,
          user: true,
        },
      });

      // Decrease stock for each item
      await Promise.all(
        order.items.map((item) =>
          prisma.product.update({
            where: { id: item.product.id },
            data: {
              stock: {
                decrement: item.quantity,
              },
            },
          }),
        ),
      );

      // Send customer confirmation email
      try {
        await sendOrderConfirmationEmail({
          email: order.user.email,
          orderId: order.id,
          items: order.items,
          total: order.total,
          deliveryFee: order.deliveryFee,
          firstName: order.user.firstName as string,
          lastName: order.user.lastName as string,
          address: order.address,
          deliveryDate: order.deliveryDate,
          deliveryTime: order.deliveryTime,
        });

        // Send admin notification
        if (process.env.NODE_ENV === "production") {
          await sendAdminOrderNotificationEmail({
            email: `admin@${siteMeta.email_domain}`,
            orderId: order.id,
            items: order.items,
            total: order.total,
            customerName: `${order.user.firstName} ${order.user.lastName}`,
            deliveryDate: order.deliveryDate,
            deliveryTime: order.deliveryTime,
          });
        }
      } catch (error) {
        console.error("Failed to send emails:", error);
      }

      // // Emit event to clear cart
      // await sendEventToClient(order.userId, "order_completed", {
      //   orderId: order.id,
      // });

      break;
    }
    // ... handle other events
  }

  return new Response(null, { status: 200 });
}
