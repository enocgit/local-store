import bcrypt from "bcryptjs";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import Facebook from "next-auth/providers/facebook";
import { LoginSchema } from "@/lib/auth/schemas";
import { getUserByEmail } from "@/lib/auth/data";

export const authOptions = {
  providers: [
    // Google({
    //   clientId: process.env.GOOGLE_CLIENT_ID,
    //   clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    // }),
    // Facebook({
    //   clientId: process.env.FACEBOOK_CLIENT_ID,
    //   clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
    // }),
    // Credentials({
    //   credentials: [
    //     {
    //       label: 'Email',
    //       type: 'text',
    //     },
    //     {
    //       label: 'Password',
    //       type: 'password',
    //     },
    //   ],
    //   async authorize(credentials) {
    //     const validatedFields = LoginSchema.safeParse(credentials);
    //     if (validatedFields.success) {
    //       const { email, password } = validatedFields.data;
    //       const user = await getUserByEmail(email);
    //       if (!user || !user.password) return null;
    //       const passwordsMatch = await bcrypt.compare(password, user.password);
    //       if (passwordsMatch) return user;
    //     }
    //     return null;
    //   },
    // }),
  ],
};

export default NextAuth(authOptions);
