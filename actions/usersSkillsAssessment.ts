"use server";

import prisma from "@/lib/backend/prisma";

export const upsertHardSkills = async (
  userId: number,
  skills: { skillId: number; selfScore: number }[]
) => {
  const upsertPromises = skills.map(({ skillId, selfScore }) => {
    return prisma.userSkill.upsert({
      where: {
        userId_skillId: {
          userId,
          skillId,
        },
      },
      update: {
        selfScore,
      },
      create: {
        userId,
        skillId,
        selfScore,
        score: 0,
      },
    });
  });
  await Promise.all(upsertPromises);
};

export const upsertSoftSkills = async (
  userId: number,
  skills: { skillId: number; selfScore: number }[]
) => {
  const upsertPromises = skills.map(({ skillId, selfScore }) => {
    return prisma.userSkill.upsert({
      where: {
        userId_skillId: {
          userId,
          skillId,
        },
      },
      update: {
        selfScore,
      },
      create: {
        userId,
        skillId,
        selfScore,
        score: 0,
      },
    });
  });
  await Promise.all(upsertPromises);
};
