"use client";

import { useState } from "react";
import { format } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Order } from "./columns";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface OrderDialogProps {
  order: Order;
  isOpen: boolean;
  onClose: () => void;
}

export function OrderDialog({ order, isOpen, onClose }: OrderDialogProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const onStatusChange = async (newStatus: string) => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/orders/${order.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        throw new Error("Failed to update order status");
      }

      router.refresh();
      toast.success("Order status updated");
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[800px]">
        <DialogHeader>
          <DialogTitle>Order Details</DialogTitle>
          <DialogDescription>
            Order placed {format(order.createdAt, "PPP")}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Status Section */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Status</p>
              <Select
                disabled={isLoading}
                value={order.status}
                onValueChange={onStatusChange}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PENDING">Pending</SelectItem>
                  <SelectItem value="PAID">Paid</SelectItem>
                  <SelectItem value="PROCESSING">Processing</SelectItem>
                  <SelectItem value="DELIVERED">Delivered</SelectItem>
                  <SelectItem value="CANCELLED">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="text-sm">
              <p className="font-medium">Order ID</p>
              <p className="text-muted-foreground">{order.id}</p>
            </div>
          </div>

          {/* Customer Section */}
          <div>
            <p className="mb-2 text-sm font-medium">Customer</p>
            <div className="text-sm">
              <p>{order.customer.name}</p>
              <p className="text-muted-foreground">{order.customer.email}</p>
            </div>
          </div>

          {/* Delivery Section */}
          <div>
            <p className="mb-2 text-sm font-medium">Delivery Details</p>
            <div className="text-sm">
              <p>Date: {format(order.deliveryDate, "PPP")}</p>
              <p>Time: {order.deliveryTime}</p>
              <div className="mt-2">
                <p>{order.address.address1}</p>
                {order.address.address2 && <p>{order.address.address2}</p>}
                <p>{order.address.city}</p>
                <p>{order.address.postcode.toUpperCase()}</p>
              </div>
            </div>
          </div>

          {/* Items Section */}
          <div>
            <p className="mb-2 text-sm font-medium">Order Items</p>
            <div className="space-y-4">
              {order?.orderItems?.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between text-sm"
                >
                  <div>
                    <p>{item.productName}</p>
                    <p className="text-muted-foreground">
                      Qty: {item.quantity}
                      {item.weight && ` (${item.weight}kg)`}
                    </p>
                  </div>
                  <p>
                    {new Intl.NumberFormat("en-GB", {
                      style: "currency",
                      currency: "GBP",
                    }).format(item.price)}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Total Section */}
          <div className="flex items-center justify-between border-t pt-4">
            <p className="text-sm font-medium">Total Amount</p>
            <p className="text-lg font-bold">
              {new Intl.NumberFormat("en-GB", {
                style: "currency",
                currency: "GBP",
              }).format(order.total)}
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
