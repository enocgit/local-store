import { ProductType } from "@/interfaces";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

interface WishlistItem {
  productId: string;
  product: ProductType;
}

export function useWishlist() {
  return useQuery({
    queryKey: ["wishlist"],
    queryFn: async () => {
      const res = await fetch("/api/wishlist");
      if (!res.ok) throw new Error("Failed to fetch wishlist");
      return res.json() as Promise<WishlistItem[]>;
    },
  });
}

export function useToggleWishlist() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (productId: string) => {
      const res = await fetch("/api/wishlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId }),
      });

      if (!res.ok) throw new Error("Failed to toggle wishlist item");
      return res.json();
    },
    // Optimistic update
    onMutate: async (productId) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ["wishlist"] });

      // Snapshot the previous value
      const previousWishlist = queryClient.getQueryData<string[]>(["wishlist"]);

      // Optimistically update the wishlist
      queryClient.setQueryData<string[]>(["wishlist"], (old = []) => {
        return old.includes(productId)
          ? old.filter((id) => id !== productId)
          : [...old, productId];
      });

      // Return context with the snapshotted value
      return { previousWishlist };
    },
    onError: (err, productId, context) => {
      // Rollback on error
      queryClient.setQueryData(["wishlist"], context?.previousWishlist);
    },
    onSettled: () => {
      // Refetch after error or success
      queryClient.invalidateQueries({ queryKey: ["wishlist"] });
    },
  });
}
