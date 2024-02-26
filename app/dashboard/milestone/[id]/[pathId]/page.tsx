"use client";
import Loading from "@/app/loading";
import IsEligable from "@/components/app/dashboard/milestone/IsEligable";
// import LockedMileStonePage from "@/components/app/dashboard/milestone/LockedMileStonePage";
import useUserPathSkills from "@/components/hooks/useUserPathSkills";
import useUserPaths from "@/components/hooks/useUserPaths";
import Breadcrumb from "@/components/shared/Breadcrumb";
import { useAppSelector } from "@/lib/store/hooks";
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
  const getmilestoneId = searchParams.get("p");
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

  if (userSkillsLoading || !userSkills || userPathsLoading)
    return (
      <>
        <Loading />
      </>
    );

  if (userSkillsError || userPathsError) return <>Something went wrong</>;

  /* const canTakeCourses = userSkills.skills.every(
    (skill) =>
      skill.score >= parseInt(params?.id as any, 10) &&
      parseInt(params?.id as any, 10) !== 1
  ); */

  return (
    <>
      <IsEligable
        //@ts-ignore
        userSkills={userSkills}
        userPaths={userPaths}
      />
    </>
  );
}
