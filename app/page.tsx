import Newsletter from "@/components/Newsletter";
import ShopByCategory from "@/components/home/ShopByCategory";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import Hero from "@/components/home/Hero";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Hero />

      <FeaturedProducts />

      <ShopByCategory />

      <Newsletter />
    </div>
  );
}
