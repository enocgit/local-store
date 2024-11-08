import React from "react";
import { Button } from "./ui/button";
import { ArrowRight } from "lucide-react";

function Newsletter() {
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
          <div className="mx-auto flex max-w-md gap-2">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-white"
            />
            <Button className="bg-white text-primary hover:bg-gray-100">
              Subscribe <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Newsletter;
