import { prisma } from '@/lib/prisma';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Users,
  Package,
  ShoppingCart,
  PoundSterlingIcon
} from 'lucide-react';

export default async function DashboardPage() {
  // Fetch overview statistics
  const [userCount, productCount, orderCount, totalRevenue] = await Promise.all([
    prisma.user.count(),
    prisma.product.count(),
    prisma.order.count(),
    prisma.order.aggregate({
      _sum: {
        total: true
      },
      where: {
        status: 'PAID'
      }
    })
  ]);

  const stats = [
    {
      name: 'Total Customers',
      value: userCount,
      icon: Users,
      description: 'Active customers in the platform',
    },
    {
      name: 'Total Products',
      value: productCount,
      icon: Package,
      description: 'Products available in store',
    },
    {
      name: 'Total Orders',
      value: orderCount,
      icon: ShoppingCart,
      description: 'Orders processed',
    },
    {
      name: 'Total Revenue',
      value: totalRevenue._sum.total ? 
        new Intl.NumberFormat('en-GB', {
          style: 'currency',
          currency: 'GBP'
        }).format(totalRevenue._sum.total) : '£0',
      icon: PoundSterlingIcon,
      description: 'Revenue from completed orders',
    },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold tracking-tight">Dashboard Overview</h2>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.name}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.name}
                </CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
