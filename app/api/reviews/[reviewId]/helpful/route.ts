import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ reviewId: string }> },
) {
  const { reviewId } = await params;
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const review = await prisma.review.update({
      where: { id: reviewId },
      data: {
        helpful: {
          increment: 1,
        },
      },
    });

    return NextResponse.json(review);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update helpful count" },
      { status: 500 },
    );
  }
}
