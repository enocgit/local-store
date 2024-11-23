import { auth } from "@/auth";
import { redirect } from "next/navigation";
import WishPage from "@/components/wishlist/WishPage";

export default async function WishlistPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/auth");
  }

  return <WishPage session={session} />;
}
