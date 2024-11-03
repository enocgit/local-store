"use client";

import { useState } from "react";
import { Star, StarHalf, ThumbsUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// Mock review data - would typically come from an API
const mockReviews = [
  {
    id: 1,
    author: "Sarah M.",
    avatar: "https://i.pravatar.cc/150?u=sarah",
    rating: 5,
    date: "2024-02-15",
    title: "Best frozen pizza I've ever had!",
    content:
      "The crust is perfectly crispy and the ingredients taste fresh. Love that it's organic!",
    helpful: 24,
    verified: true,
  },
  {
    id: 2,
    author: "Michael R.",
    avatar: "https://i.pravatar.cc/150?u=michael",
    rating: 4,
    date: "2024-02-10",
    title: "Great quality, but a bit pricey",
    content:
      "The quality is outstanding, especially for a frozen pizza. Would buy again despite the price.",
    helpful: 15,
    verified: true,
  },
];

interface ProductReviewsProps {
  productId: string;
  rating: number;
  totalReviews: number;
}

function RatingStars({ rating }: { rating: number }) {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;

  return (
    <div className="flex items-center">
      {[...Array(fullStars)].map((_, i) => (
        <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
      ))}
      {hasHalfStar && (
        <StarHalf className="h-4 w-4 fill-yellow-400 text-yellow-400" />
      )}
      {[...Array(5 - Math.ceil(rating))].map((_, i) => (
        <Star key={`empty-${i}`} className="h-4 w-4 text-gray-300" />
      ))}
    </div>
  );
}

export function ProductReviews({
  productId,
  rating,
  totalReviews,
}: ProductReviewsProps) {
  const [helpfulClicked, setHelpfulClicked] = useState<number[]>([]);

  const ratingDistribution = {
    5: Math.round(totalReviews * 0.65),
    4: Math.round(totalReviews * 0.2),
    3: Math.round(totalReviews * 0.1),
    2: Math.round(totalReviews * 0.03),
    1: Math.round(totalReviews * 0.02),
  };

  const handleHelpfulClick = (reviewId: number) => {
    if (!helpfulClicked.includes(reviewId)) {
      setHelpfulClicked([...helpfulClicked, reviewId]);
    }
  };

  return (
    <div className="space-y-8">
      {/* Rating Overview */}
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        <div className="space-y-4">
          <div className="flex items-center space-x-4">
            <div className="text-5xl font-bold">{rating}</div>
            <div>
              <RatingStars rating={rating} />
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

        <div className="rounded-lg bg-gray-50 p-6">
          <h3 className="mb-4 font-semibold">Review this product</h3>
          <p className="mb-4 text-sm text-gray-600">
            Share your thoughts with other customers
          </p>
          <Button className="w-full">Write a Review</Button>
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-6">
        {mockReviews.map((review) => (
          <div key={review.id} className="border-b pb-6">
            <div className="flex items-start space-x-4">
              <Avatar>
                <AvatarImage src={review.avatar} alt={review.author} />
                <AvatarFallback>{review.author[0]}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <span className="font-semibold">{review.author}</span>
                  {review.verified && (
                    <span className="rounded bg-green-100 px-2 py-0.5 text-xs text-green-800">
                      Verified Purchase
                    </span>
                  )}
                </div>
                <div className="mt-1 flex items-center space-x-2">
                  <RatingStars rating={review.rating} />
                  <span className="text-sm text-gray-600">
                    {new Date(review.date).toLocaleDateString()}
                  </span>
                </div>
                <h4 className="mt-2 font-semibold">{review.title}</h4>
                <p className="mt-2 text-gray-600">{review.content}</p>
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
              </div>
            </div>
          </div>
        ))}
      </div>

      <Button variant="outline" className="w-full">
        Load More Reviews
      </Button>
    </div>
  );
}
