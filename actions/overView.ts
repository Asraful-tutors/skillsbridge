"use server";

import { auth } from "@/auth";
import prisma from "@/lib/backend/prisma";

// get users assessed hard skillspoints
export const getHardSkills = async (userId: number) => {
  return await prisma.userSkill.findMany({
    where: {
      userId,
      skill: {
        type: "Hard",
      },
    },
    include: {
      skill: true,
    },
  });
};

// get users  assessed soft skillspoints
export const getSoftSkills = async (userId: number) => {
  return await prisma.userSkill.findMany({
    where: {
      userId,
      skill: {
        type: "Soft",
      },
    },
    include: {
      skill: true,
    },
  });
};

// get users assessed hard skillspoints
export const getDashboardhardSkills = async (userId: number) => {
  const session = await auth();

  if (!session) {
    return { message: "UserId not founds" };
  }
  const softSkills = await prisma.userSkill.findMany({
    where: {
      userId: session.user.id,
      skill: {
        type: "Hard",
      },
    },
    include: {
      skill: true,
    },
  });

  // Sort the softSkills array based on assessedScore in ascending order
  const sortedSoftSkills = softSkills.sort((a, b) => {
    // Make sure to handle null values (if any)
    const scoreA = b.assessedScore || 0;
    const scoreB = a.assessedScore || 0;

    return scoreA - scoreB;
  });

  return sortedSoftSkills;
};

// get users assessed soft skillspoints
export const getDashboardSoftSkills = async (userId: number) => {
  const session = await auth();

  if (!session) {
    return { message: "UserId not founds" };
  }

  const softSkills = await prisma.userSkill.findMany({
    where: {
      userId: session.user.id,
      skill: {
        type: "Soft",
      },
    },
    include: {
      skill: true,
    },
  });

  // Sort the softSkills array based on assessedScore in ascending order
  const sortedSoftSkills = softSkills.sort((a, b) => {
    // Make sure to handle null values (if any)
    const scoreA = b.assessedScore || 0;
    const scoreB = a.assessedScore || 0;

    return scoreA - scoreB;
  });

  return sortedSoftSkills;
};
