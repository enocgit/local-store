import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { PrismaClient } from "@prisma/client";
import { Adapter, AdapterUser } from "next-auth/adapters";

export function CustomPrismaAdapter(prisma: PrismaClient): Adapter {
  const adapter = PrismaAdapter(prisma);

  return {
    ...adapter,
    createUser: async (data) => {
      // Extract only the fields we want from the OAuth data
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
  };
}
