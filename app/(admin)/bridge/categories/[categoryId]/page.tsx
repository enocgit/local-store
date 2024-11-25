import { prisma } from "@/lib/prisma";
import { CategoryForm } from "../category-form";
import { notFound } from "next/navigation";

interface CategoryPageProps {
  params: Promise<{ categoryId: string }>;
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { categoryId } = await params;
  const category = await prisma.category.findUnique({
    where: {
      id: categoryId,
    },
  });

  if (!category) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Edit Category</h2>
        <p className="text-muted-foreground">
          Make changes to the category
        </p>
      </div>

      <CategoryForm 
        initialData={{
          name: category.name,
          description: category.description,
          image: category.image,
        }}
        categoryId={category.id}
      />
    </div>
  );
}
