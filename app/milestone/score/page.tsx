"use client";

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button";
import { useAppSelector } from "@/lib/store/hooks";
import { SkillCard } from "@/components/shared/SkillCard";
import { ProgressGauge } from "@/components/shared/ProgressGauge";

export default function Milestone_01() {

  // Temporary data to display the content properly until the backend is ready
  const skillsData = [
    {
      img: "/images/game-designer.svg",
      title: "Analytical Skills",
      language: ["C#", "C++", "Java Script"],
      scale: {
        values: [1, 2, 3, 4, 5],
        selected: 3,
        new: 5,
      },
    },
    {
      img: "/images/game-designer.svg",
      title: "Adaptability",
      language: ["Unity", "Unreal Engine"],
      scale: {
        values: [1, 2, 3, 4, 5],
        selected: 2,
        new: 4,
      },
    },
    {
      img: "/images/game-designer.svg",
      title: "Problem Solving",
      language: ["C#", "C++", "Java Script"],
      scale: {
        values: [1, 2, 3, 4, 5],
        selected: 5,
        new: 5,
      },
    },
  ];

  const score = {
    total: 50,
    correct: 42,
    wrong: 8,
  }

  return (
    <motion.div className="w-full text-black max-w-screen-2xl h-full my-8 rounded-2xl mx-auto grid grid-cols-1 xl:grid-cols-2 gap-12 py-[34px] px-[52px] bg-white_background">
      <div className="xl:col-span-2 border-b-[1px] border-[#B1ABAB] w-full">
        <h1 className="text-2xl font-bold m-6">Scorecard</h1>
      </div>
      <div className="flex flex-col items-center xl:items-start">
        {skillsData.map((skill, i) => (
          <SkillCard key={i} skill={skill}/>
        ))}
      </div>
      <div className="flex flex-col items-center">
        <ProgressGauge score={score} />
        <Button
          /* onClick={} */
          variant={"violate"}
          className="max-w-[284px] mt-[83px]"
        >
          Next
        </Button>
      </div>
    </motion.div>
  );
}
