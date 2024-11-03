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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ProductReviews } from "@/components/product/ProductReviews";
import { NutritionalInfo } from "@/components/product/NutritionalInfo";
import { RelatedProducts } from "@/components/product/RelatedProducts";

// This would typically come from an API or database
const products = {
  "1": {
    id: "1",
    name: "Premium Frozen Pizza Pack",
    description:
      "Artisanal frozen pizzas made with organic ingredients and our signature sourdough crust. Each pack contains 2 Margherita and 2 Pepperoni pizzas.",
    currentPrice: "$12.99",
    originalPrice: "$15.99",
    rating: 4.5,
    reviews: 128,
    image:
      "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=800&q=80",
    badge: "Best Seller",
    category: "frozen-foods",
    stock: 15,
    servingSize: "1/4 pizza (156g)",
    servingsPerContainer: 16,
    preparationTime: "12-15 minutes",
    storageInstructions:
      "Keep frozen at 0°F (-18°C) or below. Do not thaw before cooking.",
    ingredients: [
      "Organic Wheat Flour",
      "Purified Water",
      "Extra Virgin Olive Oil",
      "Sea Salt",
      "Active Dry Yeast",
      "Organic Tomatoes",
      "Fresh Mozzarella",
      "Fresh Basil",
      "Italian Herbs",
    ],
    allergens: ["Wheat", "Milk"],
    nutritionalFacts: {
      calories: 320,
      totalFat: 14,
      saturatedFat: 6,
      transFat: 0,
      cholesterol: 30,
      sodium: 680,
      totalCarbohydrates: 34,
      dietaryFiber: 2,
      sugars: 3,
      protein: 15,
      vitamins: {
        vitaminD: 2,
        calcium: 15,
        iron: 10,
        potassium: 4,
      },
    },
    certifications: ["USDA Organic", "Non-GMO Project Verified"],
    dietaryInfo: ["Vegetarian Option Available"],
    relatedProducts: ["2", "3", "4"],
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
  params: { id: string };
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
              <span className="text-3xl font-bold">{product.currentPrice}</span>
              <span className="text-xl text-gray-500 line-through">
                {product.originalPrice}
              </span>
            </div>

            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Clock className="h-4 w-4" />
              <span>Prep Time: {product.preparationTime}</span>
            </div>

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
                <span>100% Quality Guarantee</span>
              </div>
            </div>

            {/* Certifications */}
            <div className="flex flex-wrap gap-2">
              {product.certifications.map((cert) => (
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
            <TabsTrigger value="nutrition">Nutrition Facts</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="mt-6">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
              <div className="space-y-6">
                <div>
                  <h3 className="mb-2 text-lg font-semibold">Ingredients</h3>
                  <ul className="list-inside list-disc space-y-1 text-gray-600">
                    {product.ingredients.map((ingredient) => (
                      <li key={ingredient}>{ingredient}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="mb-2 text-lg font-semibold">
                    Storage Instructions
                  </h3>
                  <p className="text-gray-600">{product.storageInstructions}</p>
                </div>

                <div>
                  <h3 className="mb-2 text-lg font-semibold">
                    Allergen Information
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {product.allergens.map((allergen) => (
                      <Badge key={allergen} variant="destructive">
                        Contains {allergen}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <h3 className="mb-2 text-lg font-semibold">
                  Preparation Guide
                </h3>
                <div className="rounded-lg bg-gray-50 p-6">
                  <ol className="list-inside list-decimal space-y-4 text-gray-600">
                    <li>Preheat oven to 425°F (220°C)</li>
                    <li>Remove pizza from all packaging and shrink wrap</li>
                    <li>Place pizza directly on center oven rack</li>
                    <li>
                      Bake for 12-15 minutes or until cheese is melted and crust
                      is golden brown
                    </li>
                    <li>Let stand 2-3 minutes before serving</li>
                  </ol>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="nutrition">
            <NutritionalInfo
              servingSize={product.servingSize}
              servingsPerContainer={product.servingsPerContainer}
              nutritionalFacts={product.nutritionalFacts}
            />
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
