import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function DELETE() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Delete user data in this order to handle foreign key constraints
    await prisma.$transaction([
      // Delete user's orders
      prisma.order.deleteMany({
        where: { userId: session.user.id },
      }),

      // Delete user's reviews
      prisma.review.deleteMany({
        where: { userId: session.user.id },
      }),

      // Delete user's wishlist
      prisma.wishlistItem.deleteMany({
        where: { userId: session.user.id },
      }),

      // Finally delete the user
      prisma.user.delete({
        where: { id: session.user.id },
      }),
    ]);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting user:", error);
    return NextResponse.json(
      { error: "Failed to delete account" },
      { status: 500 },
    );
  }
}
