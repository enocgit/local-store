import { prisma } from "@/lib/prisma";
import { DataTable } from "@/components/ui/data-table";
import { columns } from "./columns";

export default async function OrdersPage() {
  const orders = await prisma.order.findMany({
    orderBy: {
      createdAt: "desc",
    },
    include: {
      user: true,
      items: {
        include: {
          product: true,
        },
      },
      address: true,
    },
  });

  const formattedOrders = orders.map((order) => ({
    id: order.id,
    customer: {
      name: order.user.firstName + " " + order.user.lastName || "Anonymous",
      email: order.user.email,
    },
    name: order.user.firstName + " " + order.user.lastName || "Anonymous",
    email: order.user.email,
    status: order.status,
    items: order.items.length,
    total: order.subtotal + order.deliveryFee,
    deliveryDate: order.deliveryDate,
    deliveryTime: order.deliveryTime,
    createdAt: order.createdAt,
    paidAt: order.paidAt,
    // Additional data for the dialog
    orderItems: order.items.map((item) => ({
      id: item.id,
      productName: item.product.name,
      quantity: item.quantity,
      price: item.price,
      weight: item.weight,
    })),
    address: {
      address1: order.address.address1,
      address2: order.address.address2,
      city: order.address.city,
      postcode: order.address.postcode,
    },
  }));

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Orders</h2>
        <p className="text-muted-foreground">
          Manage customer orders and track their status
        </p>
      </div>

      <DataTable
        columns={columns}
        data={formattedOrders as any}
        searchKey="email"
        filters={[
          {
            columnId: "status",
            title: "Status",
            options: [
              { label: "Pending", value: "PENDING" },
              { label: "Paid", value: "PAID" },
              { label: "Processing", value: "PROCESSING" },
              { label: "Delivered", value: "DELIVERED" },
              { label: "Cancelled", value: "CANCELLED" },
            ],
          },
        ]}
      />
    </div>
  );
}
