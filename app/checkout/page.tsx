"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { loadStripe } from "@stripe/stripe-js";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { OrderSummary } from "@/components/checkout/OrderSummary";
import { DeliveryDetails } from "@/components/checkout/DeliveryDetails";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!,
);

const formSchema = z.object({
  firstName: z.string().min(2, "First name is required"),
  lastName: z.string().min(2, "Last name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Invalid phone number"),
  address1: z.string().min(5, "Address is required"),
  address2: z.string().optional(),
  city: z.string().min(2, "City is required"),
  postcode: z
    .string()
    .regex(/^[A-Z]{1,2}[0-9][A-Z0-9]? ?[0-9][A-Z]{2}$/i, "Invalid UK postcode"),
});

export default function CheckoutPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      address1: "",
      address2: "",
      city: "",
      postcode: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsLoading(true);

      // 1. Create order in your backend
      const orderResponse = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...values,
          items: [], // Add cart items here
          deliveryDate: "", // Add selected delivery date
          deliveryTime: "", // Add selected time slot
        }),
      });

      const { sessionId } = await orderResponse.json();

      // 2. Redirect to Stripe Checkout
      const stripe = await stripePromise;
      if (!stripe) throw new Error("Stripe failed to initialize");

      const { error } = await stripe.redirectToCheckout({ sessionId });
      if (error) throw error;
    } catch (error) {
      console.error("Checkout error:", error);
      // Handle error appropriately
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <h1 className="mb-8 text-2xl font-bold">Checkout</h1>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          <div>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <div className="space-y-4 rounded-lg bg-white p-6 shadow-sm">
                  <h2 className="mb-4 text-xl font-semibold">
                    Contact Information
                  </h2>
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="firstName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>First Name</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="lastName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Last Name</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input type="email" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone</FormLabel>
                        <FormControl>
                          <Input type="tel" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="space-y-4 rounded-lg bg-white p-6 shadow-sm">
                  <h2 className="mb-4 text-xl font-semibold">
                    Delivery Address
                  </h2>
                  <FormField
                    control={form.control}
                    name="address1"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Address Line 1</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="address2"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Address Line 2 (Optional)</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="city"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>City</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="postcode"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Postcode</FormLabel>
                          <FormControl>
                            <Input {...field} className="uppercase" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <DeliveryDetails />

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Processing..." : "Continue to Payment"}
                </Button>
              </form>
            </Form>
          </div>

          <div>
            <OrderSummary />
          </div>
        </div>
      </div>
    </div>
  );
}
