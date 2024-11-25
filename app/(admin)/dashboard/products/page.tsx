//@ts-nocheck
import { prisma } from "@/lib/prisma";
import { DataTable } from "@/components/ui/data-table";
import { columns } from "./columns";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus } from "lucide-react";

export default async function ProductsPage() {
  const products = await prisma.product.findMany({
    orderBy: {
      createdAt: 'desc'
    },
    include: {
      category: true,
    }
  });

  const formattedProducts = products.map(product => ({
    id: product.id,
    name: product.name,
    description: product.description,
    price: product.price,
    comparePrice: product.comparePrice,
    stock: product.stock,
    images: product.images,
    badge: product.badge,
    featured: product.featured,
    categoryName: product.category.name,
    createdAt: new Date(product.createdAt),
  }));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Products</h2>
          <p className="text-muted-foreground">
            Manage your product catalog
          </p>
        </div>
        <Link href="/dashboard/products/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Product
          </Button>
        </Link>
      </div>

      <DataTable 
        columns={columns} 
        data={formattedProducts}
        searchKey="name"
      />
    </div>
  );
}
