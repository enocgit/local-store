import Image from "next/image";
import { notFound } from "next/navigation";
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
import { RelatedProducts } from "@/components/product/RelatedProducts";
import { getProductById } from "@/lib/api/products";
import { formatPrice } from "@/lib/utils";
import RatingStars from "@/components/RatingStars";
import { ProductReviews } from "@/components/product/ProductReviews";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await getProductById(id);

  if (!product) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4">
        {/* Product Overview */}
        <div className="mb-12 grid grid-cols-1 gap-8 md:grid-cols-2">
          {/* Product Image */}
          <div className="relative h-[400px] overflow-hidden rounded-lg md:h-[500px]">
            <Image
              src={product.images[0].publicUrl}
              alt={product.name}
              fill
              className="object-cover"
              priority
            />
            {product.badge && (
              <Badge className="absolute right-4 top-4">{product.badge}</Badge>
            )}
          </div>

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

            <div className="flex items-center space-x-4">
              <span className="text-3xl font-bold">
                {formatPrice(product.price)}
                {product.weightOptions ? "/kg" : ""}
              </span>
              <span className="text-xl text-gray-500 line-through">
                {product.comparePrice && formatPrice(product.comparePrice)}
                {product.weightOptions ? "/kg" : ""}
              </span>
            </div>

            {product.weightOptions && (
              <div className="space-y-2">
                <label className="flex items-center text-sm font-medium">
                  <Scale className="mr-2 h-4 w-4" />
                  Select Weight
                </label>
                <Select>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Choose weight" />
                  </SelectTrigger>
                  <SelectContent>
                    {product.weightOptions.map((weight: number) => (
                      <SelectItem key={weight} value={weight.toString()}>
                        {weight} kg - £{(product.price * weight).toFixed(2)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="space-y-4">
              <div className="flex space-x-4">
                <Button className="flex-1">
                  <ShoppingCart className="mr-2 h-4 w-4" /> Add to Cart
                </Button>
                <Button variant="outline" size="icon">
                  <Heart className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon">
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
                    {product.stock} {product.weightOptions ? "kg" : "units"}{" "}
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
        <RelatedProducts product={product} />
      </div>
    </div>
  );
}
