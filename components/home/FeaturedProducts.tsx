import React from "react";
import { ProductCard } from "../category/ProductCard";
import { getFeaturedProducts } from "@/lib/api/products";

async function FeaturedProducts() {
  const products = await getFeaturedProducts();

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <h2 className="mb-8 text-3xl font-bold">Featured Products</h2>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default FeaturedProducts;
