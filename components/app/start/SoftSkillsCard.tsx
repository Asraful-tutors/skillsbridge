import { motion } from "framer-motion";

import Image from "next/image";
import { useState } from "react";
import { SoftSkills } from "@/lib/data/softSkills";

export interface SoftSkillCardProps extends SoftSkills {
  onScaleClick: (selectedScale: number) => void;
}

export default function SoftSkillsCard({
  name,
  onScaleClick,
}: SoftSkillCardProps) {
  const [selectedScale, setSelectedScale] = useState(0);

  const handleScaleClick = (value: number) => {
    setSelectedScale(value);
    onScaleClick(value);
  };
  return (
    <motion.div className="p-6 lg:p-8 rounded-2xl bg-white_background flex items-center flex-col gap-4 md:flex-row w-full md:min-w-[704px]">
      <section className="flex flex-1 items-center gap-2.5">
        <div className="flex flex-col">
          <h4 className="text-lg lg:text-xl font-semibold leading-[150%] text-black">
            {name}
          </h4>
        </div>
      </section>
      <section className="flex max-lg:flex-wrap flex-1 items-center gap-1.5">
        {/* scale */}
        {Array.from({ length: 10 }, (_, index) => index).map((value) => (
          <motion.div
            key={value}
            animate={{
              backgroundColor:
                selectedScale >= value + 1 ? "#9d64d6" : "#D9D9D9",
            }}
            className={`w-5 lg:w-16 h-3 rounded-md cursor-pointer `}
            onClick={() => handleScaleClick(value + 1)}
          ></motion.div>
        ))}
      </section>
    </motion.div>
  );
}
