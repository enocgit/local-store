//@ts-nocheck
import { prisma } from "@/lib/prisma";
import { DataTable } from "@/components/ui/data-table";
import { columns } from "./columns";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus } from "lucide-react";
import { Heading } from "@/components/ui/heading";

export default async function ProductsPage() {
  const products = await prisma.product.findMany({
    orderBy: {
      createdAt: "desc",
    },
    include: {
      category: true,
    },
  });

  const formattedProducts = products.map((product) => ({
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
        <Heading title="Products" description="Manage your products" />
        <Link href="/bridge/products/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Product
          </Button>
        </Link>
      </div>

      <DataTable columns={columns} data={formattedProducts} searchKey="name" />
    </div>
  );
}
