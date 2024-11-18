import { getFeaturedProducts } from "@/lib/api/products";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const products = await getFeaturedProducts();
    return NextResponse.json(products);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch featured products" },
      { status: 500 },
    );
  }
}
