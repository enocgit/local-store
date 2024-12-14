import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import * as z from "zod";

const productSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  price: z.number().min(0),
  comparePrice: z.number().min(0).nullable(),
  stock: z.number().min(0),
  images: z.array(z.string()).min(1),
  badge: z.string().nullable(),
  featured: z.boolean(),
  categoryId: z.string().min(1),
  weightOptions: z.array(z.number()).default([]),
});

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      orderBy: {
        createdAt: "desc",
      },
      include: {
        category: true,
      },
    });
    return NextResponse.json(products);
  } catch (error) {
    console.error("[PRODUCTS_GET]", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 },
    );
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth();

    if (!session?.user || session.user.role !== "ADMIN") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const validatedFields = productSchema.safeParse(body);

    if (!validatedFields.success) {
      return NextResponse.json({ error: "Invalid fields" }, { status: 400 });
    }

    const product = await prisma.product.create({
      data: {
        name: validatedFields.data.name,
        description: validatedFields.data.description,
        price: validatedFields.data.price,
        comparePrice: validatedFields.data.comparePrice,
        stock: validatedFields.data.stock,
        images: validatedFields.data.images,
        badge: validatedFields.data.badge,
        featured: validatedFields.data.featured,
        categoryId: validatedFields.data.categoryId,
        weightOptions: validatedFields.data.weightOptions,
      },
    });

    return NextResponse.json(product);
  } catch (error) {
    console.log(error);
    console.error("[PRODUCT_POST]", error);
    return NextResponse.json(
      { error: "Failed to create product" },
      { status: 500 },
    );
  }
}
