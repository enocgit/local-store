"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { Slider } from "@/components/ui/slider";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export function FilterSidebar() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const [maxPrice, setMaxPrice] = useState(50);
  const minPrice = Number(searchParams.get("minPrice")) || 0;
  const maxPriceParam =
    Number(searchParams.get("maxPrice")) || Math.ceil(maxPrice + 20);
  const defaultValue = [minPrice, maxPriceParam];

  const [currentValue, setCurrentValue] = useState(defaultValue);

  useEffect(() => {
    fetch("/api/products/max-price")
      .then((res) => res.json())
      .then((data) => setMaxPrice(data.maxPrice));
  }, []);

  useEffect(() => {
    setCurrentValue([minPrice, maxPriceParam]);
  }, [minPrice, maxPriceParam]);

  const updatePriceRange = (values: number[]) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("minPrice", values[0].toString());
    params.set("maxPrice", values[1].toString());
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="w-full space-y-6 lg:w-64">
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="price">
          <AccordionTrigger>Price Range</AccordionTrigger>
          <AccordionContent>
            <div className="px-2 pt-5">
              <Slider
                defaultValue={defaultValue}
                value={currentValue}
                max={maxPrice}
                step={1}
                onValueChange={setCurrentValue}
                onValueCommit={updatePriceRange}
              />
              <div className="mt-2 flex justify-between text-sm">
                <span>£{currentValue[0]}</span>
                <span>£{currentValue[1]}</span>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
