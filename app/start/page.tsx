"use client";
import React, { useState } from "react";

import { motion } from "framer-motion";

import HardSkillsPage from "@/components/pages/skill-evaluate/HardSkills";
import SoftSkills from "@/components/pages/skill-evaluate/SoftSkills";
import SelectLearningPath from "@/components/pages/learning-path/SelectLearningPath";

function StartPage() {
  const [currentStep, setCurrentStep] = useState(1);

  const handleNext = () => {
    setCurrentStep((prev) => prev + 1);
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return <SelectLearningPath onNext={handleNext} />;
      case 2:
        return <HardSkillsPage onNext={handleNext} />;
      case 3:
        return <SoftSkills onNext={handleNext} />;

      default:
        return null;
    }
  };

  return (
    <motion.div
      layout
      initial={{
        opacity: 0,
      }}
      animate={{
        opacity: 1,
      }}
      exit={{
        opacity: 0,
      }}
      transition={{
        duration: 0.5,
        ease: "easeInOut",
      }}
      className="grid place-content-center h-full md:min-h-[75dvh] w-full"
    >
      {renderCurrentStep()}
    </motion.div>
  );
}

export default StartPage;
