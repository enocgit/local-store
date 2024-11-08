import React from "react";
import { ProductCard } from "../category/ProductCard";

const products = [
  {
    id: 1,
    name: "Premium Frozen Pizza Pack",
    currentPrice: "$12.99",
    originalPrice: "$15.99",
    rating: 4.5,
    reviews: 128,
    image:
      "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=800&q=80",
    badge: "Best Seller",
    category: "frozen-foods",
  },
  {
    id: 2,
    name: "Organic Mixed Berries",
    currentPrice: "$8.99",
    originalPrice: "$10.99",
    rating: 4.8,
    reviews: 96,
    image:
      "https://images.unsplash.com/photo-1563746098251-d35aef196e83?auto=format&fit=crop&w=800&q=80",
    badge: "Organic",
    category: "frozen-foods",
  },
  {
    id: 3,
    name: "Premium Ice Cream Pack",
    currentPrice: "$14.99",
    originalPrice: "$19.99",
    rating: 3,
    reviews: 215,
    image:
      "https://images.unsplash.com/photo-1497034825429-c343d7c6a68f?auto=format&fit=crop&w=800&q=80",
    badge: "Limited Time",
    category: "fresh-produce",
  },
  {
    id: 4,
    name: "Frozen Vegetable Mix",
    currentPrice: "$6.99",
    originalPrice: "$8.99",
    rating: 4.3,
    reviews: 167,
    image:
      "https://images.unsplash.com/photo-1526738549149-8e07eca6c147?auto=format&fit=crop&w=800&q=80",
    category: "fresh-produce",
  },
];

function FeaturedProducts() {
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
