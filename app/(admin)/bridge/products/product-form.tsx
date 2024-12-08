"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { UploadButton } from "@/components/ui/upload-button";
import Image from "next/image";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Category } from "@prisma/client";
import { X } from "lucide-react";

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
  price: z.coerce.number().min(0, "Price must be greater than 0"),
  comparePrice: z.coerce.number().min(0).nullable(),
  stock: z.coerce.number().min(0, "Stock must be greater than or equal to 0"),
  images: z.array(z.string()).min(1, "At least one image is required"),
  badge: z.string().nullable(),
  featured: z.boolean().default(false),
  categoryId: z.string().min(1, "Category is required"),
  weightOptions: z.array(z.number()).default([]),
});

type ProductFormValues = z.infer<typeof formSchema>;

interface ProductFormProps {
  initialData?: ProductFormValues & { id: string };
  categories: Category[];
}

export function ProductForm({ initialData, categories }: ProductFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [weightOption, setWeightOption] = useState<number | undefined>(
    undefined,
  );
  const router = useRouter();
  const { toast } = useToast();
  const isEditing = !!initialData?.id;

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      name: "",
      description: "",
      price: 0,
      comparePrice: null,
      stock: 0,
      images: [],
      badge: null,
      featured: false,
      categoryId: "",
      weightOptions: [],
    },
  });

  const onSubmit = async (data: ProductFormValues) => {
    try {
      setIsLoading(true);
      const response = await fetch(
        `/api/products${isEditing ? `/${initialData.id}` : ""}`,
        {
          method: isEditing ? "PATCH" : "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        },
      );

      if (!response.ok) {
        throw new Error("Something went wrong");
      }

      router.push("/bridge/products");
      router.refresh();

      toast({
        title: `Product ${isEditing ? "updated" : "created"}`,
        description: `The product has been ${isEditing ? "updated" : "created"} successfully.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const addWeightOption = () => {
    if (weightOption) {
      form.setValue("weightOptions", [
        ...form.getValues("weightOptions"),
        weightOption,
      ]);
      setWeightOption(undefined);
    }
  };

  const removeWeightOption = (index: number) => {
    const currentOptions = form.getValues("weightOptions");
    form.setValue(
      "weightOptions",
      currentOptions.filter((_, i) => i !== index),
    );
  };

  return (
    <div className="max-w-2xl">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input
                    disabled={isLoading}
                    placeholder="Product name"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea
                    disabled={isLoading}
                    placeholder="Product description"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-3 gap-4">
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      disabled={isLoading}
                      placeholder="9.99"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="comparePrice"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Compare at price</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      disabled={isLoading}
                      placeholder="12.99"
                      {...field}
                      value={field.value || ""}
                      onChange={(e) =>
                        field.onChange(
                          e.target.value ? Number(e.target.value) : null,
                        )
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="stock"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Stock</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      disabled={isLoading}
                      placeholder="100"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="images"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Images</FormLabel>
                <FormControl>
                  <div className="space-y-4">
                    <UploadButton
                      onUploadComplete={(url) => {
                        field.onChange([...field.value, url]);
                      }}
                      onUploadError={(error: Error) => {
                        toast({
                          title: "Error",
                          description:
                            "Failed to upload image. Please try again.",
                          variant: "destructive",
                        });
                      }}
                    />
                    <div className="grid grid-cols-3 gap-4">
                      {field.value.map((image, index) => (
                        <div key={image} className="group relative">
                          <div className="relative h-40 w-full">
                            <Image
                              src={image}
                              alt={`Product image ${index + 1}`}
                              fill
                              className="rounded-md object-cover"
                            />
                          </div>
                          <Button
                            type="button"
                            variant="destructive"
                            size="icon"
                            className="absolute -right-2 -top-2 h-6 w-6 opacity-0 transition-opacity group-hover:opacity-100"
                            onClick={() =>
                              field.onChange(
                                field.value.filter((_, i) => i !== index),
                              )
                            }
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="badge"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Badge</FormLabel>
                <FormControl>
                  <Input
                    disabled={isLoading}
                    placeholder="e.g., New, Sale, Best Seller"
                    {...field}
                    value={field.value || ""}
                    onChange={(e) => field.onChange(e.target.value || null)}
                  />
                </FormControl>
                <FormDescription>
                  Optional badge to display on the product
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="featured"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Featured</FormLabel>
                  <FormDescription>
                    Display this product in featured sections
                  </FormDescription>
                </div>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="categoryId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <Select
                  disabled={isLoading}
                  onValueChange={field.onChange}
                  value={field.value}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="weightOptions"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Weight Options</FormLabel>
                <FormControl>
                  <div className="space-y-4">
                    <div className="flex gap-2">
                      <Input
                        value={weightOption}
                        onChange={(e) =>
                          setWeightOption(Number(e.target.value))
                        }
                        placeholder="e.g., 5"
                      />
                      <Button type="button" onClick={addWeightOption}>
                        Add
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {field.value.map((option, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-1 rounded-md bg-secondary px-2 py-1 text-secondary-foreground"
                        >
                          {option}kg
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="h-4 w-4"
                            onClick={() => removeWeightOption(index)}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                </FormControl>
                <FormDescription>Optional weight options in kg</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button disabled={isLoading} type="submit">
            {isEditing ? "Save changes" : "Create product"}
          </Button>
        </form>
      </Form>
    </div>
  );
}
