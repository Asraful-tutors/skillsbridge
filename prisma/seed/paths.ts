/// <reference path="../prisma.d.ts" />

import { Prisma } from "@prisma/client"
import { ModelFactory } from "./seed-util"

const pathFactory = new class extends ModelFactory<Prisma.PathCreateInput> { }

function makeArray<T, T2>(n: number, map: (index: number) => T2): T2[] {
	return Array(n).fill(null).map((v, i) => map(i));
}

function createOption(correct: boolean): Extract<PrismaJson.QuestionData, { type: "select" }>['options'][number] {
	return {
		text: `This is ${correct ? "a correct" : "an incorrect"} option.`,
		correct,
	}
}

function createQuestion(): Prisma.QuestionCreateWithoutAssessmentInput {
	const COUNT = 4;
	const correctI = Math.floor(Math.random() * COUNT);
	const options = makeArray(COUNT, (i) => createOption(correctI == i))
	const type = Math.random() > 0.8 ? "text" : "select";
	return {
		text: 'This is a question',
		data: type === "text" ? {
			type,
		} : {
			type,
			options,
		}
	}
}

function createMilestone(index: number): Prisma.MilestoneCreateWithoutPathInput {
	return {
		description: `This is a placeholder milestone ${index}`,
		name: `Milestone ${index}`,
		assessments: {
			create: [placeHolderAssessment]
		}
	}
}

const placeHolderAssessment: Prisma.AssessmentCreateWithoutMilestoneInput = {
	maxSeconds: Math.random() * 50 + 50,
	minScore: Math.random() * 50 + 50,
	questions: {
		create: makeArray(10, _ => createQuestion())
	}
}

const placeHolderMilestones: Prisma.PathCreateInput['milestones'] = {
	create: makeArray(7, (i) => createMilestone(i))
}

export const Paths = {
	Artist: pathFactory.create({
		name: "Artist",
		icon: "/images/game-designer.svg",
		milestones: placeHolderMilestones,
	}),
	GameDesign: pathFactory.create({
		name: "Game Design",
		icon: "/images/game-programmer.svg",
		milestones: placeHolderMilestones,
	}),
	Producer: pathFactory.create({
		name: "Producer",
		icon: "/images/game-producer.svg",
		milestones: placeHolderMilestones,
	}),
	GameProgrammer: pathFactory.create({
		name: "Game Programmer",
		icon: "/images/game-artist.svg",
		milestones: placeHolderMilestones,
	}),
	SoftSkills: pathFactory.create({
		name: "Soft Skills",
		icon: "/images/game-artist.svg",
		// milestones: placeHolderMilestones,
		alwaysActive: true,
	}),
}