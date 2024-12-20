import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ categoryId: string }> },
) {
  const { categoryId } = await params;

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

    if (categoryId === "new-arrivals") {
      const [products, newArrivals] = await Promise.all([
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
          orderBy: {
            createdAt: "desc",
          },
          take: 15,
          select: {
            id: true,
            name: true,
            description: true,
            price: true,
            comparePrice: true,
            rating: true,
            images: true,
            weightOptions: true,
            badge: true,
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
        prisma.siteConfig.findUnique({
          where: {
            key: "new_arrivals",
          },
        }),
      ]);

      return NextResponse.json({
        category: {
          name: newArrivals?.value || "New Arrivals",
          description:
            //@ts-expect-error
            newArrivals?.valueJson?.description ||
            "Check out our latest products",
          image:
            //@ts-expect-error
            newArrivals?.valueJson?.image ||
            "https://utfs.io/f/5aK3NZMlDfcg03ZMPBuFdU6kMY9NLjOwprPiWl8htS3Bygs7",
        },
        products,
        totalPages: 1,
        currentPage: 1,
      });
    }

    const [category, total] = await Promise.all([
      prisma.category.findUnique({
        where: { id: categoryId },
        select: {
          name: true,
          description: true,
          image: true,
          products: {
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
              weightOptions: true,
              rating: true,
              images: true,
              badge: true,
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
          },
        },
      }),
      prisma.product.count({
        where: {
          categoryId,
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

    if (!category) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 },
      );
    }

    const { products, ...categoryData } = category;

    return NextResponse.json({
      category: categoryData,
      products,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
    });
  } catch (error) {
    console.error("Failed to fetch category products:", error);
    return NextResponse.json(
      {
        category: null,
        products: [],
        totalPages: 0,
        currentPage: 1,
      },
      { status: 500 },
    );
  }
}
