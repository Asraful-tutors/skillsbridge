"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RequiredSkillCard } from "@/components/shared/RequiredSkillCard";

interface MilestoneProps {
  available: boolean;
}

export default function Milestone_04({ available }: MilestoneProps) {
  
  // Temporary data to display the content properly until the backend is ready
  const skillsData = [
    {
      img: "/images/game-designer.svg",
      title: "Analytical Skills",
      language: ["C#", "C++", "Java Script"],
      scale: {
        values: [1, 2, 3, 4, 5],
        selected: 3,
        required: 5,
      },
      milestone: 2,
    },
    {
      img: "/images/game-designer.svg",
      title: "Adaptability",
      language: ["Unity", "Unreal Engine"],
      scale: {
        values: [1, 2, 3, 4, 5],
        selected: 2,
        required: 4,
      },
      milestone: 1,
    },
    {
      img: "/images/game-designer.svg",
      title: "Problem Solving",
      language: ["C#", "C++", "Java Script"],
      scale: {
        values: [1, 2, 3, 4, 5],
        selected: 5,
        required: 5,
      },
      milestone: 1,
    },
  ];

  return (
    <motion.div className="w-full text-black max-w-screen-2xl h-full my-8 rounded-2xl mx-auto grid grid-cols-1 xl:grid-cols-10 gap-12 xl:pr-0 bg-white_background">
      <div className="col-span-5 2xl:col-span-6 my-[77px] mx-12">
        <h4 className="text-base font-medium opacity-55 mb-2">Milestone 04</h4>
        <h1 className="text-[40px] font-bold mb-[18px]">JavaScript Algorithms and Data Structures</h1>
        <div className="flex flex-col mb-8">
          <h2 className="text-xl font-semibold mb-1.5 text-subheading">Overview</h2>
          <p className="text-base opacity-50">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. </p>
        </div>
        <div className="flex flex-col mb-[42px]">
          <h3 className="text-base font-medium mb-[9px]">Skills you'll learn</h3>
          <div className="flex flex-row gap-3 flex-wrap">
            <Badge className="rounded-full w-[134px] h-[37px] flex justify-center text-badge_text bg-arctic/[.56] text-sm shadow-none">Analytical skills</Badge>
            <Badge className="rounded-full w-[134px] h-[37px] flex justify-center text-badge_text bg-cadet_blue/[.56] text-sm shadow-none">Problem-Solving</Badge>
            <Badge className="rounded-full w-[134px] h-[37px] flex justify-center text-badge_text bg-pink/[.56] text-sm shadow-none">Critical Thinking</Badge>
            <Badge className="rounded-full w-[134px] h-[37px] flex justify-center text-badge_text bg-apricot/[.37] text-sm shadow-none">Adaptability</Badge>
          </div>
        </div>
        <Button
          /* onClick={} */
          variant={"violate"}
          className={`max-w-[284px] mx-auto ${available ? '' : 'cursor-not-allowed'}`}
          disabled={!available}
        >
          {available ? "Go to course" : 
            <p className="flex flex-row">
              <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="mr-2"
            >
                <path
                d="M18 8H17V6C17 3.24 14.76 1 12 1C9.24 1 7 3.24 7 6V8H6C4.9 8 4 8.9 4 10V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V10C20 8.9 19.1 8 18 8ZM9 6C9 4.34 10.34 3 12 3C13.66 3 15 4.34 15 6V8H9V6ZM18 20H6V10H18V20ZM12 17C13.1 17 14 16.1 14 15C14 13.9 13.1 13 12 13C10.9 13 10 13.9 10 15C10 16.1 10.9 17 12 17Z"
                fill="#F5F5F5"
                />
              </svg>
              Locked
            </p>
          }
        </Button>
      </div>
      <div className="col-span-5 2xl:col-span-4 bg-[#E2E2FE] flex flex-col items-center rounded-b-2xl xl:rounded-r-2xl py-[32px]">
        <div>
          <h2 className="mb-5 text-2xl font-bold">To unlock, you require</h2>
          <div className="flex flex-col items-center xl:items-start">
            {skillsData.map((skill, i) => (
              <RequiredSkillCard key={i} skill={skill}/>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
