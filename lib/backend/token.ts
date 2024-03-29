// @ts-ignore
import { v4 as uuidv4 } from "uuid";
import { getPasswordTokenByEmail } from "../data/password-reset-token";
import prisma from "./prisma";

export const generatePasswordResettoken = async (email: string) => {
  const token = uuidv4();

  const expires = new Date(new Date().getTime() + 3600 * 1000);

  const existingToken = await getPasswordTokenByEmail(email);

  if (existingToken) {
    await prisma.passwordResetToken.delete({
      where: { id: existingToken.id },
    });
  }

  const passwordResetToken = await prisma.passwordResetToken.create({
    data: {
      email,
      token,
      expires,
    },
  });

  return passwordResetToken;
};
