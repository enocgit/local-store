"use client";

import Image from "next/image";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { getCallbackUrl } from "@/lib/auth/utils";
import { usePathname } from "next/navigation";
import { useState } from "react";
import Loader from "../ui/loader";

interface SocialAuthProps {
  isLoading?: boolean;
  userRole?: string | null;
}

export function SocialAuth({ isLoading, userRole }: SocialAuthProps) {
  const pathname = usePathname();
  const [loadingProvider, setLoadingProvider] = useState<
    "google" | "facebook" | null
  >(null);

  const handleSignIn = async (provider: "google" | "facebook") => {
    setLoadingProvider(provider);
    const redirectTo = getCallbackUrl(pathname, userRole);
    await signIn(provider, { redirectTo });
    setLoadingProvider(null);
  };

  return (
    <div className="space-y-4">
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-200" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="bg-white px-2 text-gray-500">Or continue with</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Button
          variant="outline"
          onClick={() => handleSignIn("google")}
          disabled={isLoading || loadingProvider === "google"}
        >
          {loadingProvider === "google" ? (
            <Loader className="mr-2 border-t-black" />
          ) : (
            <Image
              src="https://www.google.com/favicon.ico"
              alt="Google"
              width={16}
              height={16}
              className="mr-2"
            />
          )}
          Google
        </Button>

        <Button
          variant="outline"
          onClick={() => handleSignIn("facebook")}
          disabled={isLoading || loadingProvider === "facebook"}
        >
          {loadingProvider === "facebook" ? (
            <Loader className="mr-2 border-t-black" />
          ) : (
            <Image
              src="https://www.facebook.com/favicon.ico"
              alt="Facebook"
              width={16}
              height={16}
              className="mr-2"
            />
          )}
          Facebook
        </Button>
      </div>
    </div>
  );
}
