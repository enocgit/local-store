import { prisma } from "@/lib/prisma";
import { Product } from "@prisma/client";

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
    console.error("Failed to fetch featured products:", error);
    return [];
  }
}

export async function getProductsByCategory(categoryId: string) {
  try {
    return await prisma.category.findUnique({
      where: {
        id: categoryId,
      },
      select: {
        name: true,
        description: true,
        image: true,
        products: {
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
        },
      },
    });
  } catch (error) {
    console.error("Failed to fetch products by category:", error);
    return [];
  }
}

export async function getAllProducts() {
  try {
    return await prisma.product.findMany();
  } catch (error) {
    console.error("Failed to fetch products:", error);
  }
}

export async function getProductById(productId: string) {
  try {
    return await prisma.product.findUnique({
      where: { id: productId },
      include: { reviews: true, images: true },
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
