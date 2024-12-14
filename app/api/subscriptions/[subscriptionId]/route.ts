import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ subscriptionId: string }> },
) {
  const { subscriptionId } = await params;
  try {
    const subscription = await prisma.subscription.delete({
      where: {
        id: subscriptionId,
      },
    });

    return NextResponse.json(subscription);
  } catch (error) {
    console.log("[SUBSCRIPTION_DELETE]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
