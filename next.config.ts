import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },
  images: {
    remotePatterns: [
      {
        hostname: "images.unsplash.com",
      },
      {
        hostname: "www.google.com",
      },
      {
        hostname: "www.facebook.com",
      },
      {
        hostname: "utfs.io",
      },
    ],
  },
};

export default nextConfig;
