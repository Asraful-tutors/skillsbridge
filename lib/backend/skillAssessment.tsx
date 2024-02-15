"use server"
import prisma from "./prisma";
import { auth } from "../../auth";
import Errors, { BackendError, PublicError, zodOrThrow } from "./errors";
import { z } from "zod";
import { Prisma } from "@prisma/client";
import { shuffle } from "../utils";

type OrDesc<T extends string> = T | `${T}-desc`

type Sorters = "skill-type" | "skill-name" | "question-type"

type StartSkillAssessmentOptions = {
	/** @default "auto-seal" */
	mode?: "auto-seal" | "allow-multiple" | "fail-if-active",
	/**
	 * Sort the questions (most to least important)
	 * @example
	 * // Sort by skill name in reverse, then sort by skill-type
	 * ["skill-type", "skill-name-desc"]
	 * @default ["skill-type"]
	 */
	sorters?: Array<OrDesc<Sorters>>,
}

const META = Symbol("meta")

/**
 * Starts the skill assessment, creates a skill assessment record.
 * Note that the current user must have an active path.
 * @param options 
 * @returns Created record
 */
export async function startSkillAssessment(options?: StartSkillAssessmentOptions) {
	const { mode = "auto-seal", sorters = ["skill-type"] } = options ?? {};
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
					questions: true,
					type: true,
					name: true,
				}
			}
		}
	})
	if (!path) throw Errors.NotFound("Path definition")

	type Meta = {
		questionType: PrismaJson.QuestionRecordData['type'],
		skillType: Prisma.SkillGetPayload<{}>['type']
		skillName: Prisma.SkillGetPayload<{}>['name']
	}

	const questions = path.skills.flatMap((s, i) => s.questions.map((q, j) => ({
		skillId: q.skillId,
		questionId: q.id,
		index: NaN,
		skillType: s.type,
		[META]: {
			questionType: q.data.type,
			skillType: s.type,
			skillName: s.name,
		}
	}) satisfies Prisma.SkillQuestionRecordUncheckedCreateWithoutRecordInput & { [META]: Meta }))

	shuffle(questions)

	for (let i = sorters.length - 1; i >= 0; i--) {
		const _sorter = sorters[i];
		const reverse = _sorter.endsWith("-desc")
		const sorter = (reverse ? _sorter.substring(0, _sorter.length - 5) : _sorter) as Sorters;
		questions.sort((a, b) => {
			if (reverse) {
				[b, a] = [a, b]
			}
			switch (sorter) {
				case "question-type":
					return a[META].questionType.localeCompare(b[META].questionType)

				case "skill-name":
					return a[META].skillName.localeCompare(b[META].skillName)

				case "skill-type":
					return a[META].skillType.localeCompare(b[META].skillType)

				default:
					throw Errors.InvalidArgument("sorters")
			}
		})
	}

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
	zodOrThrow(z.number().int().positive(), recordId)
	zodOrThrow(z.number().int().positive(), questionRecordId)
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
	zodOrThrow(z.number().int().positive(), recordId)
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
