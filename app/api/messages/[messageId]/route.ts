import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ messageId: string }> }
) {
  const {messageId} = await params;
  try {
    const session = await auth();

    if (!session?.user || session.user.role !== "ADMIN") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { status } = body;

    if (!status || !["READ", "UNREAD"].includes(status)) {
      return new NextResponse("Invalid status", { status: 400 });
    }

    const message = await prisma.contact.update({
      where: {
        id: messageId,
      },
      data: {
        status,
      },
    });

    return NextResponse.json(message);
  } catch (error) {
    console.error("[MESSAGE_PATCH]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
