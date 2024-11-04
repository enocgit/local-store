import { ProductCard } from "@/components/category/ProductCard";

interface Product {
  id: number;
  name: string;
  currentPrice: string;
  originalPrice: string;
  rating: number;
  reviews: number;
  image: string;
  badge?: string;
  category: string;
}

interface ProductGridProps {
  products: Product[];
}

export function ProductGrid({ products }: ProductGridProps) {
  return (
    <div className="flex-1">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
