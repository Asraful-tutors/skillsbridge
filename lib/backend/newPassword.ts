"use server";

import { NewPasswordSchema } from "@/components/pages/auth/NewPassword";
import * as z from "zod";
import { getPasswordResetToken } from "../data/password-reset-token";
import { getUserByEmail } from "@/data/user";
import bcrypt from "bcryptjs";
import prisma from "./prisma";

export const newPassword = async (
  values: z.infer<typeof NewPasswordSchema>,
  token?: string | null
) => {
  if (!token) {
    return { error: "Missing token!" };
  }

  if (!values) {
    return { error: "Password missing" };
  }

  const { password } = values;

  const existingToken = await getPasswordResetToken(token);

  if (!existingToken) {
    return { error: "Invalid token!" };
  }

  const hasExpired = new Date(existingToken.expires) < new Date();

  if (hasExpired) {
    return { error: "Token has expired" };
  }

  const existingUser = await getUserByEmail(existingToken.email);

  if (!existingUser) {
    return { error: "Email does not exists" };
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  await prisma.user.update({
    where: { id: existingUser.id },
    data: { password: hashedPassword },
  });

  await prisma.passwordResetToken.delete({
    where: { id: existingToken.id },
  });

  return { success: "Password updated!" };
};
