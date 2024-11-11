"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import RatingStars from "../RatingStars";
import { formatPrice } from "@/lib/utils";
import { Review } from "@prisma/client";
import { ProductCardProps } from "@/interfaces";

export function ProductCard({ product }: ProductCardProps) {
  return (
    <a href={`/product/${product.id}`}>
      <Card className="group overflow-hidden">
        <div className="relative h-64">
          <Image
            src={product.images?.[0].publicUrl}
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
        <CardContent className="p-4">
          <h3 className="mb-2 font-semibold">{product?.name}</h3>
          <div className="mb-2 flex items-center space-x-2">
            <RatingStars rating={product?.rating} />
            <span className="text-sm text-gray-600">
              ({product.reviews.length})
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
            <Button variant="ghost" size="sm">
              Add to Cart
            </Button>
          </div>
        </CardContent>
      </Card>
    </a>
  );
}
