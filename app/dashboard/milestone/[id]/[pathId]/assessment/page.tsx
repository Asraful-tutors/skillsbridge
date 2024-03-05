"use client";
import MileStoneAssessment from "@/components/app/dashboard/milestone/course/mileStoneAssessment";
import useUserPaths from "@/components/hooks/useUserPaths";
import { getQuestions } from "@/lib/backend/mileStoneCourses";
import { useAppSelector } from "@/lib/store/hooks";
import { useQuery } from "@tanstack/react-query";
import { useParams, useSearchParams } from "next/navigation";
import { useState } from "react";

export default function CoursePage() {
  const params = useParams();

  // Concatenate params.id and getmilestoneId and then format the path name
  const formattedPathName = `${params?.id} ${params?.pathId}`;
  const formattedSoftPathName = `Soft Scenario ${params?.pathId}`;

  const [currentSkillType, setCurrentSkillType] = useState("hard");
  const user = useAppSelector((state) => state.user.userData);
  const { userPaths, userPathsLoading, userPathsError } = useUserPaths(user);

  const {
    data: hardSkillQuestions,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["hardQNA"],
    queryFn: () => {
      if (!user || !userPaths) {
        throw new Error("User ID is undefined");
      }

      return getQuestions(formattedPathName);
    },

    enabled: !!userPaths,
  });

  const {
    data: softSkillQuestions,
    isLoading: isSoftSkillLoading,
    isError: isSoftSkillError,
  } = useQuery({
    queryKey: ["softQNA"],
    queryFn: () => {
      if (!user || !userPaths) {
        throw new Error("User ID is undefined");
      }
      return getQuestions(formattedSoftPathName);
    },

    enabled: !!userPaths,
  });
  return (
    <div>
      <MileStoneAssessment
        currentSkillType={currentSkillType}
        setCurrentSkillType={setCurrentSkillType}
        // @ts-ignore
        questions={
          currentSkillType === "hard"
            ? hardSkillQuestions || []
            : softSkillQuestions || []
        }
      />
    </div>
  );
}
