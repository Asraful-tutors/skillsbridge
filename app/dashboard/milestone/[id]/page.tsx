"use client";
import Loading from "@/app/loading";
import IsEligable from "@/components/app/dashboard/milestone/IsEligable";
// import LockedMileStonePage from "@/components/app/dashboard/milestone/LockedMileStonePage";
import useUserPathSkills from "@/components/hooks/useUserPathSkills";
import useUserPaths from "@/components/hooks/useUserPaths";
import Breadcrumb from "@/components/shared/Breadcrumb";
import { useAppSelector } from "@/lib/store/hooks";
import { useParams, useRouter } from "next/navigation";

export default function MileStonePage() {
  const params = useParams();
  const user = useAppSelector((state) => state.user.userData);

  const { userPaths, userPathsError, userPathsLoading } = useUserPaths(
    //@ts-ignore
    user?.id
  );
  const { userSkills, userSkillsLoading, userSkillsError } = useUserPathSkills(
    //@ts-ignore
    user?.id
  );
  console.log("userSkills", userSkills);

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
      <IsEligable userSkills={userSkills} userPaths={userPaths} />
    </>
  );
}
