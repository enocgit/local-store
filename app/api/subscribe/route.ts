import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { sendSubscriptionVerificationEmail } from "@/utils/email";
import crypto from "crypto";

const subscribeSchema = z.object({
  email: z.string().email(),
  categories: z.array(z.string()).default(["newsletter"]),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, categories } = subscribeSchema.parse(body);

    // Generate verification token
    const token = crypto.randomBytes(32).toString("hex");

    // Create or update subscription
    const subscription = await prisma.subscription.upsert({
      where: {
        email_categories: {
          email,
          categories: categories,
        },
      },
      update: {
        status: "PENDING",
        token,
      },
      create: {
        email,
        categories,
        token,
        status: "PENDING",
      },
    });

    // Send verification email using the utility function
    await sendSubscriptionVerificationEmail(email, token);

    return NextResponse.json(
      { message: "Verification email sent" },
      { status: 201 },
    );
  } catch (error) {
    console.error("Subscription error:", error);
    return NextResponse.json(
      { error: "Failed to process subscription" },
      { status: 500 },
    );
  }
}
