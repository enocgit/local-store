"use client";

import { useCallback } from "react";
import { UploadButton as UTUploadButton } from "@uploadthing/react";
import { OurFileRouter } from "@/app/api/uploadthing/core";
import { useToast } from "@/hooks/use-toast";

interface UploadButtonProps {
  onUploadComplete?: (url: string) => void;
  onUploadError?: (error: Error) => void;
}

export function UploadButton({ onUploadComplete, onUploadError }: UploadButtonProps) {
  const { toast } = useToast();

  const handleClientUploadComplete = useCallback(
    (res: { url: string }[]) => {
      const url = res[0].url;
      toast({
        title: "Upload complete",
        description: "The image has been uploaded.",
      });
      if (onUploadComplete) {
        onUploadComplete(url);
      }
    },
    [onUploadComplete]
  );

  const handleUploadError = useCallback(
    (error: Error) => {
      toast({
        title: "Upload failed",
        description: error.message,
        variant: "destructive",
      });
      if (onUploadError) {
        onUploadError(error);
      }
    },
    [onUploadError]
  );

  return (
    <UTUploadButton<OurFileRouter, "imageUploader">
      endpoint="imageUploader"
      onClientUploadComplete={handleClientUploadComplete}
      onUploadError={handleUploadError}
    />
  );
}
