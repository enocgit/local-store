"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, User } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

export type Customer = {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  createdAt: Date;
  updatedAt: Date;
};

export const columns: ColumnDef<Customer>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "phone",
    header: "Phone",
  },
  {
    accessorKey: "role",
    header: "Role",
    cell: ({ row }) => {
      const role: string = row.getValue("role");
      return (
        <Badge variant={role === "ADMIN" ? "destructive" : "secondary"}>
          {role}
        </Badge>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: "Member Since",
    cell: ({ row }) => {
      const date: Date = row.getValue("createdAt");
      return formatDistanceToNow(date, { addSuffix: true });
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const customer = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => navigator.clipboard.writeText(customer.email)}>
              Copy email
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigator.clipboard.writeText(customer.phone)}>
              Copy phone
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
