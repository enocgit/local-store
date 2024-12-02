import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const contactSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  subject: z.string().min(5),
  message: z.string().min(10),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validatedFields = contactSchema.safeParse(body);

    if (!validatedFields.success) {
      return NextResponse.json({ error: "Invalid form data" }, { status: 400 });
    }

    // Create contact record in database
    const contact = await prisma.contact.create({
      data: {
        name: validatedFields.data.name,
        email: validatedFields.data.email,
        subject: validatedFields.data.subject,
        message: validatedFields.data.message,
      },
    });

    return NextResponse.json(
      { message: "Message sent successfully", contact },
      { status: 200 },
    );
  } catch (error) {
    console.error("Contact form submission error:", error);
    return NextResponse.json(
      { error: "Failed to send message" },
      { status: 500 },
    );
  }
}
