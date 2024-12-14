"use client";

import { Product } from "@prisma/client";
import { ProductCard } from "../category/ProductCard";
import { ProductType } from "@/interfaces";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "../ui/skeleton";

interface RelatedProductsProps {
  product: Product;
}

export function RelatedProducts({ product }: RelatedProductsProps) {
  const { data: products, isLoading } = useQuery({
    queryKey: ["relatedProducts", product.id],
    queryFn: async () => {
      const response = await fetch(`/api/products/${product.id}/related`);
      return response.json();
    },
  });

  if (isLoading) {
    return (
      <div>
        <h2 className="mb-6 text-2xl font-bold">You May Also Like</h2>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="aspect-square" />
          ))}
        </div>
      </div>
    );
  }

  if (!products || products.length === 0) {
    return null;
  }

  return (
    <div>
      <h2 className="mb-6 text-2xl font-bold">You May Also Like</h2>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {products.map((product: ProductType) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
