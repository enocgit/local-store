import { getAllProducts } from "@/lib/api/products";
import { Metadata } from "next";
import React from "react";
import Image from "next/image";
import { ProductGrid } from "@/components/product/ProductGrid";
import { FilterSidebar } from "@/components/product/FilterSidebar";
import { ProductType } from "@/interfaces";

export const metadata: Metadata = {
  title: "Products",
  description: "Browse all our amazing products",
};

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const { minPrice, maxPrice } = await searchParams;
  const products = await getAllProducts(minPrice ? Number(minPrice) : undefined, maxPrice ? Number(maxPrice) : undefined);

  if (products.length === 0) {
    return <p className="p-10">No products found. Please check back later.</p>;
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="relative flex h-[300px] items-center">
        <Image
          src="https://utfs.io/f/5aK3NZMlDfcg03ZMPBuFdU6kMY9NLjOwprPiWl8htS3Bygs7"
          alt="Vegatables"
          fill
          className="object-cover brightness-50"
          priority
        />
        <div className="container relative z-10 mx-auto px-4">
          <div className="max-w-2xl">
            <h1 className="mb-4 text-4xl font-bold text-white">All Products</h1>
            <p className="text-xl text-gray-200">
              Browse through our complete collection of products
            </p>
          </div>
        </div>
      </div>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col gap-8 lg:flex-row">
          <FilterSidebar />
          <ProductGrid products={products as ProductType[]} />
        </div>
      </div>
    </div>
  );
}
