"use client";

import React from "react";
import { ShoppingCart, Heart, Share2, Shield, Scale } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
// import { RelatedProducts } from "@/components/product/RelatedProducts";
import { calculatePriceForDate, formatPrice } from "@/lib/utils";
import RatingStars from "@/components/RatingStars";
import { ProductReviews } from "@/components/product/ProductReviews";
import { ProductGallery } from "@/components/product/ProductGallery";
import { useState } from "react";
import { useCart } from "@/lib/store/cart-context";
import { Product, Review } from "@prisma/client";
import { useToast } from "@/hooks/use-toast";
import { Session } from "next-auth";
import { WishlistButton } from "../ui/wishlist-button";

interface ProductWithDetails extends Product {
  reviews: Review[];
}

type Props = {
  product: ProductWithDetails; // Update the Props type
  session: Session | null;
};

function ProductDetailPage({ product, session }: Props) {
  const [selectedWeight, setSelectedWeight] = useState<number>();
  const { state, dispatch } = useCart();
  const { toast } = useToast();

  const currentPrice = calculatePriceForDate(product.price, state.deliveryDate);

  const handleAddToCart = () => {
    if (product?.weightOptions?.length && !selectedWeight) {
      toast({
        title: "Please select a weight",
        variant: "destructive",
      });
      return;
    }

    dispatch({
      type: "ADD_ITEM",
      payload: {
        id: product.id,
        name: product.name,
        price: currentPrice,
        image: product.images[0],
        weight: selectedWeight,
        weightOptions: product.weightOptions,
        quantity: 1,
      },
    });

    toast({
      title: "Added to cart",
      description: "Your item has been added to the cart",
    });
  };

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4">
        {/* Product Overview */}
        <div className="mb-12 grid grid-cols-1 gap-8 md:grid-cols-2">
          {/* Product Gallery */}
          <ProductGallery images={product.images} badge={product.badge} />

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <h1 className="mb-2 text-3xl font-bold">{product.name}</h1>
              <p className="mb-4 text-gray-600">{product.description}</p>
              <div className="flex items-center space-x-4">
                <RatingStars rating={product.rating} />
                <span className="text-sm text-gray-600">
                  ({product.reviews.length} reviews)
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <span className="text-3xl font-bold">
                {formatPrice(currentPrice)}
                {product.weightOptions.length ? " per kg" : ""}
              </span>
              {selectedWeight && (
                <div className="text-xl text-gray-600">
                  Total: {formatPrice(currentPrice * selectedWeight)}
                </div>
              )}
            </div>

            {product.weightOptions?.length > 0 && (
              <div className="space-y-2">
                <label className="flex items-center text-sm font-medium">
                  <Scale className="mr-2 h-4 w-4" />
                  Select Weight
                </label>
                <Select
                  value={selectedWeight?.toString()}
                  onValueChange={(value) =>
                    setSelectedWeight(parseFloat(value))
                  }
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Choose weight" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">
                      1 kg - {formatPrice(currentPrice)}
                    </SelectItem>
                    {product.weightOptions.map((weight: number) => (
                      <SelectItem key={weight} value={weight.toString()}>
                        {weight} kg - {formatPrice(currentPrice * weight)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="space-y-4">
              <div className="flex space-x-4">
                <Button className="flex-1" onClick={handleAddToCart}>
                  <ShoppingCart className="mr-2 h-4 w-4" /> Add to Cart
                </Button>
                <WishlistButton productId={product.id} />
                <Button
                  variant="outline"
                  size="icon"
                  title="Share"
                  aria-label="Share"
                >
                  <Share2 className="h-4 w-4" />
                </Button>
              </div>

              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Shield className="h-4 w-4" />
                <span>Quality Guaranteed</span>
              </div>
            </div>

            {/* Product Details */}
            <div className="space-y-4 border-t pt-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-semibold">Stock:</span>
                  <p className="text-gray-600">
                    {product.stock} units
                    available
                  </p>
                </div>
              </div>
            </div>

            {/* Certifications & Dietary Info */}
            <div className="flex flex-wrap gap-2">
              {product.certifications.map((cert: string) => (
                <Badge key={cert} variant="secondary">
                  {cert}
                </Badge>
              ))}
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <Tabs defaultValue="details" className="mb-12">
          <TabsList className="w-full justify-start">
            <TabsTrigger value="details">Product Details</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="mt-6">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
              <div className="space-y-6">
                <div>
                  <h3 className="mb-2 text-lg font-semibold">
                    Product Information
                  </h3>
                  <p className="text-gray-600">{product.description}</p>
                </div>

                {product.storageInstructions ? (
                  <div>
                    <h3 className="mb-2 text-lg font-semibold">
                      Storage Instructions
                    </h3>
                    <p className="text-gray-600">
                      {product.storageInstructions}
                    </p>
                  </div>
                ) : null}
              </div>

              <div>
                <h3 className="mb-2 text-lg font-semibold">
                  Quality Assurance
                </h3>
                <div className="rounded-lg bg-gray-50 p-6">
                  <ul className="space-y-4 text-gray-600">
                    <li className="flex items-start">
                      <Shield className="mr-2 mt-0.5 h-5 w-5 text-green-600" />
                      <span>
                        All our products are carefully selected and quality
                        checked
                      </span>
                    </li>
                    {product?.certifications.map((cert: string) => (
                      <li key={cert} className="flex items-start">
                        <Shield className="mr-2 mt-0.5 h-5 w-5 text-green-600" />
                        <span>{cert}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="reviews">
            <ProductReviews
              productId={product.id}
              rating={product.rating}
              totalReviews={product.reviews.length}
            />
          </TabsContent>
        </Tabs>

        {/* Related Products */}
        {/* <RelatedProducts product={product} /> */}
      </div>
    </div>
  );
}

export default ProductDetailPage;
