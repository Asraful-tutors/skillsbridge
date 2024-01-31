import { motion } from "framer-motion";

import Image from "next/image";
import { useState } from "react";
import { SoftSkills } from "@/lib/data/softSkills";

export interface SoftSkillCardProps extends SoftSkills {
  onScaleClick: (selectedScale: number) => void;
}

export default function SoftSkillsCard({
  img,
  language,
  title,
  scale,
  onScaleClick,
}: SoftSkillCardProps) {
  const [selectedScale, setSelectedScale] = useState(0);

  const handleScaleClick = (value: number) => {
    setSelectedScale(value);
    onScaleClick(value);
  };
  return (
    <motion.div className="p-8 rounded-2xl bg-white_background flex items-center flex-wrap gap-10 w-full md:min-w-[704px]">
      <section className="flex flex-1 items-center gap-2.5">
        <Image
          src={img}
          alt={title}
          width={64}
          height={64}
          className="w-16 rounded-md aspect-auto object-center object-cover"
        />
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
