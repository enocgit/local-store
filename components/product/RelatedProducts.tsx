import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";

// Mock data - would typically come from an API
const products = {
  "2": {
    id: "2",
    name: "Frozen Mixed Vegetables",
    currentPrice: "$6.99",
    image:
      "https://images.unsplash.com/photo-1571651332185-1aaf0c70a5c5?auto=format&fit=crop&w=800&q=80",
  },
  "3": {
    id: "3",
    name: "Premium Ice Cream Pack",
    currentPrice: "$14.99",
    image:
      "https://images.unsplash.com/photo-1497034825429-c343d7c6a68f?auto=format&fit=crop&w=800&q=80",
  },
  "4": {
    id: "4",
    name: "Frozen Berry Mix",
    currentPrice: "$8.99",
    image:
      "https://images.unsplash.com/photo-1563746098251-d35aef196e83?auto=format&fit=crop&w=800&q=80",
  },
};

interface RelatedProductsProps {
  productIds: string[];
}

export function RelatedProducts({ productIds }: RelatedProductsProps) {
  return (
    <div>
      <h2 className="mb-6 text-2xl font-bold">You May Also Like</h2>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {productIds.map((id) => {
          const product = products[id];
          return (
            <Link key={id} href={`/product/${id}`}>
              <Card className="group overflow-hidden">
                <div className="relative h-48">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover transition-transform group-hover:scale-105"
                  />
                </div>
                <CardContent className="p-4">
                  <h3 className="mb-2 font-semibold">{product.name}</h3>
                  <span className="text-lg font-bold">
                    {product.currentPrice}
                  </span>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
