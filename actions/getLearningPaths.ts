// @ts-nocheck
"use server";

import { auth } from "@/auth";
import prisma from "@/lib/backend/prisma";

export const getLearningPaths = async () => {
  return await prisma.path.findMany({});
};

export const getFilteredPaths = async (pathId: number) => {
  return await prisma.path.findFirst({
    where: {
      id: pathId,
    },
  });
};

// get hard skills based on selected path

export const getHardSkillsForPath = async (pathId: number) => {
  const hardSkills = await prisma.path.findFirst({
    where: {
      id: pathId,
    },
    include: {
      skills: {
        where: {
          type: "Hard",
        },
      },
    },
  });
  return hardSkills?.skills || [];
};

// get soft skills based on selected path

export const getSoftSkillsForPath = async () => {
  const softSkills = await prisma.skill.findMany({
    where: {
      type: "Soft",
    },
  });
  return softSkills || [];
};

// get users selected paths
export const getUserSelectedPaths = async (userId: number) => {
  const session = await auth();

  if (!session) return null;
  const response = await prisma.userPath.findFirst({
    where: {
      userId: session.user.id,
    },
    include: {
      path: true,
    },
  });

  return response;
};

// get users selected path skills
export const getUserSelectedPathSkills = async () => {
  const session = await auth();
  if (!session) {
    return null;
  }

  // Get the user ID from the session
  const userId = session.user.id;

  const cards = await prisma.userSkill.findMany({
    where: {
      userId: userId,
    },
  });

  const sortedCards = cards.sort((a, b) => b.skillId - a.skillId);

  return sortedCards || [];
};

export const updateUsersLearningPaths = async (
  userId: number,
  pathId: number,
  updates: any
) => {
  const defaultUpdates = {
    active: true,
    selfScore: 0,
    completion: 0,
  };

  const mergedUpdates = { ...defaultUpdates, ...updates };

  const existingRecord = await prisma.userPath.findFirst({
    where: {
      userId: userId,
    },
  });

  if (existingRecord) {
    // If the record exists, update it
    const response = await prisma.userPath.update({
      where: {
        userId_pathId: {
          userId: userId,
          pathId: existingRecord.pathId,
        },
      },
      data: {
        pathId: pathId,
      },
    });
    return response;
  } else {
    // If the record doesn't exist, create a new one
    const response = await prisma.userPath.create({
      data: {
        userId: userId,
        pathId: pathId,
        ...mergedUpdates,
      },
    });

    return response;
  }
};
