import { motion } from "framer-motion";

import Image from "next/image";
import { useState } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { setSelectedPath } from "@/lib/store/path/pathSlice";
import { LearningPath } from "@/lib/types/types";

const cardVariants = {
  selected: { backgroundColor: "#9d64d6" },
  unselected: { backgroundColor: "#dedfe3" },
};

export default function PathsCard({ img, career }: LearningPath) {
  const dispatch = useAppDispatch();
  const selectedPath = useAppSelector((state) => state.path.selectedPath);
  console.log("selectedPath", selectedPath);
  const isSelected = selectedPath?.career === career;

  const handleCardClick = () => {
    if (!isSelected) {
      dispatch(setSelectedPath({ img, career }));
    } else {
      dispatch(setSelectedPath(null));
    }
  };

  return (
    <motion.div
      variants={cardVariants}
      animate={isSelected ? "selected" : "unselected"}
      whileHover={{ scale: 1.05 }}
      onClick={handleCardClick}
      className="w-48 h-48 rounded-2xl  cursor-pointer bg-light_gray hover:bg-[#9d64d6] shadow py-7 flex flex-col justify-center items-center gap-3"
    >
      <div className=" w-[88px] bg-[#C7C7C7] rounded-sm">
        <Image
          src={"/images/game-artist.svg"}
          alt={career}
          width={64}
          height={64}
          loading="lazy"
          decoding="async"
          className="w-full aspect-auto object-center object-cover p-3"
        />
      </div>
      <p
        className={`desc ${
          isSelected ? "text-white" : "text-black text-opacity-80"
        }`}
      >
        {career}
      </p>
    </motion.div>
  );
}
