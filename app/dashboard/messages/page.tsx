import { prisma } from "@/lib/prisma";
import { DataTable } from "@/components/ui/data-table";
import { columns } from "./columns";

export default async function MessagesPage() {
  const messages = await prisma.contact.findMany({
    orderBy: {
      createdAt: 'desc'
    }
  });

  const formattedMessages = messages.map(message => ({
    id: message.id,
    name: message.name,
    email: message.email,
    subject: message.subject || 'No Subject',
    message: message.message,
    createdAt: message.createdAt,
    status: message.status || 'UNREAD'
  }));

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Messages</h2>
        <p className="text-muted-foreground">
          Manage customer messages and inquiries
        </p>
      </div>

      <DataTable 
        columns={columns} 
        data={formattedMessages}
        searchKey="email"
      />
    </div>
  );
}
