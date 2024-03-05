"use client";
import Loading from "@/app/loading";
import IsEligable from "@/components/app/dashboard/milestone/IsEligable";
// import LockedMileStonePage from "@/components/app/dashboard/milestone/LockedMileStonePage";
import useUserPathSkills from "@/components/hooks/useUserPathSkills";
import useUserPaths from "@/components/hooks/useUserPaths";
import Breadcrumb from "@/components/shared/Breadcrumb";
import { getMilestoneQuestions } from "@/lib/backend/mileStoneCourses";
import { useAppSelector } from "@/lib/store/hooks";
import { useQuery } from "@tanstack/react-query";
import { useParams, useRouter, useSearchParams } from "next/navigation";

// formate the params like Artist 1 from Artist?p=1
const formatPathName = (pathName: string): string => {
  // Replace underscores with spaces and convert to title case
  return pathName
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
};

export default function MileStonePage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const user = useAppSelector((state) => state.user.userData);

  // Concatenate params.id and getmilestoneId and then format the path name
  const formattedPathName = `${params?.id} ${params?.pathId}`;

  const { userPaths, userPathsError, userPathsLoading } = useUserPaths(
    //@ts-ignore
    user?.id
  );
  const { userSkills, userSkillsLoading, userSkillsError } = useUserPathSkills(
    //@ts-ignore
    user?.id,
    formattedPathName
  );

  console.log("", userSkills);

  const {
    data: milestone,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["milestone", params],
    queryFn: () => getMilestoneQuestions(formattedPathName, params?.pathId),
    enabled: !!formattedPathName,
  });

  if (isLoading || userPathsLoading)
    return (
      <>
        <Loading />
      </>
    );

  if (userSkillsError || userPathsError || isError)
    return <>Something went wrong</>;

  /* const canTakeCourses = userSkills.skills.every(
    (skill) =>
      skill.score >= parseInt(params?.id as any, 10) &&
      parseInt(params?.id as any, 10) !== 1
  ); */

  return (
    <>
      <IsEligable
        //@ts-ignore
        milestone={milestone}
        userPaths={userPaths}
      />
    </>
  );
}
