import { prisma } from "@/lib/prisma";
import { DataTable } from "@/components/ui/data-table";
import { columns } from "./columns";

export default async function CustomersPage() {
  const customers = await prisma.user.findMany({
    orderBy: {
      createdAt: 'desc',
    },
    where: {
      role: {
        not: 'ADMIN'
      }
    }
  });

  const formattedCustomers = customers.map(customer => ({
    id: customer.id,
    name: customer.firstName + ' ' + customer.lastName || 'Anonymous',
    email: customer.email,
    phone: customer.phone || 'N/A',
    role: customer.role,
    createdAt: customer.createdAt,
    updatedAt: customer.updatedAt
  }));

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Customers</h2>
        <p className="text-muted-foreground">
          Manage your customer base and their information
        </p>
      </div>

      <DataTable 
        columns={columns} 
        data={formattedCustomers}
        searchKey="email"
      />
    </div>
  );
}
