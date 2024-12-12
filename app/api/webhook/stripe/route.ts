import { headers } from "next/headers";
import Stripe from "stripe";
import { prisma } from "@/lib/prisma";

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

      // Update order status
      await prisma.order.update({
        where: {
          stripeSessionId: session.id,
        },
        data: {
          status: "PAID",
          paidAt: new Date(),
        },
      });

      // You could emit an event here that the client can listen to
      // to clear the cart, or rely on the success page to do it
      break;
    }
    // ... handle other events
  }

  return new Response(null, { status: 200 });
}
