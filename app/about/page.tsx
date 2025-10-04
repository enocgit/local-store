import React from "react";
import { Metadata } from "next";
import AboutPageClient from "@/components/about/AboutPageClient";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Learn more about our mission, values, and the team behind Local Store",
};

export default function AboutPage() {
  return <AboutPageClient />;
}
