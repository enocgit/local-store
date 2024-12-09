import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ productId: string }> },
) {
  const { productId } = await params;

  try {
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    const relatedProducts = await prisma.product.findMany({
      where: {
        NOT: {
          id: product.id,
        },
        categoryId: product.categoryId,
      },
      take: 4,
      include: {
        reviews: true,
      },
    });

    return NextResponse.json(relatedProducts);
  } catch (error) {
    console.error("[RELATED_PRODUCTS_GET]", error);
    return NextResponse.json(
      { error: "Failed to fetch related products" },
      { status: 500 },
    );
  }
}
