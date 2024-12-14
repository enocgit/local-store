import CategoryPageClient from "@/components/category/CategoryPageClient";

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return <CategoryPageClient id={id} />;
}
