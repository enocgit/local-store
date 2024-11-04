"use client";

import { useState } from "react";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export function FilterSidebar() {
  const [priceRange, setPriceRange] = useState([0, 100]);

  return (
    <div className="w-full space-y-6 lg:w-64">
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="price">
          <AccordionTrigger>Price Range</AccordionTrigger>
          <AccordionContent>
            <div className="px-2">
              <Slider
                defaultValue={[0, 100]}
                max={100}
                step={1}
                value={priceRange}
                onValueChange={setPriceRange}
                className="my-4"
              />
              <div className="flex justify-between text-sm">
                <span>${priceRange[0]}</span>
                <span>${priceRange[1]}</span>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="dietary">
          <AccordionTrigger>Dietary Preferences</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              {["Vegetarian", "Vegan", "Gluten-Free", "Organic"].map((pref) => (
                <div key={pref} className="flex items-center space-x-2">
                  <Checkbox id={pref.toLowerCase()} />
                  <label
                    htmlFor={pref.toLowerCase()}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {pref}
                  </label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="brands">
          <AccordionTrigger>Brands</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              {[
                "Premium Select",
                "Organic Valley",
                "Nature's Best",
                "Farm Fresh",
              ].map((brand) => (
                <div key={brand} className="flex items-center space-x-2">
                  <Checkbox id={brand.toLowerCase()} />
                  <label
                    htmlFor={brand.toLowerCase()}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {brand}
                  </label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
