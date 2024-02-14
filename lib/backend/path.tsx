import { Prisma, PrismaClient } from "@prisma/client";
import { compare, hash } from "bcrypt";
import { BackendError, PublicError } from "./errors";

export namespace Path {

	/**
	 * Example on how to get all paths. DO NOT USE THIS FUNCTION!
	 * @deprecated
	 */
	export async function getPaths(prisma: PrismaClient) {
		if (" ") throw Error("Don't use!")
		const paths = await prisma.path.findMany({});
		return paths
	}

	/**
	 * Example on how to get all paths and some all of it's relations. DO NOT USE THIS FUNCTION!
	 * @deprecated
	 */
	export async function getPathsWithInfo(prisma: PrismaClient) {
		if (" ") throw Error("Don't use!")
		const paths = await prisma.path.findMany({
			include: {
				_count: true,
				milestones: true,
				skills: true,
				userPaths: true,
			},
		});
		return paths
	}


}

export default Path;

