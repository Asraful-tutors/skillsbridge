"use server";

import * as z from "zod";
import bcrypt from "bcryptjs";
import { SignUpSchema } from "@/schemas";
import prisma from "@/lib/prisma";
import { getUserByEmail } from "@/data/user";
import { signIn } from "@/auth";
import { AuthError } from "next-auth";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";

export const register = async (values: z.infer<typeof SignUpSchema>) => {
  const validatedFields = SignUpSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }

  const { email, password, firstName, lastName } = validatedFields.data;

  const hashedPassword = await bcrypt.hash(password, 10);

  const existingUser = await getUserByEmail(email);

  if (existingUser) {
    return { error: "Email already in use!" };
  }

  console.log("existingUser", existingUser);

  // Create a new user with hashed password
  const newUser = await prisma.user.create({
    data: {
      name: `${firstName} ${lastName}`,
      email,
      password,
    },
  });

  console.log("newUser", newUser);
  // Login the user after successful registration
  const loginResponse = await loginUser(email, password); // Pass only the email for login
  console.log("loginResponse", loginResponse);
  // Check if login was successful
  if (loginResponse.success) {
    return { success: "User registered and logged in successfully!" };
  } else {
    return { error: "Registration successful, but login failed." };
  }

  //   const verificationToken = await generateVerificationToken(email);
  //   await sendVerificationEmail(
  //     verificationToken.email,
  //     verificationToken.token,
  //   );
};

const loginUser = async (email: string, password: string) => {
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    return { error: "User not found!" };
  }

  try {
    const signInResponse = await signIn("credentials", {
      email,
      password,
      redirectTo: DEFAULT_LOGIN_REDIRECT,
    });

    // @ts-ignore
    if (signInResponse.user) {
      return { success: "User logged in successfully!" };
    } else {
      return { error: "Invalid credentials!" };
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
};
