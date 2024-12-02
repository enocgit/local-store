import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { PrismaClient } from "@prisma/client";
import { Adapter, AdapterUser } from "next-auth/adapters";

export function CustomPrismaAdapter(prisma: PrismaClient): Adapter {
  const adapter = PrismaAdapter(prisma);

  return {
    ...adapter,
    createUser: async (data) => {
      const { id, emailVerified, ...rest } = data;
      const user = await prisma.user.create({
        data: {
          ...rest,
          emailVerified: !!emailVerified, // Convert to boolean
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
  };
}
