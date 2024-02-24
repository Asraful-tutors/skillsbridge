import { SkillsAccordion } from "./SkillsAccordion";
import { motion } from "framer-motion";
import { AnimatePresence } from "framer-motion";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronDownIcon } from "@radix-ui/react-icons";
import { useQuery } from "@tanstack/react-query";
import { getAllSortedHardSkills } from "@/lib/backend/GetUsersSkills";
import { useAppSelector } from "@/lib/store/hooks";
import prisma from "@/lib/backend/prisma";
import { auth } from "@/auth";

export default function SkillsBoard({ user }: { user: any }) {
  const [visible, setVisible] = useState(false);
  // const user = useAppSelector((state) => state.user.userData);

  const { data } = useQuery({
    queryKey: ["dashboard/hardskills"],
    queryFn: () => getAllSortedHardSkills(user.id),
  });

  console.log("data", data);

  return (
    <div>
      {/* <Button
      onClick={() => setVisible(!visible)}
      className="fixed z-50 right-2 sm:right-5 top-[100px] sm:top-[116px] p-2 bg-gradient-to-b from-[#B278FF] to-[#9D53FF]"
      >
        <ChevronDownIcon className={`h-10 w-10 transition-all duration-100 ease-in-out ${visible ? 'rotate-180' : ''}`} />
      </Button> */}
      <AnimatePresence>
<<<<<<< HEAD
        {
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: "auto" }}
            exit={{ height: 0 }}
            transition={{ duration: 0.1, ease: "easeInOut" }}
            className="fixed z-50 right-5 top-44 w-[467px] h-auto bg-white_background p-5 rounded-lg flex flex-col gap-5 overflow-hidden"
=======
        {visible && <motion.div
          initial={{ height: 0 }}
          animate={{ height: 'auto' }}
          exit={{ height: 0 }}
          transition={{ duration: 0.1, ease: 'easeInOut' }}
          className="fixed z-50 right-2 sm:right-5 top-[160px] sm:top-44 w-[467px] h-auto bg-white_background p-5 rounded-lg flex flex-col gap-5 overflow-hidden max-h-[400px] max-w-xs sm:max-w-lg overflow-y-scroll"
>>>>>>> 5da6066aa067880763820c696a8226c9fd754c72
          >
            <h3 className="header text-2xl text-start">Your skills</h3>
            <SkillsAccordion title="Hard Skills" data={data} />
            <SkillsAccordion title="Soft Skills" /* data */ />
          </motion.div>
        }
      </AnimatePresence>
    </div>
  );
}
