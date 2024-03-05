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
        data: { emailVerified: new Data() },
      });
    },
  },
  callbacks: {
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
