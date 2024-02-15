"use server"
import prisma from "./prisma";
import { auth } from "../../auth";
import Errors, { BackendError, PublicError, zodThrow } from "./errors";
import { z } from "zod";
import { Prisma } from "@prisma/client";

type StartAssessmentOptions = {
	mode?: "auto-seal" | "allow-multiple" | "fail-if-active",
}

/**
 * Starts an assessment, creates an assessment record.
 * @param options 
 * @returns Created record
 */
export async function startAssessment(assessmentId: number, options?: StartAssessmentOptions) {
	zodThrow(z.number().positive(), assessmentId)
	const { mode = "auto-seal" } = options ?? {};
	const session = await auth()
	if (!session?.user.id) throw Errors.InvalidSession();

	const userId = session.user.id;

	const assessment = await prisma.assessment.findFirst({
		where: {
			id: assessmentId
		},
		include: {
			questions: true
		}
	})
	if (!assessment) throw Errors.NotFound("Assessment")

	const createArgs = {
		data: {
			userId,
			assessmentId,
			questions: {
				create: assessment.questions.map((v, i) => ({
					questionId: v.id,
					index: i,
				}))
			},
		},
		include: {
			questions: {
				orderBy: {
					index: "asc",
				},
			}
		}
	} satisfies Prisma.AssessmentRecordCreateArgs

	switch (mode) {
		default:
			throw Errors.InvalidArgument("mode")

		case "auto-seal": {
			const [updated, created] = await prisma.$transaction([
				prisma.assessmentRecord.updateMany({
					data: {
						sealed: true,
					},
					where: {
						userId,
						sealed: false
					}
				}),
				prisma.assessmentRecord.create(createArgs)
			])
			return created;
		}

		case "allow-multiple": {
			return await prisma.assessmentRecord.create(createArgs)
		}

		case "fail-if-active": {
			const existing = await prisma.assessmentRecord.findFirst({
				where: {
					userId,
					sealed: false
				}
			})

			if (existing) throw new PublicError(409, "You already have an active assessment")

			return await prisma.assessmentRecord.create(createArgs)
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
 * Marks the question answered in a record.
 */
export async function answerQuestion(recordId: number, questionRecordId: number, answer: AnswerType) {
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

	const record = await prisma.assessmentRecord.findUnique({ where: { id: recordId } })
	if (!record) throw Errors.NotFound("Assessment")
	if (record.userId !== userId) throw Errors.Forbidden()

	return await prisma.questionRecord.update({
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
 * Seals record of the current user.
 */
export async function sealRecord(recordId: number) {
	zodThrow(z.number().positive(), recordId)
	const session = await auth()
	if (!session?.user.id) throw Errors.InvalidSession();

	const userId = session.user.id;

	await prisma.assessmentRecord.update({
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
 * Seals any active assessments the user has.
 * @returns Amount of items sealed
 */
export async function sealRecords() {
	const session = await auth()
	if (!session?.user.id) throw Errors.InvalidSession();

	const userId = session.user.id;

	return await prisma.assessmentRecord.updateMany({
		data: {
			sealed: true,
		},
		where: {
			userId,
			sealed: false
		},
	})
}

export async function listActiveRecords() {
	const session = await auth()
	if (!session?.user.id) throw Errors.InvalidSession();

	const userId = session.user.id;

	return await prisma.assessmentRecord.findMany({
		where: {
			userId,
			sealed: false
		},
	})
}
