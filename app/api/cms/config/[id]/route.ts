import { prisma } from "@/lib/prisma";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const body = await req.json();

  const updated = await prisma.siteConfig.update({
    where: { id },
    data: {
      // If valueJson is provided, update it, otherwise update value
      ...(body.valueJson !== undefined
        ? { valueJson: body.valueJson }
        : { value: body.value }),
    },
  });

  return Response.json(updated);
}
