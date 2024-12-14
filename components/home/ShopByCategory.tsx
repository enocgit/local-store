import Image from "next/image";
import React from "react";
import { getCategories } from "@/lib/api/categories";
import Link from "next/link";
import { BLUR_DATA_URL } from "@/enum/image";

async function ShopByCategory() {
  const categories = await getCategories();

  return (
    <section className="bg-gray-50 py-16">
      <div className="container mx-auto px-4">
        <h2 className="mb-8 text-3xl font-bold">Shop by Category</h2>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {categories.map((category, index) => (
            <Link key={category.id} href={`/category/${category.id}`}>
              <div
                key={index}
                className="group relative h-80 cursor-pointer overflow-hidden rounded-lg"
              >
                <Image
                  src={category.image}
                  alt={category.name}
                  placeholder="blur"
                  blurDataURL={BLUR_DATA_URL}
                  fill
                  className="object-cover transition-transform group-hover:scale-105"
                />
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 p-4 text-center">
                  <h3 className="mb-2 text-2xl font-bold text-white">
                    {category.name}
                  </h3>
                  <p className="text-sm text-gray-200">
                    {category.description}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

export default ShopByCategory;
