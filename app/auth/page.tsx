import { AuthForm } from "@/components/auth/AuthForm";
import { SocialAuth } from "@/components/auth/SocialAuth";
import { auth } from "@/auth";

export default async function AuthPage() {
  const session = await auth();

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <AuthForm />
      <SocialAuth userRole={session?.user?.role} />
    </div>
  );
}
