"use client";

import { useState } from "react";
import { ThumbsUp, Loader2, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import RatingStars from "../RatingStars";
import {
  useProductReviews,
  useHelpfulReview,
  useDeleteReview,
  GetProductReview,
} from "@/lib/api/reviews";
import { ReviewDialog } from "./ReviewDialog";
import { useSession } from "next-auth/react";

interface ProductReviewsProps {
  productId: string;
}

export function ProductReviews({ productId }: ProductReviewsProps) {
  const { data: session } = useSession();
  const [helpfulClicked, setHelpfulClicked] = useState<string[]>([]);
  const [showReviewDialog, setShowReviewDialog] = useState(false);
  const [reviewToEdit, setReviewToEdit] = useState<
    GetProductReview | undefined
  >(undefined);
  const [page, setPage] = useState(1);
  const { data, isLoading, isFetchingNextPage, hasNextPage, fetchNextPage } =
    useProductReviews({
      productId,
    });

  const reviews = data?.pages.flatMap((page) => page.reviews) ?? [];
  const totalReviews = data?.pages[0]?.total ?? 0;

  const averageRating = reviews.length
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
    : 0;

  const ratingDistribution = reviews.reduce(
    (acc, review) => {
      acc[review.rating] = (acc[review.rating] || 0) + 1;
      return acc;
    },
    { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 } as Record<number, number>,
  );

  const helpfulMutation = useHelpfulReview();
  const deleteReview = useDeleteReview();

  const handleHelpfulClick = async (reviewId: string) => {
    if (!session) {
      window.location.href = `/auth?callbackUrl=${encodeURIComponent(
        window.location.pathname,
      )}`;
      return;
    }

    if (!helpfulClicked.includes(reviewId)) {
      try {
        await helpfulMutation.mutateAsync(reviewId);
        setHelpfulClicked([...helpfulClicked, reviewId]);
      } catch (error) {
        console.error("Failed to mark review as helpful:", error);
      }
    }
  };

  const handleWriteReviewClick = () => {
    if (!session) {
      window.location.href = `/auth?callbackUrl=${encodeURIComponent(
        window.location.pathname,
      )}`;
      return;
    }
    setShowReviewDialog(true);
  };

  const handleEditReview = (review: GetProductReview) => {
    setReviewToEdit(review);
    setShowReviewDialog(true);
  };

  const handleDeleteReview = async (reviewId: string) => {
    if (!confirm("Are you sure you want to delete this review?")) return;

    try {
      await deleteReview.mutateAsync({ reviewId, productId });
    } catch (error) {
      console.error("Failed to delete review:", error);
    }
  };

  const handleLoadMore = () => {
    fetchNextPage();
  };

  if (isLoading)
    return (
      <div className="mt-10 flex justify-center">
        <Loader2 className="animate-spin" />
      </div>
    );

  return (
    <div className="space-y-8">
      {/* Rating Overview */}
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        {reviews.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <div className="text-5xl font-bold">
                {averageRating.toFixed(1)}
              </div>
              <div>
                <RatingStars rating={averageRating} />
                <p className="text-sm text-gray-600">{totalReviews} reviews</p>
              </div>
            </div>
            <div className="space-y-2">
              {Object.entries(ratingDistribution)
                .reverse()
                .map(([stars, count]) => (
                  <div key={stars} className="flex items-center space-x-2">
                    <span className="w-12 text-sm">{stars} stars</span>
                    <Progress
                      value={(count / totalReviews) * 100}
                      className="h-2"
                    />
                    <span className="w-12 text-sm text-gray-600">
                      {Math.round((count / totalReviews) * 100)}%
                    </span>
                  </div>
                ))}
            </div>
          </div>
        )}

        <div className="rounded-lg bg-gray-50 p-6">
          <h3 className="mb-4 font-semibold">Review this product</h3>
          <p className="mb-4 text-sm text-gray-600">
            Share your thoughts with other customers
          </p>
          <Button className="w-full" onClick={handleWriteReviewClick}>
            Write a Review
          </Button>
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-6">
        {reviews.map((review) => (
          <div key={review.id} className="border-b pb-6">
            <div className="flex items-start space-x-4">
              <Avatar>
                <AvatarImage
                  src={review.user.image}
                  alt={review.user.firstName}
                />
                <AvatarFallback>
                  {review.user.firstName[0]}
                  {review.user.lastName[0]}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <span className="font-semibold">
                    {review.user.firstName} {review.user.lastName}
                  </span>
                  {review.verified && (
                    <span className="rounded bg-green-100 px-2 py-0.5 text-xs text-green-800">
                      Verified Purchase
                    </span>
                  )}
                </div>
                <div className="mt-1 flex items-center space-x-2">
                  <RatingStars rating={review.rating} />
                  <span className="text-sm text-gray-600">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <h4 className="mt-2 font-semibold">{review.title}</h4>
                <p className="mt-2 text-gray-600">{review.content}</p>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="mt-4"
                    onClick={() => handleHelpfulClick(review.id)}
                    disabled={helpfulClicked.includes(review.id)}
                  >
                    <ThumbsUp className="mr-2 h-4 w-4" />
                    Helpful (
                    {review.helpful +
                      (helpfulClicked.includes(review.id) ? 1 : 0)}
                    )
                  </Button>

                  {session?.user?.id === review.userId && (
                    <>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="mt-4"
                        onClick={() => handleEditReview(review)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="mt-4 text-red-600 hover:text-red-700"
                        onClick={() => handleDeleteReview(review.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {hasNextPage ? (
        <Button
          variant="outline"
          className="w-full"
          onClick={handleLoadMore}
          disabled={isFetchingNextPage}
        >
          {isFetchingNextPage ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            "Load More Reviews"
          )}
        </Button>
      ) : null}

      <ReviewDialog
        productId={productId}
        open={showReviewDialog}
        onOpenChange={(open) => {
          setShowReviewDialog(open);
          if (!open) setReviewToEdit(undefined);
        }}
        review={reviewToEdit}
      />
    </div>
  );
}
