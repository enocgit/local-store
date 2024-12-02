import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
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
