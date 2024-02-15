"use server"
import prisma from "./prisma";
import { auth } from "../../auth";
import Errors, { BackendError, PublicError, zodThrow } from "./errors";
import { z } from "zod";
import { Prisma } from "@prisma/client";
import { shuffle } from "../utils";

type StartSkillAssessmentOptions = {
	mode?: "auto-seal" | "allow-multiple" | "fail-if-active",
}

/**
 * Starts the skill assessment, creates a skill assessment record.
 * Note that the current user must have an active path.
 * @param options 
 * @returns Created record
 */
export async function startSkillAssessment(options?: StartSkillAssessmentOptions) {
	const { mode = "auto-seal" } = options ?? {};
	const session = await auth()
	if (!session?.user.id) throw Errors.InvalidSession();

	const userId = session.user.id;

	const userPath = await prisma.userPath.findFirst({
		where: {
			userId: userId,
			active: true,
		}
	})
	if (!userPath) throw Errors.NotFound("Active path")

	const path = await prisma.path.findUnique({
		where: {
			id: userPath.pathId
		},
		include: {
			skills: {
				select: {
					questions: true
				}
			}
		}
	})
	if (!path) throw Errors.NotFound("Path definition")

	const questions = path.skills.flatMap((p, i) => p.questions.map((q, j) => ({
		skillId: q.skillId,
		questionId: q.id,
		index: NaN,
	}) satisfies Prisma.SkillQuestionRecordUncheckedCreateWithoutRecordInput))

	shuffle(questions)

	for (let i = 0; i < questions.length; i++) {
		questions[i].index = i;
	}

	const createArgs = {
		data: {
			userId,
			questions: {
				create: questions,
			},
		},
		include: {
			questions: {
				orderBy: {
					index: "asc",
				},
			}
		}
	} satisfies Prisma.SkillAssessmentRecordCreateArgs

	switch (mode) {
		default:
			throw Errors.InvalidArgument("mode")

		case "auto-seal": {
			const [updated, created] = await prisma.$transaction([
				prisma.skillAssessmentRecord.updateMany({
					data: {
						sealed: true,
					},
					where: {
						userId,
						sealed: false
					}
				}),
				prisma.skillAssessmentRecord.create(createArgs)
			])
			return created;
		}

		case "allow-multiple": {
			return await prisma.skillAssessmentRecord.create(createArgs)
		}

		case "fail-if-active": {
			const existing = await prisma.skillAssessmentRecord.findFirst({
				where: {
					userId,
					sealed: false
				}
			})

			if (existing) throw new PublicError(409, "You already have an active skill assessment")

			return await prisma.skillAssessmentRecord.create(createArgs)
		}

	}

}

type AnswerType = {
	type: "select",
	option: number,
} | {
	type: "text",
	text: string,
}

/**
 * Marks the question answered in a skill record.
 */
export async function answerSkillQuestion(recordId: number, questionRecordId: number, answer: AnswerType) {
	zodThrow(z.number().positive(), recordId)
	zodThrow(z.number().positive(), questionRecordId)
	const session = await auth()
	if (!session?.user.id) throw Errors.InvalidSession();

	const userId = session.user.id;

	let data: PrismaJson.QuestionRecordData;

	switch (answer.type) {
		default:
			throw Errors.InvalidArgument("answer.type")

		case "select":
			data = {
				type: answer.type,
				option: answer.option,
			}
			break;
		case "text":
			data = {
				type: answer.type,
				text: answer.text,
			}
			break;
	}

	const record = await prisma.skillAssessmentRecord.findUnique({ where: { id: recordId, userId } })
	if (!record) throw Errors.NotFound("Skill Assessment")

	return await prisma.skillQuestionRecord.update({
		data: {
			sealed: true,
			data,
		},
		where: {
			id: questionRecordId,
		}
	})
}

/**
 * Seals a skill record of the current user.
 */
export async function sealSkillRecord(recordId: number) {
	zodThrow(z.number().positive(), recordId)
	const session = await auth()
	if (!session?.user.id) throw Errors.InvalidSession();

	const userId = session.user.id;

	await prisma.skillAssessmentRecord.update({
		data: {
			sealed: true,
		},
		where: {
			id: recordId,
			userId,
		}
	})
}

/**
 * Seals any active skill assessments the user has.
 * @returns Amount of items sealed
 */
export async function sealSkillRecords() {
	const session = await auth()
	if (!session?.user.id) throw Errors.InvalidSession();

	const userId = session.user.id;

	return await prisma.skillAssessmentRecord.updateMany({
		data: {
			sealed: true,
		},
		where: {
			userId,
			sealed: false
		},
	})
}

export async function listActiveSkillRecords() {
	const session = await auth()
	if (!session?.user.id) throw Errors.InvalidSession();

	const userId = session.user.id;

	return await prisma.skillAssessmentRecord.findMany({
		where: {
			userId,
			sealed: false
		},
	})
}
