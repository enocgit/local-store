"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { format } from "date-fns";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";

type OrderItem = {
  id: string;
  quantity: number;
  price: number;
  weight?: number | null;
  product: {
    name: string;
    images: string[];
  };
};

type Order = {
  id: string;
  status: "PENDING" | "PAID" | "PROCESSING" | "DELIVERED" | "CANCELLED";
  subtotal: number;
  deliveryFee: number;
  total: number;
  deliveryDate: string;
  deliveryTime: string;
  createdAt: string;
  items: OrderItem[];
  address: {
    address1: string;
    address2?: string | null;
    city: string;
    postcode: string;
  };
};

const statusColors = {
  PENDING: "bg-yellow-500",
  PAID: "bg-blue-500",
  PROCESSING: "bg-purple-500",
  DELIVERED: "bg-green-500",
  CANCELLED: "bg-red-500",
} as const;

export function OrdersTab() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch("/api/user/orders");
        if (!response.ok) {
          throw new Error("Failed to fetch orders");
        }
        const data = await response.json();
        setOrders(data);
      } catch (error) {
        setError("Failed to load orders. Please try again later.");
        console.error("Error fetching orders:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (isLoading) {
    return (
      <div className="flex h-[200px] items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500">
        <p>{error}</p>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <Card>
        <CardContent className="flex h-[200px] items-center justify-center">
          <p className="text-muted-foreground">No orders found</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {orders.map((order) => (
        <Card key={order.id}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Order #{order.id.slice(-8)}</CardTitle>
                <CardDescription>
                  Placed on {format(new Date(order.createdAt), "PPP")}
                </CardDescription>
              </div>
              <Badge className={statusColors[order.status]}>
                {order.status}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible>
              <AccordionItem value="items">
                <AccordionTrigger>Order Details</AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-4">
                    <div className="divide-y">
                      {order.items.map((item) => (
                        <div
                          key={item.id}
                          className="flex items-center gap-4 py-4"
                        >
                          <div className="relative h-20 w-20">
                            <Image
                              src={item.product.images[0]}
                              alt={item.product.name}
                              fill
                              className="rounded-md object-cover"
                            />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium">{item.product.name}</h4>
                            <p className="text-sm text-muted-foreground">
                              Quantity: {item.quantity}
                              {item.weight && ` (${item.weight}kg)`}
                            </p>
                            <p className="text-sm">£{item.price.toFixed(2)}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="space-y-1 text-sm">
                      <p className="flex justify-between">
                        <span>Subtotal:</span>
                        <span>£{order.subtotal.toFixed(2)}</span>
                      </p>
                      <p className="flex justify-between">
                        <span>Delivery:</span>
                        <span>£{order.deliveryFee.toFixed(2)}</span>
                      </p>
                      <p className="flex justify-between font-medium">
                        <span>Total:</span>
                        <span>£{order.total.toFixed(2)}</span>
                      </p>
                    </div>
                    <div className="space-y-1 text-sm">
                      <h4 className="font-medium">Delivery Details</h4>
                      <p>{order.address.address1}</p>
                      {order.address.address2 && (
                        <p>{order.address.address2}</p>
                      )}
                      <p>{order.address.city}</p>
                      <p>{order.address.postcode.toUpperCase()}</p>
                      <p>
                        Delivery on{" "}
                        {format(new Date(order.deliveryDate), "PPP")} at{" "}
                        {order.deliveryTime}
                      </p>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
