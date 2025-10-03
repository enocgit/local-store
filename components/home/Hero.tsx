"use client";
import Image from "next/image";
import React from "react";
import Link from "next/link";
import { useSiteConfig } from "@/hooks/use-site-config";
import { Skeleton } from "../ui/skeleton";
import { BLUR_DATA_URL } from "@/constants/image";
import { ShoppingBag } from "lucide-react";
import { Button } from "../ui/button";

interface Homepage {
  title: string;
  description: string;
  image: string;
}

function Hero() {
  const { data: siteConfigs, isLoading } = useSiteConfig();
  const homepage = (siteConfigs?.homepage as Homepage) || null;

  if (isLoading) return <Skeleton className="h-[400px] w-full" />;

  return (
    <section className="relative flex h-[600px] items-center">
      <Image
        src={
          homepage?.image ||
          "https://images.unsplash.com/photo-1606787366850-de6330128bfc?auto=format&fit=crop&w=1920&q=80"
        }
        alt="Fresh food background"
        fill
        placeholder="blur"
        blurDataURL={BLUR_DATA_URL}
        className="object-cover brightness-50"
        priority
      />
      <div className="container relative z-10 mx-auto px-4">
        <div className="max-w-2xl animate-fade-in">
          <h1 className="mb-6 animate-slide-up text-5xl font-bold text-white">
            {homepage?.title || "Fresh Flavors, Delivered Fast"}
          </h1>
          <p className="mb-8 animate-slide-up-delay text-xl text-gray-200">
            {homepage?.description ||
              "Your one-stop shop for premium groceries, snacks, and essentials – all at your fingertips."}
          </p>
          <Link href="/products">
            <Button
              size="lg"
              className="group animate-fade-in-delay bg-rose-500 text-white transition-all duration-300 hover:translate-y-[-2px] hover:bg-white hover:text-black hover:shadow-xl hover:shadow-primary/50"
            >
              All products{" "}
              <ShoppingBag className="ml-2 h-5 w-5 transition-transform group-hover:scale-110" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}

export default Hero;
