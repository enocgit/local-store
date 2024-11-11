"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { format, addDays, isThursday, isFriday, isSaturday } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Minus, Plus, Trash2, Truck } from "lucide-react";

// Mock cart data - would come from a cart context/store
const cartItems = [
  {
    id: 1,
    name: "Premium Frozen Pizza Pack",
    image:
      "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=800&q=80",
    price: 12.99,
    quantity: 2,
    fridayPrice: 12.99,
    saturdayPrice: 14.99,
  },
  {
    id: 2,
    name: "Organic Mixed Berries",
    image:
      "https://images.unsplash.com/photo-1563746098251-d35aef196e83?auto=format&fit=crop&w=800&q=80",
    price: 8.99,
    quantity: 1,
    fridayPrice: 8.99,
    saturdayPrice: 10.99,
  },
];

const deliveryTimeSlots = [
  "08:00 - 10:00",
  "10:00 - 12:00",
  "12:00 - 14:00",
  "14:00 - 16:00",
  "16:00 - 18:00",
  "18:00 - 20:00",
];

export default function CartPage() {
  const [items, setItems] = useState(cartItems);
  const [deliveryDate, setDeliveryDate] = useState<Date>();
  const [deliveryTime, setDeliveryTime] = useState<string>();
  const [postcode, setPostcode] = useState("");

  const isValidPostcode = (postcode: string) => {
    // UK postcode regex pattern
    const postcodeRegex = /^[A-Z]{1,2}[0-9][A-Z0-9]? ?[0-9][A-Z]{2}$/i;
    return postcodeRegex.test(postcode);
  };

  const updateQuantity = (id: number, change: number) => {
    setItems(
      items.map((item) =>
        item.id === id
          ? { ...item, quantity: Math.max(0, item.quantity + change) }
          : item,
      ),
    );
  };

  const removeItem = (id: number) => {
    setItems(items.filter((item) => item.id !== id));
  };

  const isDeliveryDay = (date: Date) => {
    return isThursday(date) || isFriday(date) || isSaturday(date);
  };

  const getItemPrice = (item: (typeof cartItems)[0]) => {
    if (!deliveryDate) return item.price;
    return isSaturday(deliveryDate) ? item.saturdayPrice : item.fridayPrice;
  };

  const subtotal = items.reduce(
    (sum, item) => sum + getItemPrice(item) * item.quantity,
    0,
  );
  const deliveryFee = subtotal > 50 ? 0 : 4.99;
  const total = subtotal + deliveryFee;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <h1 className="mb-8 text-2xl font-bold">Shopping Cart</h1>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Cart Items */}
          <div className="space-y-4 lg:col-span-2">
            {items.length === 0 ? (
              <Card>
                <CardContent className="p-6 text-center">
                  <p className="mb-4 text-gray-600">Your cart is empty</p>
                  <Link href="/">
                    <Button>Continue Shopping</Button>
                  </Link>
                </CardContent>
              </Card>
            ) : (
              items.map((item) => (
                <Card key={item.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-4">
                      <div className="relative h-24 w-24 overflow-hidden rounded-md">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold">{item.name}</h3>
                        <p className="mb-2 text-sm text-gray-600">
                          £{getItemPrice(item).toFixed(2)}
                        </p>
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => updateQuantity(item.id, -1)}
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <span className="w-8 text-center">
                            {item.quantity}
                          </span>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => updateQuantity(item.id, 1)}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="ml-4"
                            onClick={() => removeItem(item.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">
                          £{(getItemPrice(item) * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>

          {/* Order Summary */}
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Delivery Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Postcode</label>
                  <Input
                    placeholder="Enter your postcode"
                    value={postcode}
                    onChange={(e) => setPostcode(e.target.value)}
                    className="uppercase"
                  />
                  {postcode && !isValidPostcode(postcode) && (
                    <p className="text-sm text-red-500">
                      Please enter a valid UK postcode
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Delivery Date</label>
                  <Calendar
                    mode="single"
                    selected={deliveryDate}
                    onSelect={setDeliveryDate}
                    disabled={(date) => !isDeliveryDay(date)}
                    modifiers={{
                      thursday: (date) => isThursday(date),
                      friday: (date) => isFriday(date),
                      saturday: (date) => isSaturday(date),
                    }}
                    modifiersClassNames={{
                      thursday: "bg-red-100",
                      friday: "bg-green-100",
                      saturday: "bg-blue-100",
                    }}
                  />
                  <p className="text-sm text-gray-600">
                    Delivery available only on Thursday, Friday and Saturday
                  </p>
                </div>

                {deliveryDate && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Delivery Time</label>
                    <Select onValueChange={setDeliveryTime}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a time slot" />
                      </SelectTrigger>
                      <SelectContent>
                        {deliveryTimeSlots.map((slot) => (
                          <SelectItem key={slot} value={slot}>
                            {slot}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>£{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery</span>
                  <span>
                    {deliveryFee === 0 ? (
                      <span className="text-green-600">Free</span>
                    ) : (
                      `£${deliveryFee.toFixed(2)}`
                    )}
                  </span>
                </div>
                {deliveryFee > 0 && (
                  <p className="text-sm text-gray-600">
                    Free delivery on orders over £50
                  </p>
                )}
                <div className="mt-2 border-t pt-2">
                  <div className="flex justify-between font-bold">
                    <span>Total</span>
                    <span>£{total.toFixed(2)}</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <a href="/checkout" className="w-full">
                  <Button
                    className="w-full"
                    disabled={
                      !deliveryDate ||
                      !deliveryTime ||
                      !isValidPostcode(postcode) ||
                      items.length === 0
                    }
                  >
                    <Truck className="mr-2 h-4 w-4" />
                    Proceed to Checkout
                  </Button>
                </a>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
