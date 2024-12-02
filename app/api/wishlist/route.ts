import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await auth();

  if (!session?.user?.email) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const wishlistItems = await prisma.wishlistItem.findMany({
    where: {
      user: {
        email: session.user.email,
      },
    },
    include: {
      product: {
        include: {
          reviews: true,
        },
      },
    },
  });

  return NextResponse.json(wishlistItems);
}

export async function POST(request: Request) {
  const session = await auth();

  if (!session?.user?.email) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const { productId } = await request.json();

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user) {
    return new NextResponse("User not found", { status: 404 });
  }

  // Check if item exists in wishlist
  const existingItem = await prisma.wishlistItem.findFirst({
    where: {
      userId: user.id,
      productId,
    },
  });

  if (existingItem) {
    // Remove from wishlist
    await prisma.wishlistItem.delete({
      where: { id: existingItem.id },
    });
  } else {
    // Add to wishlist
    await prisma.wishlistItem.create({
      data: {
        userId: user.id,
        productId,
      },
    });
  }

  return NextResponse.json({ success: true });
}
