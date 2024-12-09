import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { ReviewClient } from "./components/client";
import { prisma } from "@/lib/prisma";

export default async function ReviewsPage() {
  const session = await auth();

  if (!session?.user || session.user.role !== "ADMIN") {
    redirect("/");
  }

  const reviews = await prisma.review.findMany({
    orderBy: {
      createdAt: "desc",
    },
    include: {
      user: true,
      product: true,
    },
  });

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 pt-2">
        <ReviewClient data={reviews} />
      </div>
    </div>
  );
}
