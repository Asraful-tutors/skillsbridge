import NextAuth, { DefaultSession } from "next-auth"

module "next-auth" {
	interface Session {
		// Cant define this as User or it will use default User type from next-auth!
		user: {
			id: number
			name?: string | null
			email?: string | null
			image?: string | null
		}
	}

	interface User {
		id: number
		name?: string | null
		email?: string | null
		image?: string | null
	}
}