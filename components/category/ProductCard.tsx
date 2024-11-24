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
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";

export function ProductCard({ product }: ProductCardProps) {
  const { state, dispatch } = useCart();
  const { toast } = useToast();
  const [showWeightDialog, setShowWeightDialog] = useState(false);
  const [selectedWeight, setSelectedWeight] = useState<number>();

  const currentPrice = calculatePriceForDate(
    product?.price,
    state?.deliveryDate,
  );

  const handleAddToCart = () => {
    if (product?.weightOptions?.length && !selectedWeight) {
      setShowWeightDialog(true);
      return;
    }

    dispatch({
      type: "ADD_ITEM",
      payload: {
        id: product?.id,
        name: product?.name,
        price: currentPrice,
        image: product?.images[0].publicUrl,
        quantity: 1,
        weight: selectedWeight,
        weightOptions: product?.weightOptions,
      },
    });

    toast({
      title: "Added to cart",
      description: "Your item has been added to the cart",
    });

    setShowWeightDialog(false);
    setSelectedWeight(undefined);
  };

  return (
    <Card className="group overflow-hidden">
      <Link href={`/product/${product?.id}`}>
        <div className="relative h-64">
          <Image
            src={product?.images?.[0]?.publicUrl}
            alt={product?.name || ""}
            fill
            className="object-cover transition-transform group-hover:scale-105"
          />
          {product?.badge && (
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
            ({product?.reviews?.length})
          </span>
        </div>
        <div className="mt-2 flex items-center justify-between">

          <div className="flex items-center space-x-2">
            <span className="text-lg font-bold">
              {formatPrice(product?.price)}
            </span>
            {product?.comparePrice ? (
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

      <Dialog open={showWeightDialog} onOpenChange={setShowWeightDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Select Weight</DialogTitle>
            <DialogDescription>
              Please select the weight for {product?.name}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <Select
              value={selectedWeight?.toString()}
              onValueChange={(value) => setSelectedWeight(parseFloat(value))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Choose weight" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">
                  1 kg - {formatPrice(currentPrice)}
                </SelectItem>
                {product?.weightOptions?.map((weight: number) => (
                  <SelectItem key={weight} value={weight.toString()}>
                    {weight} kg - {formatPrice(currentPrice * weight)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button className="w-full" onClick={handleAddToCart}>
              Add to Cart
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  )
}
