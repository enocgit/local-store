"use client";
import { CategoryHeader } from "../category/CategoryHeader";
import { useSiteConfig } from "@/hooks/use-site-config";

interface NewArrivalsHeaderProps {
  title: string;
  description: string;
  image: string;
}

export default function NewArrivalsHeader() {
  const { data: siteConfigs } = useSiteConfig();
  const newArrivalsHeader =
    (siteConfigs?.new_arrivals as NewArrivalsHeaderProps) || null;

  if (!newArrivalsHeader) return null;

  return (
    <CategoryHeader
      title={newArrivalsHeader.title}
      description={newArrivalsHeader.description}
      image={
        newArrivalsHeader.image ||
        "https://utfs.io/f/5aK3NZMlDfcg03ZMPBuFdU6kMY9NLjOwprPiWl8htS3Bygs7"
      }
    />
  );
}
