"use server";

import { ResetSchema } from "@/components/pages/auth/ResetForm";
import * as z from "zod";
import prisma from "./prisma";
import { generatePasswordResettoken } from "./token";
import { sendPasswordResetEmail } from "./mail";

export const resetForm = async (values: z.infer<typeof ResetSchema>) => {
  const { email } = values;

  if (!email) {
    return { error: "Invalid email" };
  }

  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (!existingUser) {
    return { error: "Email not found!" };
  }

  const passwordResetToken = await generatePasswordResettoken(email);
  await sendPasswordResetEmail(
    passwordResetToken.email,
    passwordResetToken.token
  );
  return { success: "Reset email sent!" };
};
