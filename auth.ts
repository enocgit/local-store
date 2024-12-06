import NextAuth from "next-auth";
import { prisma } from "@/lib/prisma";
import { getUserById } from "@/lib/auth/data";
import { UserRole } from "@prisma/client";
import Google from "next-auth/providers/google";
import Facebook from "next-auth/providers/facebook";
import Credentials from "next-auth/providers/credentials";
import { verifyPassword } from "@/lib/auth/auth";
import { LoginSchema } from "@/lib/auth/schemas";
import { sendWelcomeEmail } from "@/utils/email";
import { CustomPrismaAdapter } from "@/lib/auth/prisma-adapter";

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  adapter: CustomPrismaAdapter(prisma),
  session: { strategy: "jwt" },
  events: {
    async createUser({ user }) {
      try {
        // Send welcome email when a new user is created (both OAuth and credentials)
        if (user.email && typeof user.email === "string") {
          await sendWelcomeEmail(
            user.email,
            user.firstName || user.name?.split(" ")[0] || "Valued Customer",
          );

          // Ensure user is properly created in the database
          const dbUser = await prisma.user.findUnique({
            where: { email: user.email },
            include: { accounts: true },
          });

          if (!dbUser) {
            console.error(
              "User not found in database after creation:",
              user.email,
            );
          }
        }
      } catch (error) {
        console.error("Error in createUser event:", error);
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
          where: { email },
          select: {
            id: true,
            email: true,
            password: true,
            firstName: true,
            lastName: true,
            role: true,
            phone: true,
            image: true,
            emailVerified: true,
          },
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
          phone: user.phone,
          image: user.image,
          emailVerified: user.emailVerified,
        };
      },
    }),
    Google({
      profile(profile) {
        const nameParts = profile.name?.split(" ") || ["", ""];
        const firstName = nameParts[0];
        const lastName = nameParts.slice(1).join(" ");

        return {
          email: profile.email,
          firstName,
          lastName,
          image: profile.picture,
          emailVerified: profile.email_verified,
          role: "USER" as UserRole,
          phone: null,
        };
      },
      allowDangerousEmailAccountLinking: true,
    }),
    Facebook({
      clientId: process.env.FACEBOOK_CLIENT_ID,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
      profile(profile) {
        return {
          email: profile.email,
          firstName: profile.first_name,
          lastName: profile.last_name,
          image: profile.picture?.data?.url,
          emailVerified: true,
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
    async jwt({ token, user, trigger, session }) {
      if (trigger === "update" && session.user) {
        token.firstName = session.user.firstName;
        token.lastName = session.user.lastName;
        token.phone = session.user.phone;
        return token;
      }
      if (user) {
        token.id = user.id;
        token.firstName = user.firstName;
        token.lastName = user.lastName;
        token.role = user.role;
        token.phone = user.phone;
      }
      return token;
    },
  },
});
