"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
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
import { useCart } from "@/lib/store/cart-context";
import { DELIVERY_TIME_SLOTS } from "@/lib/constants";
import { formatPrice, isDeliveryDay } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { LoginDialog } from "@/components/auth/LoginDialog";

export default function CartPage() {
  const { state, dispatch } = useCart();
  const { data: session } = useSession();
  const [showLoginDialog, setShowLoginDialog] = useState(false);
  const router = useRouter();

  const handleCheckoutClick = () => {
    if (!session) {
      setShowLoginDialog(true);
    } else {
      if (!canCheckout) return;
      router.push("/checkout");
    }
  };

  const isValidPostcode = (postcode: string) => {
    const postcodeRegex = /^[A-Z]{1,2}[0-9][A-Z0-9]? ?[0-9][A-Z]{2}$/i;
    return postcodeRegex.test(postcode);
  };

  const updateQuantity = (id: string, change: number, weight?: number) => {
    const item = state.items.find((item) => 
      (item.weight ? `${item.id}-${item.weight}` : item.id) === 
      (weight ? `${id}-${weight}` : id)
    );
    if (!item) return;
  
    const newQuantity = Math.max(0, item.quantity + change);
    if (newQuantity === 0) {
      dispatch({
        type: "REMOVE_ITEM",
        payload: { id, weight: weight as number },
      });
    } else {
      dispatch({
        type: "UPDATE_QUANTITY",
        payload: { id, quantity: newQuantity, weight: weight as number },
      });
    }
  };

  const deliveryFee = state.subtotal > 50 ? 0 : 4.99;
  const total = state.subtotal + deliveryFee;

  const canCheckout =
    state.deliveryDate &&
    state.deliveryTime &&
    isValidPostcode(state.postcode) &&
    state.items.length > 0;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <h1 className="mb-8 text-2xl font-bold">Shopping Cart</h1>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Cart Items */}
          <div className="space-y-4 lg:col-span-2">
            {state.items.length === 0 ? (
              <Card>
                <CardContent className="p-6 text-center">
                  <p className="mb-4 text-gray-600">Your cart is empty</p>
                  <Link href="/">
                    <Button>Continue Shopping</Button>
                  </Link>
                </CardContent>
              </Card>
            ) : (
              state.items.map((item) => (
                <Card key={`${item.id}-${item.weight}`}>
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
                          {formatPrice(item.price)}
                          {item.weight ? ` per kg` : ""}
                        </p>
                        {item.weight && (
                          <div className="mb-2 space-y-2">
                            <Select
                              value={item.weight?.toString()}
                              onValueChange={(value) => {
                                const newWeight = parseFloat(value);
                                if (newWeight !== item.weight) {
                                  dispatch({
                                    type: "CHANGE_WEIGHT",
                                    payload: {
                                      id: item.id,
                                      oldWeight: item.weight!,
                                      newWeight: newWeight,
                                      price: item.price,
                                    },
                                  });
                                }
                              }}
                            >
                              <SelectTrigger className="w-[140px]">
                                <SelectValue placeholder="Select weight" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="1">
                                  1 kg - {formatPrice(item.price)}
                                </SelectItem>
                                {item.weightOptions?.map((weight: number) => (
                                  <SelectItem
                                    key={weight}
                                    value={weight.toString()}
                                  >
                                    {weight} kg -{" "}
                                    {formatPrice(item.price * weight)}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        )}
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => updateQuantity(item.id, -1, item.weight)}
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <span className="w-8 text-center">
                            {item.quantity}
                          </span>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => updateQuantity(item.id, 1, item.weight)}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              dispatch({
                                type: "REMOVE_ITEM",
                                payload: { id: item.id, weight: item.weight! },
                              })
                            }
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">
                          {formatPrice(
                            item.price * (item.weight || 1) * item.quantity,
                          )}
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
                    value={state.postcode}
                    onChange={(e) =>
                      dispatch({
                        type: "SET_POSTCODE",
                        payload: e.target.value,
                      })
                    }
                    className="uppercase"
                  />
                  {state.postcode && !isValidPostcode(state.postcode) && (
                    <p className="text-sm text-red-500">
                      Please enter a valid UK postcode
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Delivery Date</label>
                  <Calendar
                    mode="single"
                    selected={state.deliveryDate}
                    onSelect={(date) =>
                      date &&
                      dispatch({ type: "SET_DELIVERY_DATE", payload: date })
                    }
                    disabled={(date) =>
                      !isDeliveryDay(date) ||
                      date <= new Date(new Date().setHours(0, 0, 0, 0))
                    }
                    modifiers={{
                      thursday: (date) => isDeliveryDay(date),
                    }}
                    modifiersClassNames={{
                      thursday: "bg-green-100",
                    }}
                  />
                  <p className="text-sm text-gray-600">
                    Delivery available Thursday through Saturday
                  </p>
                </div>

                {state.deliveryDate && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Delivery Time</label>
                    <Select
                      value={state.deliveryTime}
                      onValueChange={(value) =>
                        dispatch({ type: "SET_DELIVERY_TIME", payload: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a time slot" />
                      </SelectTrigger>
                      <SelectContent>
                        {DELIVERY_TIME_SLOTS.map((slot) => (
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
                  <span>{formatPrice(state.subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery</span>
                  <span>
                    {deliveryFee === 0 ? (
                      <span className="text-green-600">Free</span>
                    ) : (
                      formatPrice(deliveryFee)
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
                    <span>{formatPrice(total)}</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col items-start gap-2">
                <Button
                  className="w-full"
                  disabled={!canCheckout}
                  onClick={handleCheckoutClick}
                >
                  {session ? (
                    <>
                      <Truck className="mr-2 h-4 w-4" />
                      Proceed to Checkout
                    </>
                  ) : (
                    <>Sign in to Checkout</>
                  )}
                </Button>
                <ul className="list-inside list-disc text-sm text-red-500">
                  {!state.postcode && <li>Please enter your postcode</li>}
                  {!state.deliveryDate && (
                    <li>Please select a delivery date</li>
                  )}
                  {!state.deliveryTime && (
                    <li>Please select a delivery time</li>
                  )}
                  {state.items.length === 0 && (
                    <li>Your cart is empty</li>
                  )}
                </ul>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
      <LoginDialog
        open={showLoginDialog}
        onOpenChange={setShowLoginDialog}
        session={session}
      />
    </div>
  );
}
