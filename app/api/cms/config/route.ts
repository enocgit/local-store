import { prisma } from "@/lib/prisma";

export async function GET() {
  const configs = await prisma.siteConfig.findMany({
    orderBy: {
      group: "asc",
    },
  });
  return Response.json(configs);
}

export async function POST(req: Request) {
  const body = await req.json();

  const config = await prisma.siteConfig.create({
    data: {
      key: body.key,
      value: body.value,
      type: body.type,
      label: body.label,
      group: body.group,
    },
  });

  return Response.json(config);
}
