// @ts-nocheck

"use server";

import { auth } from "@/auth";
import prisma from "./prisma";

export async function initialAssessment(points: any[]) {
  const session = await auth();

  if (!session) {
    return { message: "UserId not founds" };
  }
  // const user = await prisma.user.findUnique({
  //   // @ts-ignore
  //   where: { email: session.user.email },
  // });

  // Use reduce to group percentages by skillId
  const groupedPercentages = points.reduce((result, point) => {
    const { skillId, percentage } = point;

    if (!result[skillId]) {
      result[skillId] = [];
    }

    result[skillId].push(percentage);

    return result;
  }, {});

  // Calculate average percentage for each skillId
  const averagePercentages = {};
  for (const skillId in groupedPercentages) {
    const percentages = groupedPercentages[skillId];
    const average =
      percentages.reduce((sum, percentage) => sum + percentage, 0) /
      percentages.length;

    // Cap the average at a maximum of 10 (equivalent to 100%)
    averagePercentages[skillId] = Math.round(average * 10) / 10; // Apply scaling factor after rounding

    // Update or create the UserSkill record
    const totalPoints = averagePercentages[skillId];
    // Check if the record exists
    const existingRecord = await prisma.userSkill.findUnique({
      where: {
        userId_skillId: {
          userId: session.user.id,
          skillId: parseInt(skillId, 10),
        },
      },
    });

    // Update or create the UserSkill record
    if (existingRecord) {
      await prisma.userSkill.update({
        where: {
          userId_skillId: {
            userId: session.user.id,
            skillId: parseInt(skillId, 10),
          },
        },
        data: { score: totalPoints },
      });
    } else {
      await prisma.userSkill.create({
        data: {
          userId: session.user.id,
          skillId: parseInt(skillId, 10),
          score: totalPoints,
        },
      });
    }
  }

  console.log(
    "Updated UserSkill records with average percentages:",
    averagePercentages
  );
}

export async function mileStoneAssessment(points: any[]) {
  const session = await auth();

  if (!session) {
    return { message: "UserId not founds" };
  }
  // const user = await prisma.user.findUnique({
  //   // @ts-ignore
  //   where: { email: session.user.email },
  // });

  // Use reduce to group percentages by skillId
  const groupedPercentages = points.reduce((result, point) => {
    const { skillId, percentage } = point;

    if (!result[skillId]) {
      result[skillId] = [];
    }

    result[skillId].push(percentage);

    return result;
  }, {});

  // Calculate average percentage for each skillId
  const averagePercentages = {};
  for (const skillId in groupedPercentages) {
    const percentages = groupedPercentages[skillId];
    const average =
      percentages.reduce((sum, percentage) => sum + percentage, 0) /
      percentages.length;

    // Cap the average at a maximum of 10 (equivalent to 100%)
    averagePercentages[skillId] = Math.round(average * 10) / 10; // Apply scaling factor after rounding

    // Update or create the UserSkill record
    const totalPoints = averagePercentages[skillId];
    // Check if the record exists
    const existingRecord = await prisma.userSkill.findUnique({
      where: {
        userId_skillId: {
          userId: session.user.id,
          skillId: parseInt(skillId, 10),
        },
      },
    });

    // Update or create the UserSkill record
    if (existingRecord) {
      await prisma.userSkill.update({
        where: {
          userId_skillId: {
            userId: session.user.id,
            skillId: parseInt(skillId, 10),
          },
        },
        data: { assessedScore: totalPoints },
      });
    } else {
      await prisma.userSkill.create({
        data: {
          userId: session.user.id,
          skillId: parseInt(skillId, 10),
          assessedScore: totalPoints,
        },
      });
    }
  }

  console.log(
    "Updated UserSkill records with average percentages:",
    averagePercentages
  );
}
