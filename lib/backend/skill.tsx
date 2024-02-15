"use server"
import prisma from "./prisma";
import { auth } from "../../auth";
import Errors, { BackendError, PublicError, zodOrThrow } from "./errors";
import { z } from "zod";
import { Prisma } from "@prisma/client";

/**
 * Allows a user to set their skill self score
 * @param skillId 
 * @param selfScore User self score or null to clear
 * @returns Updated user skill
 */
export async function setSkillSelfScore(skillId: number, selfScore?: number) {
	zodOrThrow(z.number().int().positive(), skillId)
	zodOrThrow(z.number().int().positive().lte(5), selfScore)
	const session = await auth()
	if (!session?.user.id) throw Errors.InvalidSession();

	const userId = session.user.id;

	return await prisma.userSkill.upsert({
		create: {
			userId,
			skillId,
			selfScore,
		},
		update: {
			selfScore,
		},
		where: {
			userId_skillId: {
				userId,
				skillId,
			}
		},
	})
}

/**
 * @returns Simply the list of user skills for the current user.
 */
export async function getUserSkills() {
	const session = await auth()
	if (!session?.user.id) throw Errors.InvalidSession();

	const userId = session.user.id;

	return await prisma.userSkill.findMany({
		where: {
			userId,
		},
	})
}
