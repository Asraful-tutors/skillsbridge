"use server";

import { auth } from "@/auth";
import prisma from "./prisma";
import { constructFrom } from "date-fns";

export const getQuestions = async (assessmentName: string) => {
  const session = await auth();

  if (!session) {
    return { message: "UserId not found" };
  }

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

export const getMilestoneQuestions = async (name: string, id: any) => {
  const session = await auth();

  if (!session) {
    return { message: "UserId not found" };
  }

  const milestone = await prisma.assessment.findFirst({
    where: {
      name: name,
    },
    include: {
      milestones: {
        include: {
          skillRequirements: {
            include: {
              skill: true,
            },
          },
          assessments: true,
          skills: true,
        },
      },
    },
  });

  return milestone || [];
};

export const isEligible = async (name: string, id: any) => {
  const session = await auth();
  console.log("name", name, id);
  console.log(`${name} ${id}`);

  if (!session) {
    return { message: "UserId not found" };
  }

  const milestone = await prisma.assessment.findFirst({
    where: {
      name: `${name} ${id}`,
    },
    include: {
      milestones: {
        include: {
          skillRequirements: {
            include: {
              skill: true,
            },
          },
          assessments: true,
          skills: true,
        },
      },
    },
  });

  return milestone || [];
};

// get users skillrequirements to move to next milestone

export const getSkillRequirements = async (skillId: any) => {
  const session = await auth();

  if (!session) return null;

  const requirements = await prisma.userSkill.findFirst({
    where: {
      userId: session.user.id,
      skillId: skillId,
    },
  });

  return requirements;
};

// go to course link

// export const goToCourse = async (skillId: any) => {
//   const session = await auth();

//   if (!session) return null;

//   const link = await prisma.assessment.findFirst({
//     where: {
//       id: skillId,
//     },
//     include: {
//       milestones: true,
//     },
//   });

//   return link;
// };
