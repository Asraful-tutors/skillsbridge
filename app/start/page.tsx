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
        return <SelectLearningPath setCurrentStep={setCurrentStep} />;
      case 2:
        return <HardSkillsPage setCurrentStep={setCurrentStep} />;
      case 3:
        return <SoftSkills />;

      default:
        return null;
    }
  };

  return (
    <motion.div className="grid place-content-center h-full md:min-h-[75dvh] w-full py-8">
      {renderCurrentStep()}
    </motion.div>
  );
}

export default StartPage;