import prisma from "../backend/prisma";

export const getPasswordResetToken = async (token: string) => {
  try {
    const passowrdResetToken = await prisma.passwordResetToken.findUnique({
      where: { token },
    });

    return passowrdResetToken;
  } catch {
    return null;
  }
};

export const getPasswordTokenByEmail = async (email: string) => {
  try {
    const passowrdResetToken = await prisma.passwordResetToken.findFirst({
      where: { email },
    });

    return passowrdResetToken;
  } catch {
    return null;
  }
};
