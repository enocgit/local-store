"use client";
import Image from "next/image";
import React from "react";
import Link from "next/link";
import { useSiteConfig } from "@/hooks/use-site-config";
import { Skeleton } from "../ui/skeleton";

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
    <section className="relative overflow-hidden bg-gradient-to-br from-primary via-primary-foreground to-primary/80">
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
      <div className="container mx-auto px-4 py-24">
        <div className="relative z-10 text-center text-white">
          <h1 className="animate-fade-up mb-6 text-5xl font-bold">
            {homepage?.title?.split("|")[0] || "Fresh Caribbean Food"}
            <span className="block text-yellow-300">
              {homepage?.title?.split("|")[1] || "Delivered to Your Door"}
            </span>
          </h1>
          <p className="animate-fade-up animation-delay-100 mb-8 text-xl text-white/90">
            {homepage?.description ||
              "Authentic flavors from the Caribbean, now in Bradford"}
          </p>
          <Link
            href="/products"
            className="inline-block rounded-full bg-white px-8 py-3 text-lg font-semibold text-green-500 transition-transform hover:scale-105"
          >
            Shop Now
          </Link>
        </div>

        <div className="absolute inset-0 opacity-10">
          <div className="animate-float absolute left-10 top-10 h-20 w-20 rounded-full bg-yellow-300" />
          <div className="animate-float animation-delay-200 absolute bottom-10 right-10 h-16 w-16 rounded-full bg-green-300" />
        </div>
      </div>
    </section>
  );
}

export default Hero;
