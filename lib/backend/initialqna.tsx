"use server";

import prisma from "./prisma";

export async function initialAssessment(userId: number, points: any[]) {
  // Step 1: Organize points by skill
  const pointsBySkill = points.reduce((acc, answer) => {
    answer.points.forEach((point: any) => {
      const skillId = parseInt(point.skillId, 10); // Convert skillId to integer
      if (!acc[skillId]) {
        acc[skillId] = 0;
      }
      acc[skillId] += point.points;
    });
    return acc;
  }, {});

  // Step 2: Update UserSkill records with calculated scores
  for (const skillId in pointsBySkill) {
    const totalPoints = pointsBySkill[skillId];

    // Step 3: Check if the record exists
    const existingRecord = await prisma.userSkill.findUnique({
      where: { userId_skillId: { userId, skillId: parseInt(skillId, 10) } }, // Convert skillId to integer
    });

    // Step 4: Update or create the UserSkill record
    if (existingRecord) {
      await prisma.userSkill.update({
        where: { userId_skillId: { userId, skillId: parseInt(skillId, 10) } },
        data: { score: totalPoints },
      });
    } else {
      await prisma.userSkill.create({
        data: {
          userId,
          skillId: parseInt(skillId, 10),
          score: totalPoints,
        },
      });
    }
  }
}
