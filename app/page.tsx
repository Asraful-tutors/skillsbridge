"use client";

import { motion } from "framer-motion";

import SignUp from "@/components/pages/auth/SignUp";
import SelectLearningPath from "@/components/pages/learning-path/SelectLearningPath";
import CookieDrawer from "@/components/shared/CookieDrawer";

const containerVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
};

export default function Home() {
  return (
    <motion.section
      className="bg-[#F9F9F7]"
      initial="initial"
      animate="animate"
      exit="exit"
      variants={containerVariants}
    >
      <CookieDrawer />
      <SignUp />
    </motion.section>
  );
}
