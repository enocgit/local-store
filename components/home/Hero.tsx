import Image from "next/image";
import React from "react";
import { Button } from "../ui/button";
import { ShoppingBag } from "lucide-react";

function Hero() {
  return (
    <section className="relative flex h-[600px] items-center">
      <Image
        src="https://images.unsplash.com/photo-1606787366850-de6330128bfc?auto=format&fit=crop&w=1920&q=80"
        alt="Fresh food background"
        fill
        className="object-cover brightness-50"
        priority
      />
      <div className="container relative z-10 mx-auto px-4">
        <div className="animate-fade-in max-w-2xl">
          <h1 className="animate-slide-up mb-6 text-5xl font-bold text-white">
            Fresh Food, Delivered Fresh
          </h1>
          <p className="animate-slide-up-delay mb-8 text-xl text-gray-200">
            Premium quality frozen foods and fresh ingredients delivered to your
            doorstep
          </p>
          <Button
            size="lg"
            className="animate-fade-in-delay bg-white text-black transition-all duration-300 hover:translate-y-[-2px] hover:bg-gray-100 hover:shadow-lg"
          >
            Shop Now <ShoppingBag className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>
    </section>
  );
}

export default Hero;
