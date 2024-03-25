// @ts-nocheck

"use server";

import { auth } from "@/auth";
import prisma from "./prisma";

export async function initialAssessment(points: any[]) {
  const session = await auth();

  if (!session) {
    return { message: "UserId not founds" };
  }

  const skillPointsMap = new Map<number, number>();

  // Iterate through the points array and group the points by skillId
  points.forEach((point) => {
    point.points.forEach((skill) => {
      const { skillId, points } = skill;

      // Using Map to store the sum of points for each skillId
      skillPointsMap.set(skillId, (skillPointsMap.get(skillId) || 0) + points);
    });
  });

  // Convert the map to an array of objects with skillId and totalPoints
  const totalSkillPoints = Array.from(skillPointsMap.entries()).map(
    ([skillId, totalPoints]) => ({
      skillId,
      totalPoints: totalPoints.toFixed(2),
    })
  );

  // Iterate through totalSkillPoints array and update/create records in the database
  for (const { skillId, totalPoints } of totalSkillPoints) {
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
        data: { score: parseFloat(totalPoints) },
      });
    } else {
      await prisma.userSkill.create({
        data: {
          userId: session.user.id,
          skillId: parseInt(skillId, 10),
          score: parseFloat(totalPoints),
        },
      });
    }
  }

  return { totalSkillPoints };
}

export async function mileStoneAssessment(points: any[]) {
  const session = await auth();

  if (!session) {
    return { message: "UserId not founds" };
  }

  const skillPointsMap = new Map<number, number>();

  // Iterate through the points array and group the points by skillId
  points.forEach((point) => {
    point.points.forEach((skill) => {
      const { skillId, points } = skill;

      // Using Map to store the sum of points for each skillId
      skillPointsMap.set(skillId, (skillPointsMap.get(skillId) || 0) + points);
    });
  });

  // Convert the map to an array of objects with skillId and totalPoints
  const totalSkillPoints = Array.from(skillPointsMap.entries()).map(
    ([skillId, totalPoints]) => ({
      skillId,
      totalPoints: totalPoints.toFixed(2),
    })
  );

  // Iterate through totalSkillPoints array and update/create records in the database
  for (const { skillId, totalPoints } of totalSkillPoints) {
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
      const existingScore = parseFloat(existingRecord.assessedScore);
      const updatedScore = isNaN(existingScore)
        ? parseFloat(totalPoints)
        : existingScore + parseFloat(totalPoints);

      await prisma.userSkill.update({
        where: {
          userId_skillId: {
            userId: session.user.id,
            skillId: parseInt(skillId, 10),
          },
        },
        data: { assessedScore: parseFloat(updatedScore.toFixed(2)) },
      });
    } else {
      await prisma.userSkill.create({
        data: {
          userId: session.user.id,
          skillId: parseInt(skillId, 10),
          assessedScore: parseFloat(totalPoints),
        },
      });
    }
  }

  return { totalSkillPoints };
}
