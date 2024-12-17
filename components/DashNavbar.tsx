"use client";

import { useState } from "react";
import { User, CakeIcon, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import Loader from "./ui/loader";

export function DashNavbar() {
  const [loggingOut, setLoggingOut] = useState(false);

  const { data: session } = useSession();

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
            <div className="pb-3">
              <p className="text-sm font-medium">{session.user.name}</p>
              <p className="text-xs text-gray-500">{session.user.email}</p>
            </div>
            <div className="border-t border-gray-200 pt-3">
              <Button
                variant="ghost"
                className="w-full justify-start space-x-2 px-2 text-sm text-red-600 hover:bg-red-50 hover:text-red-700"
                onClick={handleSignOut}
              >
                {loggingOut ? (
                  <Loader className="mr-2 border-t-red-700" />
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
              <span className="text-xl font-bold max-[330px]:hidden">
                TropikalFoods
              </span>
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            {/* Account */}
            <UserAccountNav />
          </div>
        </div>
      </nav>
    </header>
  );
}
