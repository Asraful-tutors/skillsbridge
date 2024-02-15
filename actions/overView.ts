"use server";

import prisma from "@/lib/backend/prisma";

// get users assessed hard skillspoints
export const getHardSkills = async (userId: number) => {
  return await prisma.userSkill.findMany({
    where: {
      userId,
      skill: {
        type: "HARD",
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
        type: "SOFT",
      },
    },
    include: {
      skill: true,
    },
  });
};
