"use client";

import { useState } from "react";
import { Slider } from "@/components/ui/slider";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export function FilterSidebar() {
  const maxPrice = 2000;
  const defaultValue = [0, maxPrice];
  const [priceRange, setPriceRange] = useState(defaultValue);

  return (
    <div className="w-full space-y-6 lg:w-64">
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="price">
          <AccordionTrigger>Price Range</AccordionTrigger>
          <AccordionContent>
            <div className="px-2">
              <Slider
                defaultValue={defaultValue}
                max={maxPrice}
                step={1}
                value={priceRange}
                onValueChange={setPriceRange}
                className="my-4"
              />
              <div className="flex justify-between text-sm">
                <span>£{priceRange[0]}</span>
                <span>£{priceRange[1]}</span>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
