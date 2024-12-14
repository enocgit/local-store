"use client";

import { ColumnDef } from "@tanstack/react-table";
import { CellAction } from "./cell-action";
import { Review, User, Product } from "@prisma/client";
import { format } from "date-fns";

interface ReviewWithRelations extends Review {
  user: User;
  product: Product;
}

export const columns: ColumnDef<ReviewWithRelations>[] = [
  {
    accessorKey: "product.name",
    header: "Product",
  },
  {
    accessorKey: "user.firstName",
    header: "Customer",
  },
  {
    accessorKey: "rating",
    header: "Rating",
  },
  {
    accessorKey: "content",
    header: "Comment",
    cell: ({ row }) => row.original.content.slice(0, 30) + "...",
  },
  {
    accessorKey: "createdAt",
    header: "Date",
    cell: ({ row }) => format(row.original.createdAt, "MMMM d, yyyy"),
  },
  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];
