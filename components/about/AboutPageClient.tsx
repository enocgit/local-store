"use client";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useSiteConfig } from "@/hooks/use-site-config";
import { Package } from "lucide-react";
import { BLUR_DATA_URL } from "@/enum/image";

interface AboutMission {
  title: string;
  description: string;
  image: string;
}

interface AboutValue {
  title: string;
  description: string;
}

export default function AboutPageClient() {
  const { data: siteConfigs } = useSiteConfig();
  const aboutMission = (siteConfigs?.mission as AboutMission) || null;
  const aboutValuesA = (siteConfigs?.values_a as AboutValue) || null;
  const aboutValuesB = (siteConfigs?.values_b as AboutValue) || null;
  const aboutValuesC = (siteConfigs?.values_c as AboutValue) || null;

  const values = [aboutValuesA, aboutValuesB, aboutValuesC];
  console.log(values);

  return (
    <div className="container mx-auto px-4 py-16">
      {/* Hero Section */}
      <section className="mb-20">
        <h1 className="mb-6 text-4xl font-bold md:text-5xl">About Us</h1>
        <p className="max-w-3xl text-xl text-muted-foreground">
          {siteConfigs?.about_description?.toString() || ""}
        </p>
      </section>

      {/* Stats Section */}
      {/* <section className="mb-20 grid grid-cols-1 gap-8 md:grid-cols-3">
        {[
          { number: "1M+", label: "Happy Customers" },
          { number: "50K+", label: "Products Delivered" },
          { number: "99%", label: "Customer Satisfaction" },
        ].map((stat) => (
          <div
            key={stat.label}
            className="rounded-lg bg-secondary p-6 text-center"
          >
            <div className="mb-2 text-4xl font-bold">{stat.number}</div>
            <div className="text-muted-foreground">{stat.label}</div>
          </div>
        ))}
      </section> */}

      {/* Mission Section */}
      <section className="mb-20">
        <div className="grid grid-cols-1 items-center gap-12 md:grid-cols-2">
          <div className="relative h-[400px]">
            <Image
              src={
                aboutMission?.image ||
                "https://utfs.io/f/5aK3NZMlDfcg03ZMPBuFdU6kMY9NLjOwprPiWl8htS3Bygs7"
              }
              alt={aboutMission?.title || ""}
              fill
              placeholder="blur"
              blurDataURL={BLUR_DATA_URL}
              className="rounded-lg object-cover"
            />
          </div>
          <div>
            <h2 className="mb-6 text-3xl font-bold">
              {aboutMission?.title || ""}
            </h2>
            <p className="mb-6 text-muted-foreground">
              {aboutMission?.description || ""}
            </p>
            <Button size="lg">Learn More</Button>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="mb-20">
        <h2 className="mb-12 text-center text-3xl font-bold">Our Values</h2>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {values.map((value) => (
            <div key={value?.title} className="rounded-lg border p-6">
              <div className="mb-4 text-4xl">
                <Package className="text-primary" />
              </div>
              <h3 className="mb-2 text-xl font-semibold">{value?.title}</h3>
              <p className="text-muted-foreground">{value?.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="rounded-lg bg-secondary p-12 text-center">
        <h2 className="mb-6 text-3xl font-bold">Join Our Journey</h2>
        <p className="mx-auto mb-8 max-w-2xl text-muted-foreground">
          Be part of our story as we continue to grow and innovate in the world
          of online retail.
        </p>
        <Link href="/contact">
          <Button size="lg">Contact Us</Button>
        </Link>
      </section>
    </div>
  );
}
