import { sendDeliveryReminderEmail } from "@/utils/email";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { orderId } = await req.json();

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        user: true,
        items: true,
      },
    });

    if (!order) {
      return new Response("Order not found", { status: 404 });
    }

    await sendDeliveryReminderEmail({
      email: order.user.email,
      orderId: order.id,
      items: order.items,
      deliveryDate: order.deliveryDate,
      deliveryTime: order.deliveryTime,
      customerName:
        `${order.user.firstName} ${order.user.lastName}` || "Valued Customer",
    });

    return new Response("Reminder sent successfully", { status: 200 });
  } catch (error) {
    return new Response("Failed to send reminder", { status: 500 });
  }
}
