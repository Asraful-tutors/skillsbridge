// @ts-nocheck
"use server";

import { auth } from "@/auth";
import prisma from "./prisma";

export const getScoreCard = async (id: any) => {
  const session = await auth();
  if (!session) {
    return null;
  }
  const skillName = await prisma.skill.findFirst({
    where: {
      id: parseInt(id),
    },
  });

  return skillName;
};

export const markCompletedMilestones = async (milestoneId: string) => {
  const session = await auth();
  if (!session) {
    return null;
  }

  // Get the user ID from the session
  const userId = session.user.id;

  // Find the milestone by name
  const milestone = await prisma.milestone.findFirst({
    where: {
      id: parseInt(milestoneId),
    },
  });

  // If milestone not found, return an error message
  if (!milestone) {
    return "Milestone not found";
  }

  // Use upsert to mark the milestone as completed if not already completed
  const upsertCompletion = await prisma.userMilestone.upsert({
    where: {
      userId_milestoneId: {
        userId,
        milestoneId: milestone.id,
      },
    },
    update: {
      completed: true,
    },
    create: {
      userId,
      milestoneId: milestone.id,
      completed: true,
    },
  });

  return upsertCompletion || "Something went wrong";
};
