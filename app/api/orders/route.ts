import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-10-28.acacia",
});

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "gbp",
            product_data: {
              name: "Your Order",
              description: "Delivery on " + body.deliveryDate,
            },
            unit_amount: 3996, // Amount in pence (£39.96)
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
        orderId: "12345", // Replace with actual order ID
        deliveryDate: body.deliveryDate,
        deliveryTime: body.deliveryTime,
      },
    });

    return NextResponse.json({ sessionId: session.id });
  } catch (error) {
    console.error("Order creation failed:", error);
    return NextResponse.json(
      { error: "Order creation failed" },
      { status: 500 },
    );
  }
}
