import { prisma } from "@/lib/prisma";
import { ProductForm } from "../product-form";
import { notFound } from "next/navigation";

interface ProductPageProps {
  params: Promise<{ productId: string }>;
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { productId } = await params;
  
  const [product, categories] = await Promise.all([
    prisma.product.findUnique({
      where: {
        id: productId,
      },
    }),
    prisma.category.findMany({
      orderBy: {
        name: 'asc'
      }
    })
  ]);

  if (!product) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Edit Product</h2>
        <p className="text-muted-foreground">
          Make changes to your product
        </p>
      </div>

      <ProductForm
        categories={categories}
        initialData={{
          id: product.id,
          name: product.name,
          description: product.description,
          price: product.price,
          comparePrice: product.comparePrice,
          stock: product.stock,
          images: product.images,
          badge: product.badge,
          featured: product.featured || false,
          categoryId: product.categoryId,
          weightOptions: product.weightOptions,
        }}
      />
    </div>
  );
}
