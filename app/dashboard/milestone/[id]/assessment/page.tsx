"use client";
import Loading from "@/app/loading";
import MileStoneAssessment from "@/components/app/dashboard/milestone/course/mileStoneAssessment";
import useUserPaths from "@/components/hooks/useUserPaths";
import { getQuestions } from "@/lib/backend/mileStoneCourses";
import { useAppSelector } from "@/lib/store/hooks";
import { useQuery } from "@tanstack/react-query";
import { useParams, useSearchParams } from "next/navigation";
import { useState } from "react";

export default function CoursePage() {
  const params = useParams();

  const user = useAppSelector((state) => state.user.userData);
  const { userPaths, userPathsLoading, userPathsError } = useUserPaths(user);

  const {
    data: questions,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["hardQNA"],
    queryFn: () => {
      // if (!user || !userPaths) {
      //   throw new Error("User ID is undefined");
      // }

      // @ts-ignore
      return getQuestions(params?.id);
    },

    enabled: !!params,
  });

  if (isLoading)
    return (
      <>
        <Loading />
      </>
    );

  if (isError) return <>Something went wrong</>;

  return (
    <div>
      <MileStoneAssessment
        // currentSkillType={currentSkillType}
        // setCurrentSkillType={setCurrentSkillType}
        // @ts-ignore
        questions={questions}
      />
    </div>
  );
}
