import { clsx, type ClassValue } from "clsx";
import { isFriday, isSaturday, isThursday } from "date-fns";
import { twMerge } from "tailwind-merge";
import { PRICE_MULTIPLIERS } from "./constants";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-") // Replace spaces with -
    .replace(/[^\w\-]+/g, "") // Remove all non-word chars
    .replace(/\-\-+/g, "-"); // Replace multiple - with single -
}

export function formatPrice(price: number): string {
  return price.toLocaleString("en-GB", {
    style: "currency",
    currency: "GBP",
  });
}

export function calculatePriceForDate(basePrice: number, date?: Date): number {
  if (!date) return basePrice;

  if (isSaturday(date)) {
    return basePrice * PRICE_MULTIPLIERS.SATURDAY;
  }
  if (isFriday(date)) {
    return basePrice * PRICE_MULTIPLIERS.FRIDAY;
  }
  if (isThursday(date)) {
    return basePrice * PRICE_MULTIPLIERS.THURSDAY;
  }

  return basePrice;
}

export function isDeliveryDay(date: Date): boolean {
  return isThursday(date) || isFriday(date) || isSaturday(date);
}
