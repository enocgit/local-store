import { notFound } from "next/navigation";
import { CategoryHeader } from "@/components/category/CategoryHeader";
import { ProductGrid } from "@/components/category/ProductGrid";
import { FilterSidebar } from "@/components/category/FilterSidebar";

const categories = {
  "frozen-foods": {
    title: "Frozen Foods",
    description: "Premium quality frozen meals and ingredients",
    image:
      "https://images.unsplash.com/photo-1610348725531-843dff563e2c?auto=format&fit=crop&w=800&q=80",
    products: [
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
        category: "frozen-foods",
      },
      {
        id: 2,
        name: "Frozen Mixed Vegetables",
        currentPrice: "$6.99",
        originalPrice: "$8.99",
        rating: 4.3,
        reviews: 167,
        image:
          "https://images.unsplash.com/photo-1571651332185-1aaf0c70a5c5?auto=format&fit=crop&w=800&q=80",
        category: "frozen-foods",
      },
      {
        id: 3,
        name: "Premium Ice Cream Pack",
        currentPrice: "$14.99",
        originalPrice: "$19.99",
        rating: 4.7,
        reviews: 215,
        image:
          "https://images.unsplash.com/photo-1497034825429-c343d7c6a68f?auto=format&fit=crop&w=800&q=80",
        badge: "Limited Time",
        category: "frozen-foods",
      },
      {
        id: 4,
        name: "Frozen Berry Mix",
        currentPrice: "$8.99",
        originalPrice: "$10.99",
        rating: 4.8,
        reviews: 96,
        image:
          "https://images.unsplash.com/photo-1563746098251-d35aef196e83?auto=format&fit=crop&w=800&q=80",
        badge: "Organic",
        category: "frozen-foods",
      },
    ],
  },
  "dairy-eggs": {
    title: "Dairy & Eggs",
    description: "Fresh dairy products and free-range eggs",
    image:
      "https://images.unsplash.com/photo-1630431341973-02e1b662ec35?auto=format&fit=crop&w=1920&q=80",
    products: [
      {
        id: 5,
        name: "Organic Free-Range Eggs",
        currentPrice: "$5.99",
        originalPrice: "$7.99",
        rating: 4.9,
        reviews: 203,
        image:
          "https://images.unsplash.com/photo-1587486913049-53fc88980cfc?auto=format&fit=crop&w=800&q=80",
        badge: "Organic",
        category: "dairy-eggs",
      },
      {
        id: 6,
        name: "Fresh Milk Bundle",
        currentPrice: "$9.99",
        originalPrice: "$12.99",
        rating: 4.6,
        reviews: 167,
        image:
          "https://images.unsplash.com/photo-1563636619-e9143da7973b?auto=format&fit=crop&w=800&q=80",
        category: "dairy-eggs",
      },
      {
        id: 7,
        name: "Premium Cheese Selection",
        currentPrice: "$24.99",
        originalPrice: "$29.99",
        rating: 4.8,
        reviews: 142,
        image:
          "https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?auto=format&fit=crop&w=800&q=80",
        badge: "Best Seller",
        category: "dairy-eggs",
      },
      {
        id: 8,
        name: "Greek Yogurt Pack",
        currentPrice: "$11.99",
        originalPrice: "$14.99",
        rating: 4.7,
        reviews: 189,
        image:
          "https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=800&q=80",
        category: "dairy-eggs",
      },
    ],
  },
};

export default async function CategoryPage({
  params,
}: {
  params: { slug: string };
}) {
  const { slug } = await params;
  const category = categories[slug as keyof typeof categories];

  if (!category) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-background">
      <CategoryHeader
        title={category.title}
        description={category.description}
        image={category.image}
      />
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col gap-8 lg:flex-row">
          <FilterSidebar />
          <ProductGrid products={category.products} />
        </div>
      </div>
    </div>
  );
}
