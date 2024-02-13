"use server";

import { SkillScore } from "@/components/app/start/overview/assessment/QuestionsPanel";
import prisma from "@/lib/prisma";
import { PrismaClientValidationError } from "@prisma/client/runtime/library";

interface SelectedAnswer {
  answer: {
    text: string;
    correct: boolean;
    id?: number;
  };
  questionId: number;
  skillId: number;
}

interface UserSkillUpdateInput {
  where: {
    userId_skillId: {
      userId: number;
      skillId: number;
    };
  };
  data: {};
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

// get hard type questions related to selected paths
export const getSoftQuestions = async (id: number) => {
  const questions = await prisma.skillQuestion.findMany({
    where: {
      skill: {
        type: "soft",
        paths: {
          some: {
            id: 5,
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

export const upsertSelectedAnswers = async (skillScores: SkillScore[]) => {
  try {
    // Retrieve user ID if needed
    const userId = 1;

    // Map SkillScore array to update objects
    const updates = skillScores.map(async (score) => {
      const res = await prisma.userSkill.update({
        where: {
          userId_skillId: {
            userId,
            skillId: score.skillId,
          },
        },
        data: {
          score: score.score,
        },
      });

      return res;
    });

    // Use Promise.all to wait for all updates to complete
    const results = await Promise.all(updates);
    console.log("results", results);
  } catch (error) {
    if (error instanceof PrismaClientValidationError) {
      // Handle specific validation errors gracefully
      console.error("Validation error:", error.message);
    } else {
      console.error("Error during update operation:", error);
    }
    // Throw or handle the error appropriately
  }
};
