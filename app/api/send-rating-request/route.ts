import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { sendEmail, sendRatingRequestEmail } from "@/utils/email";

export async function POST(req: Request) {
  try {
    const { orderId } = await req.json();

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { user: true },
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    await sendRatingRequestEmail({
      email: order.user.email,
      orderId,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to send rating request" },
      { status: 500 },
    );
  }
}
