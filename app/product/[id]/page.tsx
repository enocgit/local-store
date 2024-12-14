import { auth } from "@/auth";
import ProductDetailPage from "@/components/product/ProductDetailPage";
import { getProductById } from "@/lib/api/products";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { prisma } from "@/lib/prisma";

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const product = await prisma.product.findUnique({
    where: { id },
    select: {
      name: true,
      description: true,
    },
  });

  return {
    title: `${product?.name || "Product"}`,
    description:
      product?.description ||
      "Browse our product collection for authentic Caribbean products",
  };
}

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

  return <ProductDetailPage product={product as any} session={session} />;
}
