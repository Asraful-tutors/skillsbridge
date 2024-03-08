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
          assessments: {
            include: {
              questions: {
                include: {
                  assessment: true,
                },
              },
            },
          },
          skills: true,
        },
      },
    },
  });

  if (!milestone) {
    return { message: "Milestone not found" };
  }
  // Extracting skillId and text from the options array
  const skillInfo = milestone.milestones[0].assessments[0].questions
    // @ts-ignore
    .flatMap((question) => question.data.options)
    .filter((option) => option.points && option.points.length > 0) // Filtering options with points
    .map((option) => ({
      skillId: option.points[0].skillId,
      text: option.text,
    }));

  if (skillInfo.length === 0) {
    return { message: "No skill information found" };
  }

  // Assuming you have a separate model named 'Question'
  // You can run another query to find the name based on the extracted skillId
  const skillIds = skillInfo.map((info) => info.skillId);
  console.log("skillids", skillIds);

  const skillNames = [];

  for (const skillId of skillIds) {
    const skill = await prisma.skill.findUnique({
      where: {
        id: skillId,
      },
    });

    if (skill) {
      skillNames.push({
        skillId: skill.id,
        skillName: skill.name,
      });
    } else {
      skillNames.push({
        skillId: skillId,
        skillName: "Unknown",
      });
    }
  }

  return { milestone, skillNames } || [];
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
