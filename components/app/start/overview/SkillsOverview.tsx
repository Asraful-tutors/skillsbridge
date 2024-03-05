"use client";
import { motion } from "framer-motion";

import SkillAssessment from "./SkillAssessment";
import { useAppSelector } from "@/lib/store/hooks";
import ChartComponent from "@/components/shared/ChartComponent";
import { useQuery } from "@tanstack/react-query";
import Loading from "@/app/loading";
import { getHardSkills, getSoftSkills } from "@/actions/overView";

export default function SkillsOverview() {
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

  const {
    data: userHardSkills,
    isLoading: userHoftSkillsLoading,
    isError: userHoftSkillsError,
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

  if (userSoftSkillsLoading || userHoftSkillsLoading)
    return (
      <>
        <Loading />
      </>
    );

  if (userSoftSkillsError || userHoftSkillsError)
    return <>Something went wrong</>;

  return (
    <motion.div className="flex flex-col gap-5">
      <h1 className="text-black font-bold text-2xl leading-[150%]">
        Skills Overview
      </h1>
      <SkillAssessment title="Hard Skills">
        <ChartComponent
          disableAnimation={true}
          // @ts-ignore
          data={userHardSkills || []}
        />
      </SkillAssessment>
      <SkillAssessment title="Soft Skills">
        <ChartComponent
          disableAnimation={true}
          // @ts-ignore
          data={userSoftSkills || []}
        />
      </SkillAssessment>
    </motion.div>
  );
}
