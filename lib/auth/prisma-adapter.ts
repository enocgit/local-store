import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { PrismaClient } from "@prisma/client";
import { Adapter, AdapterUser } from "next-auth/adapters";

export function CustomPrismaAdapter(prisma: PrismaClient): Adapter {
  const adapter = PrismaAdapter(prisma);

  return {
    ...adapter,
    createUser: async (data) => {
      // First check if user exists
      const existingUser = await prisma.user.findUnique({
        where: { email: data.email },
      });

      if (existingUser) {
        return {
          ...existingUser,
          id: existingUser.id.toString(),
          emailVerified: existingUser.emailVerified,
        } as AdapterUser;
      }

      // If no existing user, create new one
      const { email, firstName, lastName, image, emailVerified, phone } = data;
      const user = await prisma.user.create({
        data: {
          email,
          firstName,
          lastName,
          image,
          phone,
          emailVerified: !!emailVerified,
          role: "USER",
          addresses: {
            create: [],
          },
        },
      });

      return {
        ...user,
        id: user.id.toString(),
        emailVerified: user.emailVerified,
      } as AdapterUser;
    },
    linkAccount: async (data) => {
      // First check if account exists
      const existingAccount = await prisma.account.findFirst({
        where: {
          userId: data.userId,
          provider: data.provider,
        },
      });

      if (existingAccount) {
        await prisma.account.update({
          where: { id: existingAccount.id },
          data: {
            access_token: data.access_token,
            expires_at: data.expires_at,
            id_token: data.id_token,
            scope: data.scope,
            token_type: data.token_type,
          },
        });
        return;
      }

      await prisma.account.create({ data });
      return;
    },
  };
}
