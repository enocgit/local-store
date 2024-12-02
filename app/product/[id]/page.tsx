import { auth } from "@/auth";
import ProductDetailPage from "@/components/product/ProductDetailPage";
import { getProductById } from "@/lib/api/products";
import { notFound } from "next/navigation";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await getProductById(id);
  const session = await auth();

  if (!product) {
    notFound();
  }

  return <ProductDetailPage product={product} session={session} />;
}
