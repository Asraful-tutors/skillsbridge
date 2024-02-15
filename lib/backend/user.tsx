"use server"
import { compare, hash } from "bcryptjs";
import { BackendError, PublicError, zodThrow } from "./errors";
import prisma from "./prisma";
import { SignUpSchema } from "@/schemas";
import { signIn, signOut } from "../../auth";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";



/**
 * Validates the credentials
 * @param credentials 
 */
export async function validateCredentials(credentials: { email: string, password: string }) {
	if (!credentials) throw new PublicError(400, "Missing credentials");
	const { email, password } = credentials;

	if (!email) throw new PublicError(400, "Email required");
	if (!password) throw new PublicError(400, "Password required");

	const user = await prisma.user.findFirst({
		where: {
			email: credentials.email,
		},
	})

	if (!user) throw new PublicError(404, "User with email not found");
	if (!user.email) throw new BackendError(403, "User has no email"); // This indeed shouldn't happen
	if (!user.password) throw new BackendError(403, "Cannot login with a password");

	const passwordCorrect = await compare(credentials.password || '', user.password)

	if (!passwordCorrect) throw new PublicError(401, "Incorrect password");

	return {
		createdAt: user.createdAt,
		email: user.email,
		emailVerified: user.emailVerified,
		id: user.id,
		image: user.image,
		name: user.name,
		updatedAt: user.updatedAt,
	};
}

type RegisterOptions = {
	email: string,
	password: string,
	firstName?: string,
	lastName?: string,
}

/**
 * Registers a new user and logins
 * @param options 
 * @returns user
 */
export async function register(options: RegisterOptions) {
	if (!options) throw new PublicError(400, "Missing credentials");

	const data = zodThrow(SignUpSchema, options)

	const { email, password, firstName, lastName } = data;

	const existingUser = await prisma.user.findFirst({
		where: {
			email,
		}
	})

	if (existingUser) throw new PublicError(403, "Email already used")

	const hashed = await hash(password, 12)

	// Send email with code for email confirmation

	let name = `${firstName ?? ""} ${lastName ?? ""}`.trim() || null

	const user = await prisma.user.create({
		data: {
			email,
			name: name,
			password: hashed,
			profile: {
				create: {
					firstName,
					lastName,
				}
			}
		}
	})
	await signIn("credentials", {
		email,
		password,
		redirectTo: DEFAULT_LOGIN_REDIRECT
	})
}

export async function logOut() {
	await signOut();
}
