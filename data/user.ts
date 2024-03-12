import { auth } from "@/auth";
import prisma from "@/lib/backend/prisma";

export const getUserByEmail = async (email: string) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    return user;
  } catch {
    return null;
  }
};

export const getUserById = async (id: number) => {
  const session = await auth();
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: session?.user.id,
      },
    });

    return user;
  } catch {
    return null;
  }
};
