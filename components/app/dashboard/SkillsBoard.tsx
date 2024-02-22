import { SkillsAccordion } from "./SkillsAccordion";
import { motion } from "framer-motion";
import { AnimatePresence } from "framer-motion";
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { ChevronDownIcon } from "@radix-ui/react-icons";

export default function SkillsBoard() {
  const [visible, setVisible] = useState(false)

  return (
    <div>
      <Button
      onClick={() => setVisible(!visible)}
      className="fixed z-50 right-5 top-[116px] p-2 bg-gradient-to-b from-[#B278FF] to-[#9D53FF]"
      >
        <ChevronDownIcon className={`h-10 w-10 transition-all duration-100 ease-in-out ${visible ? 'rotate-180' : ''}`} />
      </Button>
      <AnimatePresence>
        {visible && <motion.div
          initial={{ height: 0 }}
          animate={{ height: 'auto' }}
          exit={{ height: 0 }}
          transition={{ duration: 0.1, ease: 'easeInOut' }}
          className="fixed z-50 right-5 top-44 w-[467px] h-auto bg-white_background p-5 rounded-lg flex flex-col gap-5 overflow-hidden"
          >
          <h3 className="header text-2xl text-start">Your skills</h3>
          <SkillsAccordion title="Hard Skills" /* data */ />
          <SkillsAccordion title="Soft Skills" /* data */ />
        </motion.div>}
      </AnimatePresence>
    </div>
  );
}
