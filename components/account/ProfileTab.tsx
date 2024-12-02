"use client";

import { User } from "next-auth";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { ProfileForm } from "./profile-form";

interface ProfileTabProps {
  user: User;
}

export function ProfileTab({ user }: ProfileTabProps) {
  return (
    <Card>
      <CardContent className="space-y-6 pt-6">
         <ProfileForm user={user} />
      </CardContent>
    </Card>
  );
}

