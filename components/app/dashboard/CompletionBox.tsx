"use client";

import React from "react";
import { Progress } from "@/components/ui/progress";
import { motion } from "framer-motion";
import { AnimatePresence } from "framer-motion";

export default function CompletionBox() {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ scale: 0, originX: 0, originY: 1 }}
        animate={{ scale: 1, originX: 1, originY: 0 }}
        transition={{ duration: 0.2 }}
        className="bg-gradient-to-b from-[#F0CB57] to-[#A97337] w-[156px] h-[65px] text-white p-[7px] rounded-t-2xl rounded-br-2xl absolute top-1/4 left-1/2 z-50 overflow-hidden"
      >
        <h3 className="text-xs font-semibold mb-[10px]">Earn points - 50</h3>
        <div className="text-xs flex flex-row justify-between mb-[2px]">
          <h3>Complete</h3>
          <h3>20%</h3>
        </div>
        <Progress
          value={33}
          indicatorColor="bg-gradient-to-b from-[#56FFA5] to-[#009546]"
          className="h-[8px] w-[138px] bg-[#CFD0D4]"
        />
      </motion.div>
    </AnimatePresence>
  );
}
