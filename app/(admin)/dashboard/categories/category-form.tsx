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
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { UploadButton } from "@/components/ui/upload-button";
import Image from "next/image";

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
  image: z.string().min(1, "Image is required"),
});

type CategoryFormValues = z.infer<typeof formSchema>;

interface CategoryFormProps {
  initialData?: CategoryFormValues;
  categoryId?: string;
}

export function CategoryForm({ initialData, categoryId }: CategoryFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  const isEditing = !!categoryId;

  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      name: "",
      description: "",
      image: "",
    },
  });

  const onSubmit = async (data: CategoryFormValues) => {
    try {
      setIsLoading(true);

      const response = await fetch(`/api/categories${categoryId ? `/${categoryId}` : ""}`, {
        method: categoryId ? "PATCH" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error();
      }

      router.push("/dashboard/categories");
      router.refresh();

      toast({
        title: `Category ${isEditing ? "updated" : "created"}`,
        description: `The category has been ${isEditing ? "updated" : "created"} successfully.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to ${isEditing ? "update" : "create"} the category. Please try again.`,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
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
                    placeholder="Category name"
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
                    placeholder="Category description"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="image"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Image</FormLabel>
                <FormControl>
                  <div className="space-y-4">
                    <UploadButton
                      onUploadComplete={(url) => {
                        field.onChange(url);
                      }}
                      onUploadError={(error) => {
                        toast({
                          title: "Error",
                          description: "Failed to upload image. Please try again.",
                          variant: "destructive",
                        });
                      }}
                    />
                    {field.value ? (
                      <div className="relative h-40 w-40">
                        <Image
                          src={field.value}
                          alt="Category image"
                          fill
                          className="rounded-md object-cover"
                        />
                      </div>
                    ) : (
                      <div className="relative h-40 w-40">
                        <Image
                          src="https://utfs.io/f/5aK3NZMlDfcgitELvDk7LYHbEWfe83jx2TrO9msKg4loynPa"
                          alt="Category image"
                          fill
                          className="rounded-md object-cover"
                        />
                      </div>
                    )}
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button disabled={isLoading} type="submit">
            {isEditing ? "Update" : "Create"} Category
          </Button>
        </form>
      </Form>
    </div>
  );
}
