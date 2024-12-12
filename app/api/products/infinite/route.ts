import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "9");
    const minPrice = searchParams.get("minPrice")
      ? Number(searchParams.get("minPrice"))
      : undefined;
    const maxPrice = searchParams.get("maxPrice")
      ? Number(searchParams.get("maxPrice"))
      : undefined;

    const skip = (page - 1) * limit;

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where: {
          ...(minPrice !== undefined &&
            maxPrice !== undefined && {
              price: {
                gte: minPrice,
                lte: maxPrice,
              },
            }),
        },
        skip,
        take: limit,
        select: {
          id: true,
          name: true,
          description: true,
          price: true,
          comparePrice: true,
          rating: true,
          weightOptions: true,
          images: true,
          badge: true,
          stock: true,
          category: {
            select: {
              name: true,
            },
          },
          reviews: {
            select: {
              rating: true,
            },
          },
        },
      }),
      prisma.product.count({
        where: {
          ...(minPrice !== undefined &&
            maxPrice !== undefined && {
              price: {
                gte: minPrice,
                lte: maxPrice,
              },
            }),
        },
      }),
    ]);

    return NextResponse.json({
      products,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
    });
  } catch (error) {
    console.error("Failed to fetch products:", error);
    return NextResponse.json(
      {
        products: [],
        totalPages: 0,
        currentPage: 1,
      },
      { status: 500 },
    );
  }
}
