import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function DELETE(
  req: Request,
  { params }: { params: { subscriptionId: string } }
) {
  try {
    const subscription = await prisma.subscription.delete({
      where: {
        id: params.subscriptionId,
      },
    });

    return NextResponse.json(subscription);
  } catch (error) {
    console.log("[SUBSCRIPTION_DELETE]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
