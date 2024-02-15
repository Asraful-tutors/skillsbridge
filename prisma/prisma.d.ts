
declare namespace PrismaJson {

	type QuestionData = {
		type: "select",
		options: Array<{
			text: string,
			correct: boolean,
		}>
	} | {
		type: "text",
	}

	type SkillQuestionData = {
		type: "select",
		options: Array<{
			text: string,
			correct: boolean,
		}>
	} | {
		type: "text",
	}

	type QuestionRecordData = ({
		type: "select",
		option: number,
	} | {
		type: "text",
		text: string,
	})
}