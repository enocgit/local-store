"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ShoppingBag,
  Users,
  LayoutGrid,
  Package,
  MessageSquare,
  Star,
  Home,
  FileText,
  CreditCard,
} from "lucide-react";

const navigation = [
  { name: "Overview", href: "/bridge", icon: Home },
  { name: "Products", href: "/bridge/products", icon: Package },
  { name: "Categories", href: "/bridge/categories", icon: LayoutGrid },
  { name: "Orders", href: "/bridge/orders", icon: ShoppingBag },
  { name: "Customers", href: "/bridge/customers", icon: Users },
  { name: "Reviews", href: "/bridge/reviews", icon: Star },
  { name: "Messages", href: "/bridge/messages", icon: MessageSquare },
  { name: "Subscriptions", href: "/bridge/subscriptions", icon: CreditCard },
  { name: "CMS", href: "/bridge/cms", icon: FileText },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="flex h-full w-64 flex-col border-r bg-white">
      <div className="flex h-16 items-center border-b px-6">
        <h1 className="text-xl font-semibold">Dashboard</h1>
      </div>
      <nav className="flex-1 space-y-1 px-2 py-4">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`group flex items-center rounded-md px-2 py-2 text-sm font-medium ${
                isActive
                  ? "bg-gray-100 text-gray-900"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              } `}
            >
              <Icon
                className={`mr-3 h-5 w-5 ${
                  isActive
                    ? "text-gray-500"
                    : "text-gray-400 group-hover:text-gray-500"
                } `}
                aria-hidden="true"
              />
              {item.name}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
