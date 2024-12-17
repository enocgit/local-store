import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const maxPrice = await prisma.product.aggregate({
    _max: {
      price: true,
    },
  });

  return NextResponse.json({ maxPrice: maxPrice._max.price || 50 });
}
