"use server";

import prisma from "@/lib/prisma";

interface SelectedAnswer {
  answer: {
    text: string;
    correct: boolean;
    id?: number;
  };
  questionId: number;
  skillId: number;
}

// get hard type questions related to selected paths
export const getHardQuestions = async (id: number) => {
  const questions = await prisma.skillQuestion.findMany({
    where: {
      skill: {
        type: "hard",
        paths: {
          some: {
            id: id,
          },
        },
      },
    },
    include: {
      skill: {
        include: {
          paths: true,
        },
      },
      options: true,
    },
    distinct: ["skillId"],
  });

  return questions;
};

export const upsertSelectedAnswers = async (
  selectedAnswers: Record<string, SelectedAnswer>
) => {
  console.log("selectedAnswers", selectedAnswers);

  const skillQuestions = Object.entries(selectedAnswers).map(
    ([questionText, { answer, questionId, skillId }]: [
      string,
      SelectedAnswer
    ]) => {
      return {
        where: {
          id: questionId,
        },
        create: {
          text: questionText,
          type: "select",
          assessment: { connect: { id: 1 } },
          options: {
            create: [
              {
                text: answer.text,
                correct: answer.correct,
              },
            ],
          },
        },
        update: {
          options: {
            where: { id: answer.id },
            data: { correct: answer.correct },
          },
        },
      };
    }
  );

  await prisma.$transaction(
    // @ts-ignore
    skillQuestions.map((question) => prisma.question.upsert(question))
  );
};
