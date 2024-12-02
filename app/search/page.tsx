import { searchProducts } from "@/lib/api/products";
import { Metadata } from "next";
import React from "react";
import Image from "next/image";
import { ProductGrid } from "@/components/product/ProductGrid";
import { FilterSidebar } from "@/components/product/FilterSidebar";
import { ProductType } from "@/interfaces";

export const metadata: Metadata = {
  title: "Search Products",
  description: "Search for your favorite products",
};

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const { q, minPrice, maxPrice } = await searchParams;
  const products = await searchProducts(
    q || "",
    minPrice ? Number(minPrice) : undefined,
    maxPrice ? Number(maxPrice) : undefined,
  );

  return (
    <div className="min-h-screen bg-background">
      <div className="relative flex h-[300px] items-center">
        <Image
          src="https://utfs.io/f/5aK3NZMlDfcg03ZMPBuFdU6kMY9NLjOwprPiWl8htS3Bygs7"
          alt="Search Products"
          fill
          className="object-cover brightness-50"
          priority
        />
        <div className="container relative z-10 mx-auto px-4">
          <div className="max-w-2xl">
            <h1 className="mb-4 text-4xl font-bold text-white">
              {q ? `Search Results for "${q}"` : "Search Products"}
            </h1>
            <p className="text-xl text-gray-200">
              {products.length} products found
            </p>
          </div>
        </div>
      </div>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col gap-8 lg:flex-row">
          <FilterSidebar />
          {products.length > 0 ? (
            <ProductGrid products={products as ProductType[]} />
          ) : (
            <div className="flex-1 py-10 text-center">
              <p className="text-xl text-gray-600">
                No products found matching your search.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
