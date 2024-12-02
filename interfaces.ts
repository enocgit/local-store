import { Product, Review } from "@prisma/client";

export interface ProductType extends Product {
  images: any[];
  reviews: Review[];
  category: {
    name: string;
  };
}

export interface ProductCardProps {
  product: {
    id: string;
    name: string;
    rating: number;
    reviews: Review[];
    price: number;
    comparePrice: number | null;
    images: string[];
    badge?: string | null;
    weightOptions?: number[];
  };
}
