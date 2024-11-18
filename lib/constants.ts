export const DELIVERY_TIME_SLOTS = [
  "08:00 - 10:00",
  "10:00 - 12:00",
  "12:00 - 14:00",
  "14:00 - 16:00",
  "16:00 - 18:00",
  "18:00 - 20:00",
] as const;

// Price multipliers for different days
export const PRICE_MULTIPLIERS = {
  THURSDAY: 1.0, // Normal price
  FRIDAY: 1.1, // 10% more
  SATURDAY: 1.2, // 20% more
} as const;

export type DeliveryTimeSlot = (typeof DELIVERY_TIME_SLOTS)[number];
