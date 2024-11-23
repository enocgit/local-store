"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function addToWishlist(userId: string, productId: string) {
  try {
    if (!userId) {
      throw new Error("User not authenticated");
    }

    const wishlist = await prisma.user.update({
      where: { id: userId },
      data: {
        wishlist: {
          connect: { id: productId },
        },
      },
    });

    revalidatePath("/products/[id]");
    return { success: true };
  } catch (error) {
    console.error("ADD_TO_WISHLIST_ERROR", error);
    return { success: false };
  }
}
