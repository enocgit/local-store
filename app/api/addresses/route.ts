import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { address1, address2, city, postcode } = body;

    // Create new address
    const address = await prisma.address.create({
      data: {
        userId: session.user.id,
        address1,
        address2,
        city,
        postcode,
        // You might want to set isDefault based on whether user has other addresses
        isDefault: false,
      },
    });

    return NextResponse.json({ addressId: address.id });
  } catch (error) {
    console.error("Address creation failed:", error);
    return NextResponse.json(
      { error: "Address creation failed" },
      { status: 500 },
    );
  }
}

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const addresses = await prisma.address.findMany({
      where: {
        userId: session.user.id,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({ addresses });
  } catch (error) {
    console.error("Failed to fetch addresses:", error);
    return NextResponse.json(
      { error: "Failed to fetch addresses" },
      { status: 500 },
    );
  }
}
