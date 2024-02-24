"use server";

import prisma from "./prisma";

// get hard skills for user sorted by priority skills

export const getAllSortedHardSkills = async (
  userId: number,
  pathId: string
) => {
  const data = await prisma.skill.findMany({
    where: {
      paths: {
        every: {
          id: 4,
        },
      },
    },
  });

  return data || [];
};
