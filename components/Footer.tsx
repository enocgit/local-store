"use client";
import Link from "next/link";
import { Facebook, Instagram, Twitter } from "lucide-react";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Icons } from "./Icons";
import siteMeta from "@/data/site-meta";

const footerLinks = {
  company: [
    { name: "About Us", href: "/about" },
    { name: "Terms of Service", href: "/terms-of-service" },
  ],
  // support: [{ name: "Track Order", href: "#" }],
  connect: [
    { name: "Contact Us", href: "/contact" },
    { name: "Feedback", href: "/feedback" },
  ],
};

const socialLinks = [
  { name: "Facebook", icon: Icons.facebook, href: "#" },
  { name: "Instagram", icon: Icons.instagram, href: "#" },
  { name: "X", icon: Icons.twitter, href: "#" },
];

export function Footer() {
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  async function handleSubscribe(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);

    const form = e.currentTarget;
    const email = form.email.value;

    try {
      const response = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          categories: ["newsletter"],
        }),
      });

      if (!response.ok) throw new Error();

      toast({
        title: "Subscription successful",
        description: "Please check your email to confirm your subscription",
      });
      form.reset();
    } catch (error) {
      toast({
        title: "Failed to subscribe",
        description: "Failed to subscribe. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <footer
      className={cn("border-t bg-white", {
        hidden: pathname.startsWith("/bridge"),
      })}
    >
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Company Info */}
          <div>
            <h3 className="mb-4 text-sm font-semibold text-gray-900">
              Company
            </h3>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-600 hover:text-gray-900"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          {/* <div>
            <h3 className="mb-4 text-sm font-semibold text-gray-900">
              Support
            </h3>
            <ul className="space-y-3">
              {footerLinks.support.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-600 hover:text-gray-900"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div> */}

          {/* Connect */}
          <div>
            <h3 className="mb-4 text-sm font-semibold text-gray-900">
              Connect
            </h3>
            <ul className="space-y-3">
              {footerLinks.connect.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-600 hover:text-gray-900"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="mb-4 text-sm font-semibold text-gray-900">
              Stay Updated
            </h3>
            <p className="mb-4 text-sm text-gray-600">
              Subscribe to our newsletter for exclusive offers and updates.
            </p>
            <form onSubmit={handleSubscribe} className="flex gap-2">
              <input
                name="email"
                type="email"
                placeholder="Enter your email"
                className="min-w-0 flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
              <button
                type="submit"
                disabled={isLoading}
                className="rounded-md bg-rose-500 px-4 py-2 text-sm font-medium text-white hover:bg-rose-500/90 focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
              >
                {isLoading ? "Subscribing..." : "Subscribe"}
              </button>
            </form>
          </div>
        </div>

        {/* Social Links & Copyright */}
        <div className="mt-12 border-t border-gray-200 pt-8">
          <div className="flex flex-col items-center justify-between md:flex-row">
            <div className="mb-4 flex space-x-6 md:mb-0">
              {socialLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <a
                    target="_blank"
                    rel="noopener noreferrer"
                    key={link.name}
                    href={link.href}
                    className="text-gray-600 hover:text-gray-900"
                  >
                    <span className="sr-only">{link.name}</span>
                    <Icon className="h-5 w-5" />
                  </a>
                );
              })}
            </div>
            <p className="text-sm text-gray-500">
              © {new Date().getFullYear()}{" "}
              {siteMeta.site_name || "Local Store"}. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
