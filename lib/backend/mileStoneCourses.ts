// @ts-nocheck

"use server";

import { auth } from "@/auth";
import prisma from "./prisma";
import { constructFrom } from "date-fns";

export const getQuestions = async (id: any) => {
  // let id = parseInt(assessment);
  const session = await auth();

  if (!session) {
    return { message: "UserId not found" };
  }

  if (id == 19) {
    const getMilestone = await prisma.assessment.findFirst({
      where: {
        id: 7,
      },
      include: {
        questions: true,
        milestones: true,
      },
    });

    return getMilestone?.questions || [];
  } else if (id == 22) {
    const getMilestone = await prisma.assessment.findFirst({
      where: {
        id: 11,
      },
      include: {
        questions: true,
        milestones: true,
      },
    });

    return getMilestone?.questions || [];
  } else if (id == 25) {
    const getMilestone = await prisma.assessment.findFirst({
      where: {
        id: 20,
      },
      include: {
        questions: true,
        milestones: true,
      },
    });

    return getMilestone?.questions || [];
  } else if (id == 28) {
    const getMilestone = await prisma.assessment.findFirst({
      where: {
        id: 16,
      },
      include: {
        questions: true,
        milestones: true,
      },
    });

    return getMilestone?.questions || [];
  }

  // get soft questions
  else {
    const getassessment = await prisma.milestone.findFirst({
      where: {
        id: parseInt(id),
      },
      include: {
        assessments: true,
      },
    });
    const assessmentIds =
      getassessment?.assessments.map((assessment) => assessment.id) || [];

    // Fetch additional data for each assessment ID
    const assessmentDetails = await Promise.all(
      assessmentIds.map(async (assessmentId) => {
        const assessmentData = await prisma.assessment.findFirst({
          where: {
            id: assessmentId,
          },
          include: {
            questions: true,
            milestones: true,
          },
        });
        return assessmentData?.questions || [];
      })
    );

    // Concatenate the arrays of questions into a single array
    const concatenatedQuestions = assessmentDetails.reduce(
      (acc, questions) => acc.concat(questions),
      []
    );

    return concatenatedQuestions || [];
  }
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

  const getSkillName = await prisma.skill.findFirst({
    where: {
      id: skillId,
    },
  });

  return { requirements, getSkillName };
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

export const getAllMilestones = async (pathid: number) => {
  const milestones = await prisma.milestone.findMany({
    where: {
      id: {
        in: Array.from({ length: 18 }, (_, i) => i + 1),
      },
    },
  });

  // cosnt get required hard milestones
  // Define mapping of pathid to milestone ids
  const pathidToMilestoneIds = {
    1: [19, 20, 21],
    2: [25, 26, 27],
    3: [22, 23, 24],
    4: [28, 29, 30],
  };

  // Get the required milestones based on pathid
  // @ts-ignore
  const requiredMilestoneIds = pathidToMilestoneIds[pathid] || [];
  const getRequiredMilestones = await prisma.milestone.findMany({
    where: {
      id: {
        in: requiredMilestoneIds,
      },
    },
  });

  const updatedData = [...milestones, ...getRequiredMilestones];

  return updatedData || [];
};

// get assessment

export const getSingleAssessment = async (milestoneId: number) => {
  const data = await prisma.milestone.findFirst({
    where: {
      id: parseInt(milestoneId),
    },
    include: {
      assessments: true,
      skillRequirements: true,
      skills: true,
    },
  });

  const getQuestions = await prisma.assessment.findMany({
    where: {
      id: parseInt(milestoneId),
    },
    select: {
      questions: {
        select: {
          data: true,
        },
      },
    },
  });

  // Flatten the array of questions and get the 'data' field
  const questionsData = getQuestions.flatMap((assessment) =>
    assessment.questions.map((question) => question?.data)
  );

  // Extract skill IDs from the 'options' array
  const AllskillIds = questionsData.flatMap((data) =>
    data?.type === "select"
      ? data?.options?.flatMap((point) =>
          point?.points?.map((option) => option.skillId)
        )
      : []
  );

  // Fetch skill names based on the skill IDs
  const skillNames = await prisma.skill.findMany({
    where: {
      id: {
        in: AllskillIds,
      },
    },
    select: {
      id: true,
      name: true, // Add other properties you need
    },
  });

  return { data, skillNames };
};

//

export const getSkillNames = async (milestoneId: any) => {
  const getQuestions = await prisma.assessment.findMany({
    where: {
      id: parseInt(milestoneId),
    },
    select: {
      questions: {
        select: {
          data: true,
        },
      },
    },
  });

  // Flatten the array of questions and get the 'data' field
  const questionsData = getQuestions.flatMap((assessment) =>
    assessment.questions.map((question) => question?.data)
  );

  // Extract skill IDs from the 'options' array
  const AllskillIds = questionsData.flatMap((data) =>
    data?.type === "select"
      ? data?.options?.flatMap((point) =>
          point?.points?.map((option) => option.skillId)
        )
      : []
  );

  // Fetch skill names based on the skill IDs
  const skillNames = await prisma.skill.findMany({
    where: {
      id: {
        in: AllskillIds,
      },
    },
    select: {
      id: true,
      name: true, // Add other properties you need
    },
  });

  return skillNames || [];
};
