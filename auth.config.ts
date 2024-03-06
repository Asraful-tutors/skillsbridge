// @ts-nocheck

import { NextAuthConfig } from "next-auth";
import GitHubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { validateCredentials } from "./lib/backend/user";
import prisma from "./lib/backend/prisma";

export default {
  providers: [CredentialsProvider, GitHubProvider, GoogleProvider],
  secret: process.env.SECRET,
  events: {
    async linkAccount({ user }) {
      await prisma.user.update({
        where: { id: user.id },
        data: { emailVerified: new Date() },
      });
    },
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      // Allow OAuth without email verification
      console.log(account?.provider);
      if (account?.provider !== "credentials") return true;

      const existingUser = await prisma.user.findFirst({
        where: {
          email: user.email,
        },
      });

      if (existingUser) {
        // Check if the user already has a Google account linked
        const googleAccount = await prisma.account.findFirst({
          where: {
            userId: existingUser.id,
            provider: "google",
            providerAccountId: account.id,
          },
        });

        if (!googleAccount) {
          // Create a new Account record for the user
          await prisma.account.create({
            data: {
              userId: existingUser.id,
              type: "oauth",
              provider: "google",
              providerAccountId: account?.id || "",
            },
          });
        }
      }

      return true;
    },
    session: async ({ session, token }) => {
      if (session?.user) {
        //@ts-expect-error
        session.user.id =
          typeof token.sub === "string" ? Number(token.sub) : token.sub;
      }
      return session;
    },
    jwt: async ({ user, token }) => {
      if (user) {
        token.uid = user.id;
      }
      return token;
    },
  },
} satisfies NextAuthConfig;
