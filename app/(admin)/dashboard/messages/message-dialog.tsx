"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Message } from "./columns";
import { formatDistanceToNow } from "date-fns";

interface MessageDialogProps {
  isOpen: boolean;
  onClose: () => void;
  message: Message;
}

export function MessageDialog({ isOpen, onClose, message }: MessageDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Message from {message.name}</DialogTitle>
          <DialogDescription>
            Received {formatDistanceToNow(new Date(message.createdAt), { addSuffix: true })}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-medium">From</h4>
            <p className="text-sm text-muted-foreground">
              {message.name} ({message.email})
            </p>
          </div>
          <div>
            <h4 className="text-sm font-medium">Subject</h4>
            <p className="text-sm text-muted-foreground">{message.subject}</p>
          </div>
          <div>
            <h4 className="text-sm font-medium">Message</h4>
            <p className="text-sm text-muted-foreground whitespace-pre-wrap">
              {message.message}
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
