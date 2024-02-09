import { motion } from "framer-motion";

import { HardSkill } from "@/lib/data/hardSkills";
import Image from "next/image";
import { useState } from "react";

export interface HardSkillCardProps extends HardSkill {
  onScaleClick: (selectedScale: number) => void;
}

export default function HardSkillsCard({
  img,
  language,
  title,
  scale,
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
        {/* <Image
          src={}
          alt={title}
          width={64}
          height={64}
          className="w-16 rounded-md aspect-auto object-center object-cover"
        /> */}
        <div className="w-16 h-16 rounded-md aspect-auto object-center object-cover bg-gray-200"></div>
        <div className="flex flex-col">
          <h4 className="text-xl font-semibold leading-[150%] text-black">
            {title}
          </h4>
          {/* <p className="text-base font-normal leading-[150%] text-black text-opacity-50">
            {language.join(", ")}
          </p> */}
        </div>
      </section>
      <section className="flex flex-1 items-center gap-1.5">
        {/* scale */}
        {scale.values.map((value, index) => (
          <motion.div
            key={index}
            animate={{
              backgroundColor: selectedScale >= value ? "#9d64d6" : "#D9D9D9",
            }}
            className={`w-16 h-3 rounded-md cursor-pointer `}
            onClick={() => handleScaleClick(value)}
          ></motion.div>
        ))}
      </section>
    </motion.div>
  );
}
