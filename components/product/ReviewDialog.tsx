"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { Button } from "@/components/ui/button";
import {
  useCreateReview,
  useUpdateReview,
  useDeleteReview,
  GetProductReview,
} from "@/lib/api/reviews";
import RatingStars from "../RatingStars";
import { Loader2 } from "lucide-react";

const reviewSchema = z.object({
  rating: z.number().min(1).max(5),
  title: z.string().min(1, "Title is required"),
  content: z.string().min(10, "Review must be at least 10 characters"),
});

interface ReviewDialogProps {
  productId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  review?: GetProductReview;
}

export function ReviewDialog({
  productId,
  open,
  onOpenChange,
  review,
}: ReviewDialogProps) {
  const createReview = useCreateReview();
  const updateReview = useUpdateReview();
  const deleteReview = useDeleteReview();

  const form = useForm<z.infer<typeof reviewSchema>>({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      rating: 5,
      title: "",
      content: "",
    },
  });

  useEffect(() => {
    if (review) {
      form.reset({
        rating: review.rating,
        title: review.title,
        content: review.content,
      });
    } else {
      form.reset({
        rating: 5,
        title: "",
        content: "",
      });
    }
  }, [review, form]);

  const onSubmit = async (values: z.infer<typeof reviewSchema>) => {
    try {
      if (review) {
        await updateReview.mutateAsync({
          reviewId: review.id,
          data: { ...values, productId },
        });
      } else {
        await createReview.mutateAsync({
          productId,
          ...values,
        });
      }
      form.reset();
      onOpenChange(false);
    } catch (error) {
      console.error("Failed to submit review:", error);
    }
  };

  const onDelete = async () => {
    if (!review) return;
    try {
      await deleteReview.mutateAsync({
        reviewId: review.id,
        productId,
      });
      onOpenChange(false);
    } catch (error) {
      console.error("Failed to delete review:", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{review ? "Edit Review" : "Write a Review"}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="rating"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Rating</FormLabel>
                  <FormControl>
                    <RatingStars
                      rating={field.value}
                      onChange={field.onChange}
                      editable
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Review</FormLabel>
                  <FormControl>
                    <Textarea {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex gap-2">
              <Button
                type="submit"
                className="flex-1"
                disabled={createReview.isPending || updateReview.isPending}
              >
                {createReview.isPending || updateReview.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {review ? "Updating..." : "Submitting..."}
                  </>
                ) : review ? (
                  "Update Review"
                ) : (
                  "Submit Review"
                )}
              </Button>
              {review && (
                <Button
                  type="button"
                  variant="destructive"
                  onClick={onDelete}
                  disabled={deleteReview.isPending}
                >
                  {deleteReview.isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    "Delete"
                  )}
                </Button>
              )}
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
