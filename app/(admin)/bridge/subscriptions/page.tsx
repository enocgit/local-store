import { prisma } from "@/lib/prisma";
import { DataTable } from "@/components/ui/data-table";
import { columns } from "./columns";
import { Heading } from "@/components/ui/heading";

export default async function SubscriptionsPage() {
  const subscriptions = await prisma.subscription.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  const formattedSubscriptions = subscriptions.map((subscription) => ({
    id: subscription.id,
    email: subscription.email,
    categories: subscription.categories,
    status: subscription.status,
    createdAt: new Date(subscription.createdAt),
  }));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Heading
          title="Subscriptions"
          description="Manage email subscriptions and newsletters"
        />
      </div>

      <DataTable
        columns={columns}
        data={formattedSubscriptions}
        searchKey="email"
      />
    </div>
  );
}
