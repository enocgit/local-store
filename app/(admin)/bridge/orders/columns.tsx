"use client";

import { useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import { formatDistanceToNow, format } from "date-fns";
import { OrderDialog } from "./order-dialog";
import { DeleteOrderAlert } from "./delete-order-alert";

export type Order = {
  id: string;
  customer: {
    name: string;
    email: string;
  };
  name: string;
  email: string;
  status: "PENDING" | "PAID" | "PROCESSING" | "DELIVERED" | "CANCELLED";
  total: number;
  deliveryDate: Date;
  deliveryTime: string;
  createdAt: Date;
  paidAt?: Date | null;
  orderItems: {
    id: string;
    productName: string;
    quantity: number;
    price: number;
    weight?: number | null;
  }[];
  items: {
    id: string;
    productName: string;
    quantity: number;
    price: number;
    weight?: number | null;
  }[];
  address: {
    address1: string;
    address2?: string | null;
    city: string;
    postcode: string;
  };
  address1: string;
  address2?: string | null;
  city: string;
  postcode: string;
};

const getOrderStatusColor = (status: Order["status"]) => {
  const colors = {
    PENDING: "secondary",
    PAID: "success",
    PROCESSING: "default",
    DELIVERED: "success",
    CANCELLED: "destructive",
  } as const;
  return colors[status];
};

export const columns: ColumnDef<Order>[] = [
  {
    accessorKey: "customer.email",
    id: "email",
    header: "Customer",
    cell: ({ row }) => {
      const customer = row.original.customer;
      return (
        <div>
          <p className="font-medium">{customer.name}</p>
          <p className="text-sm text-muted-foreground">{customer.email}</p>
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as Order["status"];
      return <Badge variant={getOrderStatusColor(status)}>{status}</Badge>;
    },
  },
  {
    accessorKey: "orderItems",
    header: "Items",
    cell: ({ row }) => {
      const items = row.original.orderItems;
      return items.length;
    },
  },
  {
    accessorKey: "total",
    header: "Total",
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("total"));
      const formatted = new Intl.NumberFormat("en-GB", {
        style: "currency",
        currency: "GBP",
      }).format(amount);
      return formatted;
    },
  },
  {
    accessorKey: "deliveryDate",
    header: "Delivery",
    cell: ({ row }) => {
      const date: Date = row.getValue("deliveryDate");
      const time: string = row.original.deliveryTime;
      return (
        <div>
          <p>{format(date, "MMM d, yyyy")}</p>
          <p className="text-sm text-muted-foreground">{time}</p>
        </div>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: "Order Date",
    cell: ({ row }) => {
      const date: Date = row.getValue("createdAt");
      return formatDistanceToNow(date, { addSuffix: true });
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const order = row.original;
      const [showDialog, setShowDialog] = useState(false);
      const [showDeleteAlert, setShowDeleteAlert] = useState(false);

      return (
        <>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => setShowDialog(true)}>
                View details
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => navigator.clipboard.writeText(order.id)}
              >
                Copy order ID
              </DropdownMenuItem>
              <DropdownMenuSeparator />
            </DropdownMenuContent>
          </DropdownMenu>

          <OrderDialog
            order={order}
            isOpen={showDialog}
            onClose={() => setShowDialog(false)}
          />
        </>
      );
    },
  },
];
