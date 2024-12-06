import { Review } from "@prisma/client";
import {
  useQuery,
  useMutation,
  useQueryClient,
  useInfiniteQuery,
  UseInfiniteQueryResult,
} from "@tanstack/react-query";

interface CreateReviewData {
  productId: string;
  rating: number;
  title: string;
  content: string;
}

export interface GetProductReview extends Review {
  user: {
    firstName: string;
    lastName: string;
    image: string;
  };
}

interface ProductReviewsResponse {
  reviews: GetProductReview[];
  total: number;
  hasMore: boolean;
}

export function useProductReviews({
  productId,
  limit = 5,
}: {
  productId: string;
  limit?: number;
}) {
  return useInfiniteQuery({
    queryKey: ["reviews", productId],
    initialPageParam: 1,
    queryFn: async ({ pageParam = 1 }) => {
      const res = await fetch(
        `/api/reviews?productId=${productId}&page=${pageParam}&limit=${limit}`,
      );
      if (!res.ok) throw new Error("Failed to fetch reviews");
      return res.json();
    },
    getNextPageParam: (lastPage, pages) => {
      if (!lastPage.hasMore) return undefined;
      return pages.length + 1;
    },
  });
}

export function useCreateReview() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateReviewData) => {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to create review");
      return res.json();
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["reviews", variables.productId],
      });

      queryClient.invalidateQueries({
        queryKey: ["product", variables.productId],
      });

      queryClient.invalidateQueries({
        queryKey: ["products"],
      });
    },
  });
}

export function useHelpfulReview() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (reviewId: string) => {
      const res = await fetch(`/api/reviews/${reviewId}/helpful`, {
        method: "POST",
      });
      if (!res.ok) throw new Error("Failed to mark review as helpful");
      return res.json();
    },
    onSuccess: (_, reviewId) => {
      // Get the product ID from the existing reviews data
      const reviews = queryClient.getQueryData<GetProductReview[]>(["reviews"]);
      const productId = reviews?.find((r) => r.id === reviewId)?.productId;

      if (productId) {
        queryClient.invalidateQueries({
          queryKey: ["reviews", productId],
        });
      }
    },
  });
}

export function useUpdateReview() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      reviewId,
      data,
    }: {
      reviewId: string;
      data: Partial<CreateReviewData>;
    }) => {
      const res = await fetch(`/api/reviews/${reviewId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to update review");
      return res.json();
    },
    onSuccess: (_, { data }) => {
      if (data.productId) {
        queryClient.invalidateQueries({
          queryKey: ["reviews", data.productId],
        });
        queryClient.invalidateQueries({
          queryKey: ["product", data.productId],
        });
      }
    },
  });
}

export function useDeleteReview() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      reviewId,
      productId,
    }: {
      reviewId: string;
      productId: string;
    }) => {
      const res = await fetch(`/api/reviews/${reviewId}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete review");
      return res.json();
    },
    onSuccess: (_, { productId }) => {
      queryClient.invalidateQueries({
        queryKey: ["reviews", productId],
      });
      queryClient.invalidateQueries({
        queryKey: ["product", productId],
      });
    },
  });
}
