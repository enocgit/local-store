"use client";

import { Heart } from "lucide-react";
import { Button } from "./button";
import { useToggleWishlist, useWishlist } from "@/lib/api/wishlist";
import { cn } from "@/lib/utils";
import { useSession } from "next-auth/react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { AuthForm } from "@/components/auth/AuthForm";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";

interface WishlistButtonProps {
  productId: string;
  className?: string;
}

export function WishlistButton({ productId, className }: WishlistButtonProps) {
  const { data: session } = useSession();
  const { data: wishlist = [] } = useWishlist();
  const { mutate: toggleWishlist, variables, isError } = useToggleWishlist();
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const [optimisticState, setOptimisticState] = useState<boolean | null>(null);

  const isWished =
    optimisticState !== null
      ? optimisticState
      : wishlist.some((item) => item.productId === productId);

  const wishedText = isWished ? "Remove from Wishlist" : "Add to Wishlist";

  useEffect(() => {
    if (isError) {
      setOptimisticState(null);
    }
  }, [isError]);

  const handleWishClick = () => {
    if (!session) {
      setShowAuthDialog(true);
      return;
    }
    setOptimisticState(!isWished);
    toggleWishlist(productId);
  };

  return (
    <>
      <Button
        variant="outline"
        size="icon"
        className={className}
        title={wishedText}
        aria-label={wishedText}
        onClick={handleWishClick}
      >
        <motion.div
          whileTap={{ scale: 0.8 }}
          animate={{
            scale: isWished ? [1, 1.2, 1] : 1,
            transition: { duration: 0.3 },
          }}
        >
          <Heart
            className={cn("h-5 w-5", {
              "fill-red-500 text-red-500": isWished,
              "fill-transparent": !isWished,
            })}
            style={{
              transition: "fill 0.3s ease, color 0.3s ease",
            }}
          />
        </motion.div>
      </Button>

      <Dialog open={showAuthDialog} onOpenChange={setShowAuthDialog}>
        <DialogContent className="sm:max-w-md">
          <AuthForm session={session} />
        </DialogContent>
      </Dialog>
    </>
  );
}
