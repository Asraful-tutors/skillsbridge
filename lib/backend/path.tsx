"use server"
import prisma from "./prisma";
import { auth } from "../../auth";
import Errors, { BackendError, PublicError, zodOrThrow } from "./errors";
import { z } from "zod";
import { Prisma } from "@prisma/client";

type ActivatePathOptions = {
	mode?: "switch" | "multiple" | "fail",
}

/**
 * Activates a specific path for the user.
 * @param options 
 * @returns Created user path
 */
export async function activatePath(pathId: number, options?: ActivatePathOptions) {
	zodOrThrow(z.number().int().positive(), pathId)
	const { mode = "switch" } = options ?? {};
	const session = await auth()
	if (!session?.user.id) throw Errors.InvalidSession();

	const userId = session.user.id;

	const upsertArgs = {
		create: {
			userId,
			pathId,
			active: true,
			completion: 0,
		},
		update: {
			active: true,
		},
		where: {
			userId_pathId: {
				userId,
				pathId,
			}
		}
	} satisfies Prisma.UserPathUpsertArgs

	switch (mode) {
		default:
			throw Errors.InvalidArgument("mode")

		case "switch": {
			const [updated, created] = await prisma.$transaction([
				prisma.userPath.updateMany({
					data: {
						active: false,
					},
					where: {
						path: {
							alwaysActive: false
						},
						active: true,
					}
				}),
				prisma.userPath.upsert(upsertArgs)
			])
			return created;
		}

		case "multiple": {
			return await prisma.userPath.upsert(upsertArgs)
		}

		case "fail": {
			const existing = await prisma.userPath.findFirst({
				where: {
					userId,
					active: true,
					path: {
						alwaysActive: false
					}
				}
			})

			if (existing) throw new PublicError(409, "You already have an active path")

			return await prisma.userPath.upsert(upsertArgs)
		}

	}
}

/**
 * Deactivates a specific path for the user.
 * @returns Updated user path
 */
export async function deactivatePath(pathId: number) {
	zodOrThrow(z.number().int().positive(), pathId)
	const session = await auth()
	if (!session?.user.id) throw Errors.InvalidSession();

	const userId = session.user.id;

	return await prisma.userPath.update({
		data: {
			active: false,
		},
		where: {
			path: {
				alwaysActive: false
			},
			userId_pathId: {
				userId,
				pathId,
			}
		}
	})
}

/**
 * Deactivates all paths for the user.
 * Note that some paths are not deactivatable.
 * @returns Count of deactivated paths
 */
export async function deactivatePaths() {
	const session = await auth()
	if (!session?.user.id) throw Errors.InvalidSession();

	const userId = session.user.id;

	return await prisma.userPath.updateMany({
		data: {
			active: false,
		},
		where: {
			path: {
				alwaysActive: false
			},
			userId,
		}
	})
}

/**
 * Gets all, inactive, or active user paths for the user.
 * @param active Whether to get inactive or active user paths
 * @returns User paths
 */
export async function getPaths(active?: boolean) {
	const session = await auth()
	if (!session?.user.id) throw Errors.InvalidSession();

	const userId = session.user.id;

	return await prisma.userPath.findMany({
		where: {
			userId,
			active,
		}
	})
}