"use client";
import { motion } from "framer-motion";

export default function WhiteWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <motion.div
      layout
      initial={{
        opacity: 0,
      }}
      animate={{
        opacity: 1,
      }}
      exit={{
        opacity: 0,
      }}
      transition={{
        duration: 0.5,
        ease: "easeInOut",
      }}
      className="bg-white_background py-6 lg:py-10 px-4 lg:px-[38px] rounded-md lg:rounded-2xl w-auto"
    >
      {children}
    </motion.div>
  );
}
