import { prisma } from "@/lib/prisma";
import { ProductForm } from "../product-form";

export default async function NewProductPage() {
  const categories = await prisma.category.findMany({
    orderBy: {
      name: 'asc'
    }
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">New Product</h2>
        <p className="text-muted-foreground">
          Create a new product in your catalog
        </p>
      </div>

      <ProductForm categories={categories} />
    </div>
  );
}
