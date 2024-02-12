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
} satisfies NextAuthConfig;

