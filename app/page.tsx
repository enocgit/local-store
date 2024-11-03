import {
  ShoppingBag,
  Truck,
  Shield,
  Clock,
  ArrowRight,
  Star,
  StarHalf,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";

const features = [
  {
    icon: <Truck className="h-6 w-6" />,
    title: "Express Delivery",
    description: "Same-day delivery available",
  },
  {
    icon: <Shield className="h-6 w-6" />,
    title: "Quality Guaranteed",
    description: "Fresh or full refund",
  },
  {
    icon: <Clock className="h-6 w-6" />,
    title: "24/7 Support",
    description: "Always here to help",
  },
];

const products = [
  {
    id: 1,
    name: "Premium Frozen Pizza Pack",
    currentPrice: "$12.99",
    originalPrice: "$15.99",
    rating: 4.5,
    reviews: 128,
    image:
      "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=800&q=80",
    badge: "Best Seller",
  },
  {
    id: 2,
    name: "Organic Mixed Berries",
    currentPrice: "$8.99",
    originalPrice: "$10.99",
    rating: 4.8,
    reviews: 96,
    image:
      "https://images.unsplash.com/photo-1563746098251-d35aef196e83?auto=format&fit=crop&w=800&q=80",
    badge: "Organic",
  },
  {
    id: 3,
    name: "Premium Ice Cream Pack",
    currentPrice: "$14.99",
    originalPrice: "$19.99",
    rating: 3,
    reviews: 215,
    image:
      "https://images.unsplash.com/photo-1497034825429-c343d7c6a68f?auto=format&fit=crop&w=800&q=80",
    badge: "Limited Time",
  },
  {
    id: 4,
    name: "Frozen Vegetable Mix",
    currentPrice: "$6.99",
    originalPrice: "$8.99",
    rating: 4.3,
    reviews: 167,
    image:
      "https://images.unsplash.com/photo-1526738549149-8e07eca6c147?auto=format&fit=crop&w=800&q=80",
  },
];

const categories = [
  {
    name: "Frozen Foods",
    description: "Premium quality frozen meals and ingredients",
    image:
      "https://images.unsplash.com/photo-1603137071981-8c4ed11cad9c?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Fresh Produce",
    description: "Farm-fresh fruits and vegetables",
    image:
      "https://images.unsplash.com/photo-1610348725531-843dff563e2c?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Dairy & Eggs",
    description: "Fresh dairy products and free-range eggs",
    image:
      "https://images.unsplash.com/photo-1630431341973-02e1b662ec35?auto=format&fit=crop&w=800&q=80",
  },
];

const RatingStars = ({ rating }: { rating: number }) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;

  return (
    <div className="flex items-center">
      {[...Array(fullStars)].map((_, i) => (
        <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
      ))}
      {hasHalfStar && (
        <StarHalf className="h-4 w-4 fill-yellow-400 text-yellow-400" />
      )}
      {[...Array(5 - Math.ceil(rating))].map((_, i) => (
        <Star key={`empty-${i}`} className="h-4 w-4 text-gray-300" />
      ))}
    </div>
  );
};

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative flex h-[600px] items-center">
        <Image
          src="https://images.unsplash.com/photo-1606787366850-de6330128bfc?auto=format&fit=crop&w=1920&q=80"
          alt="Fresh food background"
          fill
          className="object-cover brightness-50"
          priority
        />
        <div className="container relative z-10 mx-auto px-4">
          <div className="max-w-2xl">
            <h1 className="mb-6 text-5xl font-bold text-white">
              Fresh Food, Delivered Fresh
            </h1>
            <p className="mb-8 text-xl text-gray-200">
              Premium quality frozen foods and fresh ingredients delivered to
              your doorstep
            </p>
            <Button size="lg" className="bg-white text-black hover:bg-gray-100">
              Shop Now <ShoppingBag className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {features.map((feature, index) => (
              <div
                key={index}
                className="flex items-center space-x-4 rounded-lg bg-gray-50 p-6"
              >
                <div className="rounded-full bg-primary/10 p-3">
                  {feature.icon}
                </div>
                <div>
                  <h3 className="font-semibold">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="mb-8 text-3xl font-bold">Featured Products</h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            {products.map((product) => (
              <Card key={product.id} className="group overflow-hidden">
                <div className="relative h-64">
                  <Image
                    src={product.image}
                    alt={product.name}
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
                  <h3 className="mb-2 font-semibold">{product.name}</h3>
                  <div className="mb-2 flex items-center space-x-2">
                    <RatingStars rating={product.rating} />
                    <span className="text-sm text-gray-600">
                      ({product.reviews})
                    </span>
                  </div>
                  <div className="mt-2 flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="text-lg font-bold">
                        {product.currentPrice}
                      </span>
                      <span className="text-sm text-gray-500 line-through">
                        {product.originalPrice}
                      </span>
                    </div>
                    <Button variant="ghost" size="sm">
                      Add to Cart
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <h2 className="mb-8 text-3xl font-bold">Shop by Category</h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {categories.map((category, index) => (
              <div
                key={index}
                className="group relative h-80 cursor-pointer overflow-hidden rounded-lg"
              >
                <Image
                  src={category.image}
                  alt={category.name}
                  fill
                  className="object-cover transition-transform group-hover:scale-105"
                />
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 p-4 text-center">
                  <h3 className="mb-2 text-2xl font-bold text-white">
                    {category.name}
                  </h3>
                  <p className="text-sm text-gray-200">
                    {category.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="bg-primary py-16">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="mb-4 text-3xl font-bold text-white">
              Get Fresh Deals in Your Inbox
            </h2>
            <p className="mb-6 text-gray-200">
              Subscribe to receive weekly specials and cooking inspiration.
            </p>
            <div className="mx-auto flex max-w-md gap-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-white"
              />
              <Button className="bg-white text-primary hover:bg-gray-100">
                Subscribe <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
