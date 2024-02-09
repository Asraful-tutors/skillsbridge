"use client";

import StartAssessment from "@/components/app/start/overview/assessment/StartAssessment";
import StartMultiStepAssessments from "@/components/app/start/overview/assessment/StartMultiStepAssessments";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";

export default function SkillAssessmentPage() {
  const [showStartAssessment, setShowStartAssessment] = useState(true);

  const handleNextButtonClick = () => {
    setShowStartAssessment(!showStartAssessment);
  };
  return (
    <div className="">
      <div className="w-fit mx-auto h-full">
        {showStartAssessment ? (
          <motion.div
            key="startAssessment"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="py-8"
          >
            <StartAssessment onNextButtonClick={handleNextButtonClick} />
          </motion.div>
        ) : (
          <motion.div
            key="startMultiStepAssessments"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <StartMultiStepAssessments />
          </motion.div>
        )}
      </div>
    </div>
  );
}
