import { CategoryForm } from "../category-form";

export default function NewCategoryPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">New Category</h2>
        <p className="text-muted-foreground">
          Create a new product category
        </p>
      </div>

      <CategoryForm />
    </div>
  );
}
