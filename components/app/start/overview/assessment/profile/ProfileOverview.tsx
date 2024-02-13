"use client";
import { motion } from "framer-motion";

import { useAppSelector } from "@/lib/store/hooks";
import SkillAssessment from "../../SkillAssessment";
import ChartComponent from "./ChartComponent";
import HardSkillsOverview from "@/components/shared/SkillsOverview";
import { useQuery } from "@tanstack/react-query";
import { getHardSkills, getSoftSkills } from "@/actions/overView";
import SkillsOverview from "@/components/shared/SkillsOverview";
import Loading from "@/app/loading";

export default function ProfileOverview() {
  const user = useAppSelector((state) => state.user.userData);
  const {
    data: userSoftSkills,
    isLoading: userSoftSkillsLoading,
    isError: userSoftSkillsError,
  } = useQuery({
    queryKey: ["user-softSkills"],
    queryFn: () => {
      if (!user || !user.id) {
        throw new Error("User ID is undefined");
      }
      return getSoftSkills(user?.id);
    },
    enabled: !!user,
  });
  console.log("userSoftSkills", userSoftSkills);
  const {
    data: userHardSkills,
    isLoading: userHardSkillsLoading,
    isError: userHardSkillsError,
  } = useQuery({
    queryKey: ["user-hardSkills"],
    queryFn: () => {
      if (!user || !user.id) {
        throw new Error("User ID is undefined");
      }
      return getHardSkills(user?.id);
    },
    enabled: !!user,
  });

  if (userHardSkillsLoading || userSoftSkillsLoading)
    return (
      <>
        <Loading />
      </>
    );

  if (userHardSkillsError || userSoftSkillsError)
    return <>Something went wrong</>;

  return (
    <motion.div className="flex flex-col gap-5">
      <h1 className="text-black font-bold text-2xl leading-[150%]">
        Skills Overview
      </h1>
      <SkillAssessment title="Hard Skills">
        <SkillsOverview
          disableAnimation={false}
          // @ts-ignore

          data={userHardSkills}
          // @ts-ignore
        />
      </SkillAssessment>
      <SkillAssessment title="Soft Skills">
        <SkillsOverview
          disableAnimation={false}
          // @ts-ignore

          data={userSoftSkills}
          // @ts-ignore
        />
      </SkillAssessment>
    </motion.div>
  );
}
