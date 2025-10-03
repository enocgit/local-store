import { prisma } from "@/lib/prisma";
import { Product } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";

export async function getFeaturedProducts() {
  try {
    return await prisma.product.findMany({
      where: {
        featured: true,
      },
      take: 4,
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
        stock: true,
        category: {
          select: {
            name: true,
          },
        },
        reviews: true,
      },
    });
  } catch (error) {
    console.error("Failed to fetch featured products:", error);
    return [];
  }
}

export async function getProductsByCategory(
  categoryId: string,
  minPrice?: number,
  maxPrice?: number,
) {
  try {
    if (categoryId === "new-arrivals") {
      const newArrivals = await prisma.product.findMany({
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
        take: 20,
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
      });

      return {
        name: "New Arrivals",
        description: "Check out our latest products",
        image:
          "https://images.unsplash.com/photo-1593642632845-7d4b3db9a4c5?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        products: newArrivals,
      };
    }

    return await prisma.category.findUnique({
      where: {
        id: categoryId,
      },
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
    });
  } catch (error) {
    console.error("Failed to fetch products by category:", error);
    return [];
  }
}

export async function getAllProducts(
  minPrice?: number,
  maxPrice?: number,
  page: number = 1,
  limit: number = 9,
) {
  try {
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

    return {
      products,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
    };
  } catch (error) {
    console.error("Failed to fetch products:", error);
    return {
      products: [],
      totalPages: 0,
      currentPage: 1,
    };
  }
}

export async function getProductById(productId: string) {
  try {
    return await prisma.product.findUnique({
      where: { id: productId },
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
        reviews: true,
      },
    });
  } catch (error) {
    console.error("Failed to fetch product:", error);
  }
}

export async function getRelatedProducts(product: Product) {
  try {
    return await prisma.product.findMany({
      where: {
        NOT: {
          id: product.id,
        },
        categoryId: product.categoryId,
      },
      take: 4,
    });
  } catch (error) {
    console.error("Failed to fetch related products:", error);
  }
}

export async function searchProducts(
  query: string,
  minPrice?: number,
  maxPrice?: number,
) {
  try {
    return await prisma.product.findMany({
      where: {
        OR: [
          { name: { contains: query, mode: "insensitive" } },
          { description: { contains: query, mode: "insensitive" } },
          { category: { name: { contains: query, mode: "insensitive" } } },
        ],
        ...(minPrice !== undefined &&
          maxPrice !== undefined && {
            price: {
              gte: minPrice,
              lte: maxPrice,
            },
          }),
      },
      select: {
        id: true,
        name: true,
        description: true,
        price: true,
        comparePrice: true,
        weightOptions: true,
        rating: true,
        images: true,
        stock: true,
        badge: true,
        category: {
          select: {
            name: true,
          },
        },
        reviews: true,
      },
    });
  } catch (error) {
    console.error("Failed to search products:", error);
    return [];
  }
}

export function useProduct(productId: string) {
  return useQuery({
    queryKey: ["product", productId],
    queryFn: async () => {
      const res = await fetch(`/api/products/${productId}`);
      if (!res.ok) throw new Error("Failed to fetch product");
      return res.json();
    },
  });
}
