import NextAuth from "next-auth";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import { getUserById } from "@/lib/auth/data";
import { UserRole } from "@prisma/client";
import Google from "next-auth/providers/google";
import Facebook from "next-auth/providers/facebook";
import Credentials from "next-auth/providers/credentials";
import { verifyPassword } from "@/lib/auth/auth";
import { LoginSchema } from "@/lib/auth/schemas";
import { sendWelcomeEmail } from "@/utils/email";

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  events: {
    async createUser({ user }) {
      // Send welcome email when a new user is created (both OAuth and credentials)
      if (user.email) {
        try {
          await sendWelcomeEmail(
            user.email,
            user.firstName || user.name?.split(' ')[0] || 'Valued Customer'
          );
        } catch (error) {
          console.error('Failed to send welcome email:', error);
        }
      }
    },
  },
  providers: [
    Credentials({
      async authorize(credentials) {
        const validatedFields = LoginSchema.safeParse(credentials);

        if (!validatedFields.success) {
          return null;
        }

        const { email, password } = validatedFields.data;

        const user = await prisma.user.findUnique({ 
          where: { email } 
        });

        if (!user || !user.password) {
          return null;
        }

        const isValid = await verifyPassword(password, user.password);

        if (!isValid) {
          return null;
        }

        return {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
          phone: user.phone || null,
        };
      },
    }),
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      profile(profile) {
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
          phone: null,
          role: "USER" as UserRole,
        };
      },
    }),
    Facebook({
      clientId: process.env.FACEBOOK_CLIENT_ID,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
      profile(profile) {
        return {
          id: profile.id,
          email: profile.email,
          firstName: profile.first_name,
          lastName: profile.last_name,
          role: "USER" as UserRole,
          phone: null,
        };
      },
    }),
  ],
  callbacks: {
    async session({ token, session }) {
      if (token.sub && session.user) {
        const user = await getUserById(token.sub);
        if (user) {
          session.user.id = user.id;
          session.user.firstName = user.firstName;
          session.user.lastName = user.lastName;
          session.user.phone = user.phone;
          session.user.role = user.role;
          session.user.addresses = user.addresses;
        }
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
