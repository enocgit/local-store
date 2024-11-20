import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
// import authConfig from "@/auth.config";
import { getUserById } from "@/lib/auth/data";
import { UserRole } from "@prisma/client";
import { DefaultSession } from "next-auth";
import Google from "next-auth/providers/google";

declare module "next-auth" {
  interface Session {
    user: {
      id?: string;
      role?: UserRole;
    } & DefaultSession["user"];
  }
}

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  providers: [
    Google({
      profile(profile) {
        // Split the name into firstName and lastName
        const nameParts = profile.name?.split(" ") || ["", ""];
        const firstName = nameParts[0];
        const lastName = nameParts.slice(1).join(" ");

        return {
          id: profile.sub,
          email: profile.email,
          emailVerified: profile.email_verified,
          firstName,
          lastName,
          image: profile.picture,
        };
      },
    }),
  ],
  callbacks: {
    async session({ token, session }) {
      if (token.sub && session.user) {
        session.user.id = token.sub;
      }

      if (token.role && session.user) {
        session.user.role = token.role as UserRole;
      }

      return session;
    },
    async jwt({ token }) {
      if (!token.sub) return token;

      const existingUser = await getUserById(token.sub);

      if (!existingUser) return token;

      token.role = existingUser.role;

      return token;
    },
  },
});
