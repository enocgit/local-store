"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { formatDistanceToNow } from "date-fns";
import Image from "next/image";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { MoreHorizontal, Pencil, Trash, Eye } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  comparePrice: number | null;
  stock: number;
  images: string[];
  badge: string | null;
  featured: boolean;
  categoryName: string;
  createdAt: Date;
};

export const columns: ColumnDef<Product>[] = [
  {
    accessorKey: "name",
    header: "Name",
    accessorFn: (row) => row.name,
  },
  {
    accessorKey: "images",
    header: "Image",
    accessorFn: (row) => row.images,
    cell: ({ row }) => {
      const images: string[] = row.getValue("images");
      return (
        <div className="relative h-12 w-12">
          <Image
            src={images[0] || "https://utfs.io/f/5aK3NZMlDfcgitELvDk7LYHbEWfe83jx2TrO9msKg4loynPa"}
            alt="Product image"
            fill
            className="rounded-md object-cover"
          />
        </div>
      );
    },
  },
  {
    accessorKey: "price",
    header: "Price",
    accessorFn: (row) => row.price,
    cell: ({ row }) => {
      const price: number = row.getValue("price");
      const formatted = new Intl.NumberFormat("en-GB", {
        style: "currency",
        currency: "GBP",
      }).format(price);
      return formatted;
    },
  },
  {
    accessorKey: "stock",
    header: "Stock",
    accessorFn: (row) => row.stock,
    cell: ({ row }) => {
      const stock: number = row.getValue("stock");
      return (
        <Badge variant={stock > 0 ? "success" : "destructive"}>
          {stock > 0 ? "In Stock" : "Out of Stock"}
        </Badge>
      );
    },
  },
  {
    accessorKey: "categoryName",
    header: "Category",
    accessorFn: (row) => row.categoryName,
  },
  {
    accessorKey: "createdAt",
    header: "Created",
    accessorFn: (row) => row.createdAt,
    cell: ({ row }) => {
      const date: Date = row.getValue("createdAt");
      return formatDistanceToNow(date, { addSuffix: true });
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const [open, setOpen] = useState(false);
      const { toast } = useToast();
      const router = useRouter();
      const product = row.original;

      const onDelete = async () => {
        try {
          await fetch(`/api/products/${product.id}`, {
            method: "DELETE",
          });
          toast({
            title: "Success",
            description: "Product deleted successfully.",
          });
          router.refresh();
        } catch (error) {
          toast({
            title: "Error",
            description: "Something went wrong.",
            variant: "destructive",
          });
        }
      };

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
              <DropdownMenuItem onClick={() => router.push(`/product/${product.id}`)}>
                <Eye className="mr-2 h-4 w-4" />
                View
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => router.push(`/bridge/products/${product.id}`)}>
                <Pencil className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setOpen(true)}>
                <Trash className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete the
                  product.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={onDelete}>Delete</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </>
      );
    },
  },
];
