//@ts-nocheck

"use server";
import { compare, hash } from "bcryptjs";
import { BackendError, PublicError, zodOrThrow } from "./errors";
import prisma from "./prisma";
import { SignUpSchema } from "@/schemas";
import { auth, signIn, signOut } from "../../auth";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";

/**
 * Validates user credentials
 * @param credentials
 */
export async function validateCredentials(credentials: {
  email: string;
  password: string;
}) {
  try {
    if (!credentials) throw new PublicError(400, "Missing credentials");
    const { email, password } = credentials;

    if (!email) throw new PublicError(400, "Email required");
    if (!password) throw new PublicError(400, "Password required");

    const user = await prisma.user.findFirst({
      where: {
        email: credentials.email,
      },
    });

    console.log("User from database:", user);

    if (!user) throw new PublicError(404, "User with email not found");
    if (!user.email) throw new BackendError(403, "User has no email");

    if (user.password) {
      // User has a password, validate it
      const passwordCorrect = await compare(password, user.password);

      if (!passwordCorrect) throw new PublicError(401, "Incorrect password");
    } else {
      // User doesn't have a password, handle the case to set one
      // This could involve sending a password reset email or redirecting to a "Set Password" page
      throw new PublicError(403, "User needs to set a password");
    }

    return {
      createdAt: user.createdAt,
      email: user.email,
      emailVerified: user.emailVerified,
      id: user.id,
      image: user.image,
      name: user.name,
      updatedAt: user.updatedAt,
    };
  } catch (error) {
    console.error("Error during login:", error);
    throw error;
  }
}

type RegisterOptions = {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
};

/**
 * Registers a new user and logins
 * @param options
 * @returns user
 */
export async function register(options: RegisterOptions) {
  if (!options) throw new PublicError(400, "Missing credentials");

  const data = zodOrThrow(SignUpSchema, options);

  const { email, password, firstName, lastName } = data;

  const existingUser = await prisma.user.findFirst({
    where: {
      email,
    },
  });

  // if (existingUser) throw new PublicError(403, "Email already used")
  if (existingUser) {
    const res = await signIn("credentials", {
      email,
      password,
      redirectTo: DEFAULT_LOGIN_REDIRECT,
    });

    return existingUser;
  }

  const hashed = await hash(password, 12);

  // Send email with code for email confirmation

  let name = `${firstName ?? ""} ${lastName ?? ""}`.trim() || null;

  const user = await prisma.user.create({
    data: {
      email,
      name: name,
      password: hashed,
      profile: {
        create: {
          firstName,
          lastName,
        },
      },
    },
  });

  const alwaysActivePaths = await prisma.path.findMany({
    where: {
      alwaysActive: true,
    },
  });

  if (alwaysActivePaths.length) {
    await prisma.userPath.createMany({
      data: alwaysActivePaths.map((v: any) => ({
        active: true,
        completion: 0,
        pathId: v.id,
        userId: user.id,
      })),
    });
  }

  const res = await signIn("credentials", {
    email,
    password,
    redirectTo: DEFAULT_LOGIN_REDIRECT,
  });

  return user;
}

export async function logOut() {
  await signOut();
}

// get current user

export const getCurrentUser = async () => {
  const session = auth();
  return session;
};

// get completed milestones

export const getCompletedMilestones = async (id: any) => {
  const session = auth();
  if (!session) {
    return null;
  }

  const milestones = await prisma.userProfile.findFirst({
    where: {
      userId: id,
    },
    include: {
      completed: true,
    },
  });

  return milestones;
};
