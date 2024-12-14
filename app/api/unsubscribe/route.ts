import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const unsubscribeSchema = z.object({
  email: z.string().email(),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email } = unsubscribeSchema.parse(body);

    await prisma.subscription.updateMany({
      where: { email },
      data: { status: "UNSUBSCRIBED" },
    });

    return NextResponse.json(
      { message: "Successfully unsubscribed" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Unsubscribe error:", error);
    return NextResponse.json(
      { error: "Failed to unsubscribe" },
      { status: 500 },
    );
  }
}
