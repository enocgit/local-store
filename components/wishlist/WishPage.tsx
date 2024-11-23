"use client";

import { ProductGrid } from "@/components/product/ProductGrid";
import { WishlistHeader } from "@/components/wishlist/WishlistHeader";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { redirect } from "next/navigation";
import { Session } from "next-auth";
import { useWishlist } from "@/lib/api/wishlist";

export default function WishPage({ session }: { session: Session | null }) {
  if (!session?.user) {
    redirect("/auth");
  }

  const { data: wishlist } = useWishlist();

  if (wishlist?.length === 0) {
    return (
      <div className="space-y-5 p-10">
        <p>
          Your wishlist is empty. Add some products to your wishlist to keep
          track of your favorite items.
        </p>
        <Link href="/products" className="mt-1 block">
          <Button>Browse Products</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <WishlistHeader />
      <div className="container mx-auto px-4 py-8">
        <ProductGrid products={wishlist?.map((item) => item.product) ?? []} />
      </div>
    </div>
  );
}
