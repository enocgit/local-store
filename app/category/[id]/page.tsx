import { Metadata } from "next";
import CategoryPageClient from "@/components/category/CategoryPageClient";
import { prisma } from "@/lib/prisma";

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  let category;
  if (id !== "new-arrivals") {
    category = await prisma.category.findUnique({
      where: { id },
    });
  } else {
    category = {
      name: "New Arrivals",
      description: "New arrivals in our store",
    };
  }

  return {
    title: `${category?.name || "Category"}`,
    description: category?.description || "Browse our category collection",
  };
}

export default async function CategoryPage({ params }: Props) {
  const { id } = await params;
  return <CategoryPageClient id={id} />;
}
