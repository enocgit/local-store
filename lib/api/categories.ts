import { prisma } from "@/lib/prisma";

export async function getCategories() {
  try {
    return await prisma.category.findMany({
      select: {
        id: true,
        name: true,
        description: true,
        image: true,
      },
    });
  } catch (error) {
    console.error("Failed to fetch categories:", error);
    return [];
  }
}
