"use client";

import React, { useEffect } from "react";
import { ProductGrid } from "@/components/product/ProductGrid";
import { FilterSidebar } from "@/components/product/FilterSidebar";
import { ProductType } from "@/interfaces";
import { CategoryHeader } from "@/components/category/CategoryHeader";
import { useInView } from "react-intersection-observer";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { useSearchParams } from "next/navigation";

export default function ProductsPage() {
  const searchParams = useSearchParams();
  const minPrice = searchParams.get("minPrice");
  const maxPrice = searchParams.get("maxPrice");
  const { ref, inView } = useInView();

  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery({
      initialPageParam: 1,
      queryKey: ["products", minPrice, maxPrice],
      queryFn: async ({ pageParam = 1 }) => {
        const url = new URL("/api/products/infinite", window.location.origin);
        url.searchParams.set("page", pageParam.toString());
        url.searchParams.set("limit", "9");
        if (minPrice) url.searchParams.set("minPrice", minPrice);
        if (maxPrice) url.searchParams.set("maxPrice", maxPrice);

        const response = await fetch(url);
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      },
      getNextPageParam: (lastPage) =>
        lastPage.currentPage < lastPage.totalPages
          ? lastPage.currentPage + 1
          : undefined,
    });

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, fetchNextPage, hasNextPage]);

  const allProducts = data?.pages.flatMap((page) => page.products) ?? [];

  if (isLoading) {
    return (
      <div className="flex justify-center p-10">
        <Loader2 className="animate-spin" />
      </div>
    );
  }

  if (allProducts.length === 0) {
    return <p className="p-10">No products found. Please check back later.</p>;
  }

  return (
    <div className="min-h-screen bg-background">
      <CategoryHeader
        title="All Products"
        description="Browse through our complete collection of products"
        image="https://utfs.io/f/5aK3NZMlDfcg03ZMPBuFdU6kMY9NLjOwprPiWl8htS3Bygs7"
      />
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col gap-8 lg:flex-row">
          <FilterSidebar />
          <div className="flex-1">
            <ProductGrid products={allProducts as ProductType[]} />
            <div ref={ref} className="flex w-full justify-center py-8">
              {isFetchingNextPage && <Loader2 className="animate-spin" />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
