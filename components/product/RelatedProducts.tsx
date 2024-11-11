import { Product } from "@prisma/client";
import { getRelatedProducts } from "@/lib/api/products";
import { ProductCard } from "../category/ProductCard";

interface RelatedProductsProps {
  product: Product;
}

export async function RelatedProducts({ product }: RelatedProductsProps) {
  const products = await getRelatedProducts(product);

  if (products && products?.length === 0) {
    return null;
  }

  return (
    <div>
      <h2 className="mb-6 text-2xl font-bold">You May Also Like</h2>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {products?.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
