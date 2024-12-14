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
import { MoreHorizontal, Mail } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useState } from "react";
import { MessageDialog } from "./message-dialog";

export type Message = {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt: Date;
  status: string;
};

async function updateMessageStatus(id: string, status: string) {
  try {
    const response = await fetch(`/api/messages/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status }),
    });

    if (!response.ok) {
      throw new Error("Failed to update message status");
    }

    return await response.json();
  } catch (error) {
    console.error("Error updating message status:", error);
    throw error;
  }
}

export const columns: ColumnDef<
  {
    id: string;
    name: string;
    email: string;
    subject: string;
    message: string;
    createdAt: Date;
    status: string;
  },
  unknown
>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "subject",
    header: "Subject",
    cell: ({ row }) => row.original.subject.slice(0, 30) + "...",
  },
  {
    accessorKey: "createdAt",
    header: "Received",
    cell: ({ row }) => {
      return formatDistanceToNow(new Date(row.original.createdAt), {
        addSuffix: true,
      });
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      return (
        <Badge
          variant={row.original.status === "READ" ? "secondary" : "default"}
        >
          {row.original.status}
        </Badge>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const message = row.original;
      const [isDialogOpen, setIsDialogOpen] = useState(false);

      const handleStatusUpdate = async () => {
        try {
          const newStatus = message.status === "READ" ? "UNREAD" : "READ";
          await updateMessageStatus(message.id, newStatus);
          // Refresh the page to show updated data
          window.location.reload();
        } catch (error) {
          console.error("Failed to update status:", error);
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
              <DropdownMenuItem onClick={() => setIsDialogOpen(true)}>
                <Mail className="mr-2 h-4 w-4" />
                View Message
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleStatusUpdate}>
                Mark as {message.status === "READ" ? "Unread" : "Read"}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <MessageDialog
            isOpen={isDialogOpen}
            onClose={() => setIsDialogOpen(false)}
            message={message}
          />
        </>
      );
    },
  },
];
