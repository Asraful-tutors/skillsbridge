"use server";

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
  const hardSkills = await prisma.skill.findMany({
    where: {
      paths: {
        every: {
          id: pathId,
        },
      },
    },
  });
  return hardSkills || [];
};

// get soft skills based on selected path

export const getSoftSkillsForPath = async () => {
  const softSkills = await prisma.skill.findMany({
    where: {
      paths: {
        some: {
          id: 4,
        },
      },
    },
  });
  console.log("soft", softSkills);
  return softSkills || [];
};

// get users selected paths
export const getUserSelectedPaths = async (userId: number) => {
  const response = await prisma.userPath.findFirst({
    where: {
      userId: userId,
    },
    include: {
      path: true,
    },
  });

  return response;
};

// get users selected path skills
export const getUserSelectedPathSkills = async (userId: number) => {
  const response = await prisma.user.findFirst({
    where: {
      id: userId,
    },
    include: {
      skills: {
        where: {
          skill: {
            type: "Hard",
          },
        },
        include: {
          skill: true,
        },
      },
    },
  });

  return response;
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
