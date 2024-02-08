import { Prisma } from "@prisma/client"
import { ModelFactory } from "./seed-util"

const pathFactory = new class extends ModelFactory<Prisma.PathCreateInput> { }

export const Paths = {
	Artist: pathFactory.create({
		name: "Artist",
		icon: "/images/game-designer.svg",
	}),
	GameDesign: pathFactory.create({
		name: "Game Design",
		icon: "/images/game-programmer.svg",
	}),
	Producer: pathFactory.create({
		name: "Producer",
		icon: "/images/game-producer.svg",
	}),
	GameProgrammer: pathFactory.create({
		name: "Game Programmer",
		icon: "/images/game-artist.svg",
	}),
	SoftSkills: pathFactory.create({
		name: "Soft Skills",
		icon: "/images/game-artist.svg",
	}),
}