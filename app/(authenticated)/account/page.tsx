import { auth } from "@/auth";
import { ProfileForm } from "@/components/account/profile-form";
import { redirect } from "next/navigation";

export default async function AccountPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/auth");
  }

  return (
    <div className="container max-w-2xl px-5 py-8">
      {/* Profile Section */}
      <section className="mb-8">
        <h2 className="mb-4 text-2xl font-bold">Profile Information</h2>
        <ProfileForm user={session.user} />
      </section>
    </div>
  );
}
