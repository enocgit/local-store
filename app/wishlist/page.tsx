import { auth } from "@/auth";
import { Metadata } from "next";
import { redirect } from "next/navigation";
import WishPage from "@/components/wishlist/WishPage";

export const metadata: Metadata = {
  title: "Wishlist",
  description: "Your wishlist",
};

export default async function WishlistPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/auth");
  }

  return <WishPage session={session} />;
}
