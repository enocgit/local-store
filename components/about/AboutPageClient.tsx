"use client";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useSiteConfig } from "@/hooks/use-site-config";
import { Package, Heart, Globe, ArrowRight } from "lucide-react";
import { BLUR_DATA_URL } from "@/enum/image";
import { motion } from "framer-motion";

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

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-primary/5">
      {/* Hero Section with Gradient */}
      <section className="relative overflow-hidden bg-gradient-to-r from-primary to-primary-foreground py-24 text-white">
        <div className="container mx-auto px-4">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 text-4xl font-bold md:text-5xl"
          >
            About Us
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="max-w-3xl text-xl text-white/90"
          >
            {siteConfigs?.about_description?.toString() || ""}
          </motion.p>
        </div>

        {/* Decorative Elements */}
        <div className="absolute inset-0 overflow-hidden opacity-10">
          <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-white" />
          <div className="absolute -bottom-8 -left-8 h-32 w-32 rounded-full bg-white" />
        </div>
      </section>

      {/* Mission Section with Animation */}
      <section className="container mx-auto px-4 py-24">
        <div className="grid grid-cols-1 items-center gap-12 md:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative h-[400px] overflow-hidden rounded-2xl shadow-2xl"
          >
            <Image
              src={
                aboutMission?.image ||
                "https://utfs.io/f/5aK3NZMlDfcg03ZMPBuFdU6kMY9NLjOwprPiWl8htS3Bygs7"
              }
              alt={aboutMission?.title || ""}
              fill
              placeholder="blur"
              blurDataURL={BLUR_DATA_URL}
              className="object-cover transition-transform duration-700 hover:scale-110"
            />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="mb-6 text-3xl font-bold text-primary">
              {aboutMission?.title || ""}
            </h2>
            <p className="mb-6 text-muted-foreground">
              {aboutMission?.description || ""}
            </p>
            <Button size="lg" className="group">
              Learn More
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Values Section with Hover Effects */}
      <section className="container mx-auto px-4 py-24">
        <h2 className="mb-12 text-center text-3xl font-bold text-primary">
          Our Values
        </h2>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {values.map((value, index) => (
            <motion.div
              key={value?.title}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
              className="group rounded-xl bg-white p-8 shadow-lg transition-all hover:-translate-y-2 hover:shadow-2xl"
            >
              <div className="mb-4 rounded-full bg-primary/10 p-4 text-4xl text-primary transition-colors group-hover:bg-primary group-hover:text-white">
                <Package className="h-8 w-8" />
              </div>
              <h3 className="mb-2 text-xl font-semibold">{value?.title}</h3>
              <p className="text-muted-foreground">{value?.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section with Gradient */}
      <section className="bg-gradient-to-r from-primary/90 to-primary-foreground/90 py-24 text-white">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="mb-6 text-3xl font-bold">Join Our Journey</h2>
            <p className="mx-auto mb-8 max-w-2xl text-white/90">
              Be part of our story as we continue to grow and innovate in the
              world of online retail.
            </p>
            <Link href="/contact">
              <Button
                size="lg"
                variant="secondary"
                className="group font-semibold"
              >
                Contact Us
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
