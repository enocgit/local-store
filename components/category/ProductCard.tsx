"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import RatingStars from "../RatingStars";
import { calculatePriceForDate, formatPrice } from "@/lib/utils";
import { ProductCardProps } from "@/interfaces";
import { useCart } from "@/lib/store/cart-context";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";

export function ProductCard({ product }: ProductCardProps) {
  const { state, dispatch } = useCart();
  const { toast } = useToast();

  const currentPrice = calculatePriceForDate(product.price, state.deliveryDate);

  const handleAddToCart = () => {
    dispatch({
      type: "ADD_ITEM",
      payload: {
        id: product.id,
        name: product.name,
        price: currentPrice,
        image: product.images[0].publicUrl,
        quantity: 1,
        // weight: selectedWeight,
      },
    });

    toast({
      title: "Added to cart",
      description: "Your item has been added to the cart",
    });
  };

  return (
    <Card className="group overflow-hidden">
      <Link href={`/product/${product.id}`}>
        <div className="relative h-64">
          <Image
            src={product.images?.[0]?.publicUrl}
            alt={product.name || ""}
            fill
            className="object-cover transition-transform group-hover:scale-105"
          />
          {product.badge && (
            <span className="absolute right-2 top-2 rounded-md bg-primary px-2 py-1 text-sm text-white">
              {product.badge}
            </span>
          )}
        </div>
      </Link>
      <CardContent className="p-4">
        <h3 className="mb-2 font-semibold">{product?.name}</h3>
        <div className="mb-2 flex items-center space-x-2">
          <RatingStars rating={product?.rating} />
          <span className="text-sm text-gray-600">
            ({product.reviews?.length})
          </span>
        </div>
        <div className="mt-2 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-lg font-bold">
              {formatPrice(product.price)}
            </span>
            {product.comparePrice ? (
              <span className="text-sm text-gray-500 line-through">
                {formatPrice(product.comparePrice)}
              </span>
            ) : null}
          </div>
          <Button variant="ghost" size="sm" onClick={handleAddToCart}>
            Add to Cart
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
