const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl:
    process.env.NEXT_PUBLIC_BASE_URL || "https://tropikalfoodsbradford.com",
  generateRobotsTxt: true,
  robotsTxtOptions: {
    policies: [
      { userAgent: "*", allow: "/" },
      {
        userAgent: "*",
        disallow: ["/bridge", "/api", "/checkout", "/cart", "/auth", "/search"],
      },
    ],
    additionalSitemaps: [
      (process.env.NEXT_PUBLIC_BASE_URL ||
        "https://tropikalfoodsbradford.com") + "/sitemap-0.xml",
    ],
  },
  exclude: ["/bridge/*", "/api/*", "/checkout", "/cart", "/auth/*", "/search"],
  transform: async (config, path) => {
    // Ensure the path is a clean string without quotes
    const cleanPath = path.replace(/['"]/g, "");
    const baseUrl =
      process.env.NEXT_PUBLIC_BASE_URL || "https://tropikalfoodsbradford.com";

    return {
      loc: baseUrl + cleanPath, // Prepend base URL to ensure absolute URLs
      changefreq: config.changefreq,
      priority: config.priority,
      lastmod: config.autoLastmod ? new Date().toISOString() : undefined,
    };
  },
  additionalPaths: async (config) => {
    const result = [];

    try {
      const products = await prisma.product.findMany({
        select: { id: true },
      });

      products.forEach((product) => {
        result.push({
          loc: `/product/${product.id}`,
          changefreq: "daily",
          priority: 0.8,
          lastmod: new Date().toISOString(),
        });
      });

      const categories = await prisma.category.findMany({
        select: { id: true },
      });

      categories.forEach((category) => {
        result.push({
          loc: `/category/${category.id}`,
          changefreq: "daily",
          priority: 0.7,
          lastmod: new Date().toISOString(),
        });
      });

      result.push({
        loc: "/category/new-arrivals",
        changefreq: "daily",
        priority: 0.9,
        lastmod: new Date().toISOString(),
      });

      return result;
    } finally {
      await prisma.$disconnect();
    }
  },
  formatFeed: (data) => {
    // Custom formatter to ensure XML is properly formatted without quotes
    return data.replace(/&quot;/g, "").replace(/["']/g, "");
  },
};
