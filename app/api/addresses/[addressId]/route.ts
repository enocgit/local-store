import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { NextResponse } from "next/server";

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ addressId: string }> },
) {
  const { addressId } = await params;
  try {
    const session = await auth();

    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const address = await prisma.address.findUnique({
      where: {
        id: addressId,
        userId: session.user.id,
      },
    });

    if (!address) {
      return new NextResponse("Address not found", { status: 404 });
    }

    await prisma.address.delete({
      where: {
        id: addressId,
        userId: session.user.id,
      },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("[ADDRESS_DELETE]", error);
    // Check if it's a foreign key constraint error
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2003") {
        return new NextResponse(
          "This address cannot be deleted because it's associated with existing orders.",
          { status: 400 },
        );
      }
    }
    return new NextResponse("Internal error", { status: 500 });
  }
}
