"use client";
import { motion } from "framer-motion";

import { useAppSelector } from "@/lib/store/hooks";
import SkillAssessment from "../../SkillAssessment";
import ChartComponent from "./ChartComponent";

function calculateRating(percentage: any) {
  if (percentage >= 80) {
    return 5;
  } else if (percentage >= 60) {
    return 4;
  } else if (percentage >= 40) {
    return 3;
  } else if (percentage >= 20) {
    return 2;
  } else {
    return 1;
  }
}

export default function ProfileOverview() {
  const selectedHardSkills = useAppSelector(
    (state) => state.hardSkill.selectedSkills
  );
  const selectedSoftSkills = useAppSelector(
    (state) => state.softSkill.selectedSkills
  );

  const questions = useAppSelector(
    (state) => state.skillAssessmentSession.questions
  );
  const answers = useAppSelector(
    (state) => state.skillAssessmentSession.answers
  );

  const totalQuestions = questions.length;
  const correctCount = answers.filter(
    (answer) => answer.answer?.correct === true
  ).length;
  const accuracyPercentage = (correctCount / totalQuestions) * 100;

  const rating = calculateRating(accuracyPercentage);

  return (
    <motion.div className="flex flex-col gap-5">
      <h1 className="text-black font-bold text-2xl leading-[150%]">
        Skills Overview
      </h1>
      <SkillAssessment title="Hard Skills">
        <ChartComponent
          disableAnimation={false}
          data={selectedHardSkills}
          // @ts-ignore
          rating={rating}
        />
      </SkillAssessment>
      <SkillAssessment title="Soft Skills">
        <ChartComponent
          disableAnimation={false}
          data={selectedSoftSkills}
          // @ts-ignore
          rating={rating}
        />
      </SkillAssessment>
    </motion.div>
  );
}
