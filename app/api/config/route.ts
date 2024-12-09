import { prisma } from "@/lib/prisma";

export async function GET() {
  const configs = await prisma.siteConfig.findMany({
    select: {
      key: true,
      value: true,
      valueJson: true,
      type: true,
    },
  });

  return Response.json(configs);
}
