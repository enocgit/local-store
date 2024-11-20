"use client";

import { useState } from "react";
import {
  Search,
  User,
  Menu,
  Heart,
  CakeIcon,
  LogOut,
  Settings,
  CreditCard,
  Package,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useCart } from "@/lib/store/cart-context";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { useSession, signOut } from "next-auth/react";
import { CartIcon } from "./ui/cart-icon";

const NEW_ARRIVALS_SLUG = "new-arrivals";

interface Category {
  id: string;
  name: string;
  description: string;
}

async function getCats(): Promise<Category[]> {
  const res = await fetch("/api/categories");
  if (!res.ok) {
    throw new Error("Failed to fetch categories");
  }
  const data = await res.json();
  return data;
}

export function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { state } = useCart();
  const [loggingOut, setLoggingOut] = useState(false);

  const { data: categories = [], isLoading } = useQuery<Category[]>({
    queryKey: ["categories"],
    queryFn: getCats,
  });

  const { data: session } = useSession();

  const navigation = [
    { name: "New Arrivals", href: `/category/${NEW_ARRIVALS_SLUG}` },
    ...categories.slice(0, 4).map((category: Category) => ({
      name: category.name,
      href: `/category/${category.id}`,
    })),
  ];

  const userMenuItems = [
    {
      label: "My Account",
      icon: User,
      href: "/account",
    },
    {
      label: "My Orders",
      icon: Package,
      href: "/account/orders",
    },
    {
      label: "Wishlist",
      icon: Heart,
      href: "/account/wishlist",
    },
    {
      label: "Billing",
      icon: CreditCard,
      href: "/account/billing",
    },
  ];

  const handleSignOut = async () => {
    setLoggingOut(true);
    await signOut();
    setLoggingOut(false);
  };

  const UserAccountNav = () => {
    if (!session?.user) {
      return (
        <Link href="/auth">
          <Button
            variant="ghost"
            size="icon"
            className="hidden hover:bg-gray-100 sm:flex"
          >
            <User className="h-5 w-5" />
          </Button>
        </Link>
      );
    }

    return (
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="relative h-8 w-8 rounded-full"
          >
            <Avatar className="h-8 w-8">
              <AvatarImage
                src={session.user.image ?? undefined}
                alt={session.user.name ?? "User avatar"}
              />
              <AvatarFallback>
                {session.user.name
                  ?.split(" ")
                  .map((n) => n[0])
                  .join("")
                  .toUpperCase() ?? "U"}
              </AvatarFallback>
            </Avatar>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-56" align="end">
          <div className="space-y-4">
            <div className="border-b border-gray-200 pb-3">
              <p className="text-sm font-medium">{session.user.name}</p>
              <p className="text-xs text-gray-500">{session.user.email}</p>
            </div>
            <div className="space-y-1">
              {userMenuItems.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="flex items-center space-x-2 rounded-md p-2 text-sm hover:bg-gray-100"
                >
                  <item.icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </Link>
              ))}
            </div>
            <div className="border-t border-gray-200 pt-3">
              <Button
                variant="ghost"
                className="w-full justify-start space-x-2 px-2 text-sm text-red-600 hover:bg-red-50 hover:text-red-700"
                onClick={handleSignOut}
              >
                {loggingOut ? (
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-red-700" />
                ) : (
                  <LogOut className="h-4 w-4" />
                )}
                <span>Log out</span>
              </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    );
  };

  return (
    <header className="sticky top-0 z-50 border-b bg-white">
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8" aria-label="Top">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <CakeIcon className="h-8 w-8" />
              <span className="text-xl font-bold max-[330px]:hidden">
                TropikalFoods
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex lg:items-center lg:space-x-6">
            {isLoading ? (
              <>
                {Array.from({ length: 5 }).map((_, index) => (
                  <Skeleton key={index} className="h-3 w-10 rounded-md" />
                ))}
              </>
            ) : (
              navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-sm font-medium text-gray-700 transition-colors hover:text-gray-900"
                >
                  {item.name}
                </Link>
              ))
            )}
          </div>

          {/* Search, Cart, Account */}
          <div className="flex items-center space-x-4">
            {/* Search */}
            <Sheet open={isSearchOpen} onOpenChange={setIsSearchOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="hover:bg-gray-100"
                >
                  <Search className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="top" className="w-full">
                <div className="mx-auto mt-8 max-w-2xl">
                  <div className="flex items-center space-x-2">
                    <Input
                      type="search"
                      placeholder="Search products..."
                      className="flex-1"
                    />
                    <Button onClick={() => setIsSearchOpen(false)}>
                      Search
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>

            {/* Wishlist */}
            <Link href="/wishlist" className="max-sm:hidden">
              <Button variant="ghost" size="icon" className="hover:bg-gray-100">
                <Heart className="h-5 w-5" />
              </Button>
            </Link>

            {/* Cart */}
            <CartIcon
              count={state.items.length}
              className="max-[420px]:hidden"
            />

            {/* Account */}
            <UserAccountNav />

            {/* Mobile menu button */}
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="hover:bg-gray-100 lg:hidden"
                >
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right">
                <div className="mt-6 flow-root">
                  <div className="-my-6 divide-y divide-gray-200">
                    <div className="space-y-2 py-6">
                      {isLoading ? (
                        <>
                          {Array.from({ length: 5 }).map((_, index) => (
                            <Skeleton
                              key={index}
                              className="-mx-3 mb-6 block h-3 w-full rounded-md"
                            />
                          ))}
                        </>
                      ) : (
                        navigation.map((item) => (
                          <Link
                            key={item.name}
                            href={item.href}
                            className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                            onClick={() => setIsMobileMenuOpen(false)}
                          >
                            {item.name}
                          </Link>
                        ))
                      )}
                    </div>
                    <div className="py-6 sm:hidden">
                      <Link
                        href="/wishlist"
                        className="-mx-3 flex items-center gap-2 rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50 sm:hidden"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <Heart className="h-5 w-5" />
                        Wishlist
                      </Link>
                      <Link
                        href="/cart"
                        className="-mx-3 flex items-center gap-2 rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50 min-[420px]:hidden"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <CartIcon count={state.items.length} isLink={false} />
                        Cart
                      </Link>
                    </div>
                    <div className="py-6">
                      <Link
                        href="/auth"
                        className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        Log in
                      </Link>
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </nav>
    </header>
  );
}
