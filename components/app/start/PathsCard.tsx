"use client";

import { motion } from "framer-motion";

import Image from "next/image";
import { useState } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { setSelectedPath } from "@/lib/store/path/pathSlice";
import { LearningPath } from "@/lib/types/types";
import { QueryClient } from "@tanstack/react-query";
import { updateUsersLearningPaths } from "@/actions/getLearningPaths";

export interface paths {
  userId: number;
  pathId: number;
  updates: any;
}

interface PathsCardProps {
  icon: string;
  name: string;
  id: number;
  onClick: () => void;
  isSelected: boolean;
}

const cardVariants = {
  selected: { backgroundColor: "#9d64d6" },
  unselected: { backgroundColor: "#dedfe3" },
};

export default function PathsCard({
  icon,
  name,
  id,
  onClick,
  isSelected,
}: PathsCardProps) {
  // const handleCardClick = async () => {
  //   console.log("Clicked on path:", name);
  //   console.log("Selected user:", user);

  //   const updates = {
  //     active: true,
  //   };

  //   if (!user) {
  //     console.error("User data is not available.");
  //     return;
  //   }

  //   try {
  //     console.log("Calling updateUserPath...");
  //     await updateUserPath({ userId: user.id, pathId: id, updates });
  //     console.log("Update successful!");
  //   } catch (error) {
  //     console.error("Error updating user path:", error);
  //   }
  // };

  return (
    <motion.div
      variants={cardVariants}
      onClick={onClick}
      animate={isSelected ? "selected" : "unselected"}
      whileHover={{ scale: 1.05 }}
      className="w-48 h-48 rounded-2xl  cursor-pointer bg-light_gray hover:bg-[#9d64d6] shadow py-7 flex flex-col justify-center items-center gap-3"
    >
      <div className="w-[88px] bg-[#C7C7C7] rounded-sm">
        <Image
          src={icon || "/images/game-artist.svg"}
          alt={name}
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
        {name}
      </p>
    </motion.div>
  );
}
