import { AuthForm } from "@/components/auth/AuthForm";
import { auth } from "@/auth";
import { SessionProvider } from "next-auth/react";

export default async function AuthPage() {
  const session = await auth();

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <SessionProvider
        baseUrl={process.env.NEXTAUTH_BASE_PATH}
        session={session}
      >
        <AuthForm />
      </SessionProvider>
    </div>
  );
}
