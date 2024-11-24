import { NextResponse } from "next/server";
import Stripe from "stripe";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { OrderItem } from "@prisma/client";
import { format } from "date-fns";

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error("STRIPE_SECRET_KEY is not defined in environment variables");
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2024-10-28.acacia", // Use the latest stable API version
});
export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const {
      items,
      subtotal,
      deliveryFee,
      total,
      deliveryDate,
      deliveryTime,
      addressId,
    } = body;

    // Create Order in database first
    const order = await prisma.order.create({
      data: {
        userId: session.user.id,
        subtotal,
        deliveryFee,
        total,
        deliveryDate: new Date(deliveryDate),
        deliveryTime,
        addressId,
        items: {
          create: items.map((item: OrderItem) => ({
            productId: item.id,
            quantity: item.quantity,
            price: item.price * (item.weight || 1),
            weight: item.weight || null,
          })),
        },
      },
    });

    // Create Stripe checkout session
    const stripeSession = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "gbp",
            product_data: {
              name: "Your Order",
              description:
                "Delivery on " + format(new Date(deliveryDate), "yyyy/MM/dd"),
            },
            unit_amount: Math.round(total * 100), // Convert to pence
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/checkout?canceled=true`,
      shipping_address_collection: {
        allowed_countries: ["GB"],
      },
      metadata: {
        orderId: order.id,
        deliveryDate,
        deliveryTime,
      },
    });

    // Update order with Stripe session ID
    await prisma.order.update({
      where: { id: order.id },
      data: { stripeSessionId: stripeSession.id },
    });

    return NextResponse.json({ sessionId: stripeSession.id });
  } catch (error) {
    console.error("Order creation failed:", error);
    return NextResponse.json(
      { error: "Order creation failed" },
      { status: 500 },
    );
  }
}
