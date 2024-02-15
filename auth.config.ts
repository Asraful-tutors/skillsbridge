import { NextAuthConfig } from "next-auth";
import GitHubProvider from 'next-auth/providers/github';
import CredentialsProvider from 'next-auth/providers/credentials';
import { validateCredentials } from "./lib/backend/user";

export default {
	providers: [
		CredentialsProvider,
		GitHubProvider,
	],
	secret: process.env.SECRET,
	callbacks: {
		session: async ({ session, token }) => {
			if (session?.user) {
				//@ts-expect-error
				session.user.id = typeof token.sub === "string" ? Number(token.sub) : token.sub;
			}
			return session;
		},
		jwt: async ({ user, token }) => {
			if (user) {
				token.uid = user.id;
			}
			return token;
		},
	}
} satisfies NextAuthConfig;

