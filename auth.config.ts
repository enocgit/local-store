// import bcrypt from "bcryptjs";
// import NextAuthConfig from "next-auth";
// import NextAuth from "next-auth";
// import Credentials from "next-auth/providers/credentials";
// import Google from "next-auth/providers/google";
// import { LoginSchema } from "@/lib/auth/schemas";
// import { getUserByEmail } from "@/lib/auth/data";
// import { JWT } from "next-auth/jwt";
// import { DefaultSession, Session, User } from "next-auth";
// import { UserRole } from "@prisma/client";

// declare module "next-auth" {
//   interface Session {
//     user: {
//       id?: string;
//       role?: UserRole;
//     } & DefaultSession["user"];
//   }

//   interface User {
//     role?: UserRole;
//   }
// }

// export default NextAuth({
//   pages: {
//     signIn: "/auth",
//     error: "/auth/error",
//   },
//   providers: [
//     Google({
//       clientId: process.env.AUTH_GOOGLE_ID as string,
//       clientSecret: process.env.AUTH_GOOGLE_SECRET as string,
//     }),
//     Credentials({
//       credentials: {
//         email: { label: "Email", type: "email" },
//         password: { label: "Password", type: "password" },
//       },
//       async authorize(credentials) {
//         const validatedFields = LoginSchema.safeParse(credentials);

//         if (validatedFields.success) {
//           const { email, password } = validatedFields.data;
//           const user = await getUserByEmail(email);
//           if (!user || !user.password) return null;

//           const passwordsMatch = await bcrypt.compare(password, user.password);
//           if (passwordsMatch) return user;
//         }
//         return null;
//       },
//     }),
//   ],
//   callbacks: {
//     async jwt({ token, user }: { token: JWT; user?: User }) {
//       if (user) {
//         token.role = user.role;
//       }
//       return token;
//     },
//     async session({
//       session,
//       token,
//     }: {
//       session: Session;
//       token: JWT & { role?: UserRole };
//     }) {
//       if (session.user) {
//         session.user.role = token.role;
//       }
//       return session;
//     },
//   },
//   secret: process.env.AUTH_SECRET,
// }) satisfies typeof NextAuthConfig;
