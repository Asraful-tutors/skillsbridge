"use server";

import prisma from "@/lib/prisma";

// get users assessed hard skillspoints
export const getHardSkills = async (userId: number) => {
  return await prisma.userSkill.findMany({
    where: {
      userId,
      skill: {
        type: "hard",
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
        type: "soft",
      },
    },
    include: {
      skill: true,
    },
  });
};
