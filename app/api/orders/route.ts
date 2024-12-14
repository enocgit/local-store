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
      email,
    } = body;

    // Create Stripe checkout session first
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
            unit_amount: Math.round(subtotal * 100),
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/checkout?canceled=true`,
      customer_email: email,
      shipping_options: [
        {
          shipping_rate_data: {
            type: "fixed_amount",
            fixed_amount: {
              amount: Math.round(deliveryFee * 100),
              currency: "gbp",
            },
            display_name: "Delivery Fee",
          },
        },
      ],
      expires_at: Math.floor(Date.now() / 1000) + 30 * 60, // Session expires in 30 minutes
    });

    try {
      // Create Order in database with the new session ID
      const order = await prisma.order.create({
        data: {
          userId: session.user.id,
          subtotal,
          deliveryFee,
          total,
          deliveryDate: new Date(deliveryDate),
          deliveryTime,
          addressId,
          status: "PENDING",
          stripeSessionId: stripeSession.id,
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

      return NextResponse.json({ sessionId: stripeSession.id });
    } catch (error) {
      // If order creation fails, cancel the Stripe session
      await stripe.checkout.sessions.expire(stripeSession.id);
      throw error;
    }
  } catch (error) {
    console.error("Order creation failed:", error);
    return NextResponse.json(
      { error: "Order creation failed" },
      { status: 500 },
    );
  }
}
