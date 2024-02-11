import type { NextAuthConfig } from "next-auth";
import GitHub from "next-auth/providers/github";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

import { SignUpSchema } from "./schemas";
import { getUserByEmail } from "./data/user";

export default {
  providers: [
    Credentials({
      async authorize(credentials) {
        // const validatedFields = SignUpSchema.safeParse(credentials);

        // if (validatedFields.success) {
        const { email, password } = credentials;

        const user = await getUserByEmail(email as string);
        if (!user || !user.password) return null;

        //   const passwordMatch = await bcrypt.compare(password, user.password);
        //   console.log("auth");
        //   if (passwordMatch) {
        // Convert the id to a string if necessary
        return { ...user, id: String(user.id) };
        //   }
        // }

        // return null;
      },
    }),
  ],
} satisfies NextAuthConfig;
