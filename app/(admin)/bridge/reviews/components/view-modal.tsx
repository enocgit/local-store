"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Review, User, Product } from "@prisma/client";
import { format } from "date-fns";

interface ReviewWithRelations extends Review {
  user: User;
  product: Product;
}

interface ViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  review: ReviewWithRelations;
}

export const ViewModal: React.FC<ViewModalProps> = ({
  isOpen,
  onClose,
  review,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Review Details</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <span className="font-semibold">Product: </span>
            {review.product.name}
          </div>
          <div>
            <span className="font-semibold">Customer: </span>
            {review.user.firstName} {review.user.lastName}
          </div>
          <div>
            <span className="font-semibold">Rating: </span>
            {review.rating} / 5
          </div>
          <div>
            <span className="font-semibold">Comment: </span>
            {review.content}
          </div>
          <div>
            <span className="font-semibold">Date: </span>
            {format(review.createdAt, "MMMM d, yyyy")}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
