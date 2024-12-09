import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const siteConfigs = [
  {
    key: "contact_email",
    value: "support@tropikalfoodsbradford.com",
    type: "text",
    label: "Email Us",
    group: "contact",
  },
  {
    key: "support_phone",
    value: "+44 (0) 7402 771713",
    type: "text",
    label: "Call Us",
    group: "contact",
  },
  {
    key: "homepage_hero_image",
    value: "/images/hero.jpg",
    type: "image",
    label: "Homepage Hero Image",
    group: "homepage",
  },
  {
    key: "about_mission_image",
    value: "/images/mission.jpg",
    type: "image",
    label: "About Us Mission Image",
    group: "about",
  },
  {
    key: "new_arrivals_banner",
    value: "/images/new-arrivals.jpg",
    type: "image",
    label: "New Arrivals Category Banner",
    group: "category",
  },
];

async function main() {
  // Clear existing configs first (optional)
  await prisma.siteConfig.deleteMany();

  // Create new configs
  for (const config of siteConfigs) {
    await prisma.siteConfig.create({
      data: config,
    });
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
