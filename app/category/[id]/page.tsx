import { CategoryHeader } from "@/components/category/CategoryHeader";
import { ProductGrid } from "@/components/category/ProductGrid";
import { FilterSidebar } from "@/components/category/FilterSidebar";
import { getProductsByCategory } from "@/lib/api/products";
import { ProductType } from "@/interfaces";

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const category = await getProductsByCategory(id);

  if (!category || Array.isArray(category)) {
    return <p className="p-10">No products found under this category</p>;
  }

  if (category?.products.length === 0) {
    return <p className="p-10">No products found under {category?.name} </p>;
  }

  return (
    <div className="min-h-screen bg-background">
      <CategoryHeader
        title={category?.name || ""}
        description={category?.description}
        image={category?.image}
      />
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col gap-8 lg:flex-row">
          <FilterSidebar />
          <ProductGrid products={category?.products as ProductType[]} />
        </div>
      </div>
    </div>
  );
}
