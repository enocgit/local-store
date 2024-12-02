import { Address } from "@prisma/client";
import "next-auth";

declare module "next-auth" {
  interface User {
    id: string;
    email: string;
    firstName: string | null;
    lastName: string | null;
    phone: string | null;
    image?: string | null;
    role: string;
    addresses?: Address[];
  }

  interface Session {
    user: User;
  }
}
