"use client";

import React, { useState } from "react";
import { Button } from "./ui/button";
import { ArrowRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

function WeeklySpecials() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  async function handleSubscribe(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);

    const form = e.currentTarget;
    const email = form.email.value;

    try {
      const response = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          categories: ["weekly-specials"],
        }),
      });

      if (!response.ok) throw new Error();

      toast({
        title: "Subscription successful",
        description: "Please check your email to confirm your subscription",
      });
      form.reset();
    } catch (error) {
      toast({
        title: "Failed to subscribe",
        description: "Failed to subscribe. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <section className="bg-primary py-16">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="mb-4 text-3xl font-bold text-white">
            Get Fresh Deals in Your Inbox
          </h2>
          <p className="mb-6 text-gray-200">
            Subscribe to receive weekly specials and cooking inspiration.
          </p>
          <form
            onSubmit={handleSubscribe}
            className="mx-auto flex min-w-0 max-w-md flex-wrap gap-2"
          >
            <input
              name="email"
              type="email"
              placeholder="Enter your email"
              className="flex-1 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-white"
            />
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-white text-primary hover:bg-gray-100"
            >
              {isLoading ? "Subscribing..." : "Subscribe"}
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
}

export default WeeklySpecials;
