import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

import SuccessPageClient from "@/components/orders/SuccessPageClient";

// Make this page server-side rendered
export default async function SuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id: string }>;
}) {
  const { session_id } = await searchParams;
  if (!session_id) {
    redirect("/");
  }

  // Fetch order details using the Stripe session ID
  const order = await prisma.order.findFirst({
    where: {
      stripeSessionId: session_id,
    },
    include: {
      address: true,
    },
  });

  if (!order) {
    redirect("/");
  }

  return <SuccessPageClient order={order} />;
}
