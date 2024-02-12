import { motion } from "framer-motion";

import { HardSkill } from "@/lib/data/hardSkills";
import { useState } from "react";
import Image from "next/image";

export interface HardSkillCardProps extends HardSkill {
  onScaleClick: (selectedScale: number) => void;
}

export default function HardSkillsCard({
  name,
  onScaleClick,
}: HardSkillCardProps) {
  const [selectedScale, setSelectedScale] = useState(0);

  const handleScaleClick = (value: number) => {
    setSelectedScale(value);
    onScaleClick(value);
  };

  return (
    <motion.div className="p-8 rounded-2xl bg-white_background flex items-center flex-col md:flex-row gap-10 w-full md:min-w-[704px]">
      <section className="flex flex-1 items-center gap-2.5">
        <div className="w-16 h-16 rounded-md aspect-auto object-center object-cover bg-light_gray">
          {/* <Image
            src={}
            alt={title}
            width={64}
            height={64}
            className="w-16 rounded-md aspect-auto object-center object-cover"
          /> */}
        </div>
        <div className="flex flex-col">
          <h4 className="text-xl font-semibold leading-[150%] text-black">
            {name}
          </h4>
          {/* <p className="text-base font-normal leading-[150%] text-black text-opacity-50">
            {language.join(", ")}
          </p> */}
        </div>
      </section>
      <section className="flex flex-1 items-center gap-1.5">
        {/* scale */}
        {Array.from({ length: 5 }, (_, index) => index).map((value) => (
          <motion.div
            key={value}
            animate={{
              backgroundColor:
                selectedScale >= value + 1 ? "#9d64d6" : "#D9D9D9",
            }}
            className={`w-16 h-3 rounded-md cursor-pointer `}
            onClick={() => handleScaleClick(value + 1)}
          ></motion.div>
        ))}
      </section>
    </motion.div>
  );
}
