"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

interface ProductImage {
  publicUrl: string;
  alt?: string;
}

interface ProductGalleryProps {
  images: ProductImage[];
  badge?: string | null;
}

export function ProductGallery({ images, badge }: ProductGalleryProps) {
  const [selectedImage, setSelectedImage] = useState(0);

  // Limit to 5 images
  const displayImages = images.slice(0, 5);

  return (
    <div className="flex gap-4 max-[500px]:flex-col">
      {/* Thumbnails */}
      <div className="hide-scrollbar flex flex-col gap-4 max-[500px]:flex-row max-[500px]:overflow-x-auto">
        {displayImages.map((image, index) => (
          <button
            key={index}
            onClick={() => setSelectedImage(index)}
            className={cn(
              "relative h-20 w-20 overflow-hidden rounded-lg border-2 transition-all max-[500px]:flex-shrink-0",
              selectedImage === index
                ? "border-primary ring-2 ring-primary/20"
                : "border-transparent hover:border-gray-200",
            )}
          >
            <Image
              src={image?.publicUrl || ""}
              alt={image?.alt || `Product image ${index + 1}`}
              fill
              className="object-cover"
            />
          </button>
        ))}
      </div>

      {/* Main Image */}
      <div className="relative flex-1">
        <div className="relative overflow-hidden rounded-lg max-[500px]:aspect-video min-[500px]:h-[500px]">
          <Image
            src={displayImages[selectedImage]?.publicUrl || ""}
            alt={displayImages[selectedImage]?.alt || "Product image"}
            fill
            className="object-cover"
            priority
          />
          {badge && <Badge className="absolute right-4 top-4">{badge}</Badge>}
        </div>
      </div>
    </div>
  );
}
