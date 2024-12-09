import { prisma } from "@/lib/prisma";
import { DataTable } from "@/components/ui/data-table";
import { columns } from "./columns";
import { Heading } from "@/components/ui/heading";

export default async function CustomersPage() {
  const customers = await prisma.user.findMany({
    orderBy: {
      createdAt: "desc",
    },
    where: {
      role: {
        not: "ADMIN",
      },
    },
  });

  const formattedCustomers = customers.map((customer) => ({
    id: customer.id,
    name: customer.firstName + " " + customer.lastName || "Anonymous",
    email: customer.email,
    phone: customer.phone || "N/A",
    role: customer.role,
    createdAt: customer.createdAt,
    updatedAt: customer.updatedAt,
  }));

  return (
    <div className="space-y-6">
      <Heading
        title="Customers"
        description="Manage your customer base and their information"
      />

      <DataTable
        columns={columns}
        data={formattedCustomers}
        searchKey="email"
      />
    </div>
  );
}
