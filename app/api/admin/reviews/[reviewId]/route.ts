import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export async function DELETE(
  req: Request,
  { params }: { params: { reviewId: string } },
) {
  try {
    const session = await auth();

    if (!session?.user || session.user.role !== "ADMIN") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const review = await prisma.review.delete({
      where: {
        id: params.reviewId,
      },
    });

    return NextResponse.json(review);
  } catch (error) {
    console.error("[ADMIN_REVIEW_DELETE]", error);
    return NextResponse.json(
      { error: "Failed to delete review" },
      { status: 500 },
    );
  }
}
