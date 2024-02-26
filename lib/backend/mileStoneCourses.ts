"use server";

import prisma from "./prisma";

export const getQuestions = async (assessmentName: string) => {
  console.log("assessmentName", assessmentName);
  const assessment = await prisma.assessment.findFirst({
    where: {
      name: assessmentName,
    },
    include: {
      questions: true,
    },
  });

  const questions = await prisma.question.findMany({
    where: {
      assessmentId: assessment?.id,
    },
    include: {
      assessment: true,
      questionRecord: true,
    },
  });

  return questions;
};
