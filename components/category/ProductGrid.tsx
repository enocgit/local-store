import { ProductCard } from "@/components/category/ProductCard";
import { ProductType } from "@/interfaces";

interface ProductGridProps {
  products: ProductType[];
}

export function ProductGrid({ products }: ProductGridProps) {
  return (
    <div className="flex-1">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
        {products?.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
