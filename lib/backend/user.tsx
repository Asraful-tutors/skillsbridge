import { Prisma, PrismaClient } from "@prisma/client";
import { compare, hash } from "bcrypt";
import { BackendError, PublicError } from "./errors";

export namespace User {

	/**
	 * Authorizes the login attempt against an email and a password
	 * @param prisma PrismaClient to use
	 * @param credentials 
	 * @returns User
	 */
	export async function authorize(prisma: PrismaClient, credentials: { email: string, password: string }) {
		if (!credentials) throw new PublicError(400, "Invalid credentials");
		const { email, password } = credentials;

		if (!email) throw new PublicError(401, "Invalid email supplied");
		if (!password) throw new PublicError(401, "Invalid password supplied");

		const user = await prisma.user.findFirst({
			where: {
				email: credentials.email,
			}
		})

		if (!user) throw new PublicError(404, "User with email not found");
		if (!user.email) throw new BackendError(403, "User has no email"); // This indeed shouldnt happen
		if (!user.password) throw new BackendError(403, "Cannot login with password");

		const passwordCorrect = await compare(credentials?.password || '', user.password)

		if (!passwordCorrect) throw new PublicError(401, "Passwords did not match");

		return user;

	}

	/**
	 * Creates a user
	 * @param prisma PrismaClient to use
	 * @param credentials 
	 * @returns user
	 */
	export async function register(prisma: PrismaClient, credentials: { email: string, password: string }) {
		if (!credentials) throw new PublicError(400, "Invalid credentials");
		const { email, password } = credentials;

		if (!email) throw new PublicError(401, "Invalid email supplied");
		if (!password) throw new PublicError(401, "Invalid password supplied");

		const existingUser = await prisma.user.findFirst({
			where: {
				email,
			}
		})

		if (existingUser) throw new PublicError(403, "Email already used")

		const hashed = await hash(password, 12)

		// Send email with code for email confirmation

		const user = await prisma.user.create({
			data: {
				email,
				password: hashed,
			}
		})
		return user;

	}

}

export default User;
