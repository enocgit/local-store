import { prisma } from "@/lib/prisma";
import { DataTable } from "@/components/ui/data-table";
import { columns } from "./columns";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus } from "lucide-react";

export default async function CategoriesPage() {
  const categories = await prisma.category.findMany({
    orderBy: {
      createdAt: 'desc'
    },
    include: {
      _count: {
        select: { products: true }
      }
    }
  });

  const formattedCategories = categories.map(category => ({
    id: category.id,
    name: category.name,
    description: category.description,
    image: category.image,
    productsCount: category._count.products,
    createdAt: new Date(category.createdAt),
  }));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Categories</h2>
          <p className="text-muted-foreground">
            Manage product categories
          </p>
        </div>
        <Link href="/bridge/categories/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Category
          </Button>
        </Link>
      </div>

      <DataTable 
        columns={columns} 
        data={formattedCategories}
        searchKey="name"
      />
    </div>
  );
}
