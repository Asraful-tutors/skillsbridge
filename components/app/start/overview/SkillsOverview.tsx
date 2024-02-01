"use client";
import { motion } from "framer-motion";

import SkillAssessment from "./SkillAssessment";
import { useAppSelector } from "@/lib/store/hooks";
import ChartComponent from "@/components/shared/ChartComponent";

export default function SkillsOverview() {
  const selectedHardSkills = useAppSelector(
    (state) => state.hardSkill.selectedSkills
  );
  const selectedSoftSkills = useAppSelector(
    (state) => state.softSkill.selectedSkills
  );

  console.log("selectedHardSkills", selectedHardSkills);
  return (
    <motion.div className="flex flex-col gap-5">
      <h1 className="text-black font-bold text-2xl leading-[150%]">
        Skills Overview
      </h1>
      <SkillAssessment title="Hard Skills">
        <ChartComponent disableAnimation={true} data={selectedHardSkills} />
      </SkillAssessment>
      <SkillAssessment title="Soft Skills">
        <ChartComponent disableAnimation={true} data={selectedSoftSkills} />
      </SkillAssessment>
    </motion.div>
  );
}
