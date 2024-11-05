import Image from "next/image";
import { notFound } from "next/navigation";
import {
  Star,
  StarHalf,
  Clock,
  ShoppingCart,
  Heart,
  Share2,
  Shield,
  Scale,
} from "lucide-react";
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
import { ProductReviews } from "@/components/product/ProductReviews";
import { RelatedProducts } from "@/components/product/RelatedProducts";

// This would typically come from an API or database
const products: Record<string, any> = {
  "1": {
    id: "1",
    name: "Fresh Atlantic Salmon",
    description:
      "Premium fresh Atlantic salmon, perfect for grilling or baking. Rich in omega-3 fatty acids and protein.",
    currentPrice: 12.99, // Price per kg
    originalPrice: 15.99,
    rating: 4.5,
    reviews: 128,
    image:
      "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=800&q=80",
    badge: "Fresh Today",
    category: "seafood",
    stock: 50, // in kg
    origin: "Scotland",
    storageInstructions:
      "Keep refrigerated at 0-4°C. Consume within 2 days of purchase.",
    weightOptions: [0.5, 1, 1.5, 2], // in kg
    certifications: ["Responsibly Sourced", "MSC Certified"],
    dietaryInfo: ["High Protein", "Omega-3 Rich"],
    relatedProducts: ["2", "3", "4"],
  },
  "2": {
    id: "2",
    name: "Nigerian Yam",
    description:
      "Fresh, high-quality Nigerian yam. Perfect for pounding or boiling.",
    currentPrice: 4.99,
    originalPrice: 6.99,
    rating: 4.8,
    reviews: 96,
    image:
      "https://images.unsplash.com/photo-1590165482129-1b8b27698780?auto=format&fit=crop&w=800&q=80",
    badge: "Best Quality",
    category: "tubers",
    stock: 200,
    origin: "Nigeria",
    storageInstructions:
      "Store in a cool, dry place. Can last up to 2-3 weeks.",
    weightOptions: [1, 2, 5, 10], // in kg
    certifications: ["Premium Quality"],
    dietaryInfo: ["Gluten-Free", "Vegan"],
    relatedProducts: ["3", "4", "5"],
  },
};

function RatingStars({ rating }: { rating: number }) {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;

  return (
    <div className="flex items-center">
      {[...Array(fullStars)].map((_, i) => (
        <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
      ))}
      {hasHalfStar && (
        <StarHalf className="h-5 w-5 fill-yellow-400 text-yellow-400" />
      )}
      {[...Array(5 - Math.ceil(rating))].map((_, i) => (
        <Star key={`empty-${i}`} className="h-5 w-5 text-gray-300" />
      ))}
    </div>
  );
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = products[id];

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
              src={product.image}
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
                  ({product.reviews} reviews)
                </span>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <span className="text-3xl font-bold">
                £{product.currentPrice}
                {product.weightOptions ? "/kg" : ""}
              </span>
              <span className="text-xl text-gray-500 line-through">
                £{product.originalPrice}
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
                        {weight} kg - £
                        {(product.currentPrice * weight).toFixed(2)}
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
                  <span className="font-semibold">Origin:</span>
                  <p className="text-gray-600">{product.origin}</p>
                </div>
                <div>
                  <span className="font-semibold">Stock:</span>
                  <p className="text-gray-600">
                    {product.stock} {product.weightOptions ? "kg" : "units"}{" "}
                    available
                  </p>
                </div>
              </div>

              <div className="text-sm">
                <span className="font-semibold">Storage Instructions:</span>
                <p className="text-gray-600">{product.storageInstructions}</p>
              </div>
            </div>

            {/* Certifications & Dietary Info */}
            <div className="flex flex-wrap gap-2">
              {product.certifications.map((cert: string) => (
                <Badge key={cert} variant="secondary">
                  {cert}
                </Badge>
              ))}
              {product.dietaryInfo.map((info: string) => (
                <Badge key={info} variant="outline">
                  {info}
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

                <div>
                  <h3 className="mb-2 text-lg font-semibold">
                    Storage Instructions
                  </h3>
                  <p className="text-gray-600">{product.storageInstructions}</p>
                </div>

                {product.dietaryInfo.length > 0 && (
                  <div>
                    <h3 className="mb-2 text-lg font-semibold">
                      Dietary Information
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {product.dietaryInfo.map((info: string) => (
                        <Badge key={info} variant="outline">
                          {info}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
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
                    {product.certifications.map((cert: string) => (
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
              totalReviews={product.reviews}
            />
          </TabsContent>
        </Tabs>

        {/* Related Products */}
        <RelatedProducts productIds={product.relatedProducts} />
      </div>
    </div>
  );
}
