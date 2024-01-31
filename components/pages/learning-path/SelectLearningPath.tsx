"use client";

import PathsCard from "@/components/app/start/PathsCard";
import { Button } from "@/components/ui/button";
import { LearningPaths } from "@/lib/data/learning-paths";
import { motion } from "framer-motion";
import Link from "next/link";
import { useState } from "react";

const staggerVariants = {
  visible: { opacity: 1, transition: { staggerChildren: 0.5, delay: 0.1 } },
  hidden: { opacity: 0 },
};

export default function SelectLearningPath() {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={staggerVariants}
      className="h-full flex flex-col items-center justify-center gap-[40px] "
    >
      <section className="space-y-1">
        <h1 className="header">Select your learning Path</h1>
        <p className="desc max-w-[633px] max-auto">
          Lorem ipsum dolor sit amet consectetur. Dictumst tortor metus ut
          bibendum ut consectetur. Eu cras consectetur vestibulum ornare diam
          magna ac.
        </p>
      </section>
      <motion.section
        className="flex items-center flex-wrap gap-6"
        variants={staggerVariants}
      >
        {LearningPaths.map((path, key) => (
          <PathsCard key={key} {...path} />
        ))}
      </motion.section>

      <Button asChild variant={"violate"} className="max-w-[284px] mx-auto">
        <Link href="/start">Next</Link>
      </Button>
    </motion.div>
  );
}
