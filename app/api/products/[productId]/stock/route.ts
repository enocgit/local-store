import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: Request,
  { params }: { params: { productId: string } },
) {
  try {
    const product = await prisma.product.findUnique({
      where: { id: params.productId },
      select: { stock: true },
    });

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json({ stock: product.stock });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to check stock" },
      { status: 500 },
    );
  }
}
