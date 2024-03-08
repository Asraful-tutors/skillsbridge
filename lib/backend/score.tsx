// @ts-nocheck
"use server";

import { auth } from "@/auth";
import prisma from "./prisma";

export const getScoreCard = async (id: any) => {
  const session = await auth();
  if (!session) {
    return null;
  }
  const scores = await prisma.userSkill.findFirst({
    where: {
      userId: session.user.id,
      skillId: id,
    },
  });
  console.log("scores", scores);
  return scores;
};

export const markCompletedMilestones = async (milestoneName: string) => {
  const session = await auth();
  if (!session) {
    return null;
  }

  const existCompletedMilestone = await prisma.userProfile.findFirst({
    where: { userId: session.user.id },
    include: {
      completed: true,
    },
  });
  const isCompleted = existCompletedMilestone?.completed?.find(
    (milestone) => milestone.name === milestoneName
  );

  console.log("isCompleted", isCompleted);

  if (isCompleted) {
    return { messame: "Milestone already completed", isCompleted };
  }

  const upsertCompletion = await prisma.userProfile.upsert({
    where: {
      userId: session.user.id,
    },
    update: {
      // Update the existing completed milestone if it exists
      completed: {
        create: {
          name: milestoneName,
          completed: true,
        },
      },
    },
    create: {
      // Create a new user profile with the completed milestone if it doesn't exist
      userId: session.user.id,
      completed: {
        create: {
          name: milestoneName,
          completed: true,
        },
      },
    },
  });

  return upsertCompletion || "Something went wrong";
};
