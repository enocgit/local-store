"use client";
import { CategoryHeader } from "../category/CategoryHeader";
import { useSiteConfig } from "@/hooks/use-site-config";

interface ProductsHeaderProps {
  title: string;
  description: string;
  image: string;
}

export default function ProductsHeader() {
  const { data: siteConfigs } = useSiteConfig();
  const productsHeader = (siteConfigs?.products as ProductsHeaderProps) || null;

  if (!productsHeader) return null;

  return (
    <CategoryHeader
      title={productsHeader.title}
      description={productsHeader.description}
      image={
        productsHeader.image ||
        "https://utfs.io/f/5aK3NZMlDfcg03ZMPBuFdU6kMY9NLjOwprPiWl8htS3Bygs7"
      }
    />
  );
}
