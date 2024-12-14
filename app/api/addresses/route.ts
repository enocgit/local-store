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

    // Check if address already exists for this user
    const existingAddress = await prisma.address.findFirst({
      where: {
        userId: session.user.id,
        address1: address1,
        address2: address2 || null, // handle optional address2
        city: city,
        postcode: postcode,
      },
    });

    if (existingAddress) {
      return NextResponse.json({ addressId: existingAddress.id });
    }

    // If no existing address found, create new one
    const address = await prisma.address.upsert({
      where: {
        userId_address1_address2_city_postcode: {
          userId: session.user.id,
          address1,
          address2: address2 || null,
          city,
          postcode,
        },
      },
      update: {}, // no updates needed since it's the same data
      create: {
        userId: session.user.id,
        address1,
        address2,
        city,
        postcode,
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
