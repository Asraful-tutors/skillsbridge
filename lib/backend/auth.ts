import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { PrismaClient } from "@prisma/client";
import prisma from "../prisma";
import { NextAuthOptions, Session, getServerSession as _getServerSession } from "next-auth";
import GitHubProvider from 'next-auth/providers/github';
import CredentialsProvider from 'next-auth/providers/credentials';
import EmailProvider from 'next-auth/providers/email';
import { User } from "./user";

export const authOptions: NextAuthOptions = {
	providers: [
		CredentialsProvider({
			credentials: {
				email: { label: "Email", type: "text", placeholder: "jsmith@example.com" },
				password: { label: "Password", type: "password" }
			},
			async authorize(credentials, req) {
				if (!credentials) return null;
				try {
					const prisma = new PrismaClient();
					const user = await User.authorize(prisma, credentials)
					return {
						id: user.id.toString(),
						name: user.name,
						email: user.email,
					}
				} catch (e) {
					console.log(e);
					return null;
				}

			}
		}),
		GitHubProvider({
			clientId: process.env.GITHUB_ID!,
			clientSecret: process.env.GITHUB_SECRET!,
		}),
		EmailProvider({
			server: {
				host: process.env.SMTP_HOST,
				port: Number(process.env.SMTP_PORT),
				auth: {
					user: process.env.SMTP_USER,
					pass: process.env.SMTP_PASSWORD,
				},
			},
			from: process.env.SMTP_FROM,
		}),
	],
	callbacks: {
		session({ newSession, session, trigger, user }) {
			if (session.user) {
				// @ts-expect-error
				session.user.id = user.id;
			}
			return session;
		},
	},
	adapter: PrismaAdapter(prisma),
	secret: process.env.SECRET,
}

export async function getServerSession() {
	return (await _getServerSession(authOptions)) as (Session & { user: { id: number } }) | null;
}

