"use client";
import Image from "next/image";
import React from "react";
import { Button } from "../ui/button";
import { ShoppingBag } from "lucide-react";
import Link from "next/link";
import { useSiteConfig } from "@/hooks/use-site-config";

interface Homepage {
  title: string;
  description: string;
  image: string;
}

function Hero() {
  const { data: siteConfigs } = useSiteConfig();
  const homepage = (siteConfigs?.homepage as Homepage) || null;

  if (!homepage) return null;

  return (
    <section className="relative flex h-[600px] items-center">
      <Image
        src={
          homepage?.image ||
          "https://images.unsplash.com/photo-1606787366850-de6330128bfc?auto=format&fit=crop&w=1920&q=80"
        }
        alt="Fresh food background"
        fill
        className="object-cover brightness-50"
        priority
      />
      <div className="container relative z-10 mx-auto px-4">
        <div className="max-w-2xl animate-fade-in">
          <h1 className="mb-6 animate-slide-up text-5xl font-bold text-white">
            {homepage?.title}
          </h1>
          <p className="mb-8 animate-slide-up-delay text-xl text-gray-200">
            {homepage?.description}
          </p>
          <Link href="/products">
            <Button
              size="lg"
              className="animate-fade-in-delay bg-white text-black transition-all duration-300 hover:translate-y-[-2px] hover:bg-gray-100 hover:shadow-lg"
            >
              All products <ShoppingBag className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}

export default Hero;
