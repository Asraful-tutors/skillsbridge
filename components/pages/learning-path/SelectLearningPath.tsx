"use client";

import { motion } from "framer-motion";

import { useAppSelector } from "@/lib/store/hooks";

import { Button } from "@/components/ui/button";

import PathsCard from "@/components/app/start/PathsCard";
import { paths } from "@/lib/data/path";

const staggerVariants = {
  visible: { opacity: 1, transition: { staggerChildren: 0.5, delay: 0.1 } },
  hidden: { opacity: 0 },
};

export default function SelectLearningPath({ onNext }: { onNext: () => void }) {
  const selectedPath = useAppSelector((state) => state.path.selectedPath);

  const isNextDisabled = !selectedPath?.career;

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      layout
      variants={staggerVariants}
      className="h-full flex flex-col items-center justify-center gap-[40px] "
    >
      <section className="space-y-1">
        <h1 className="header">Select your learning Path</h1>
        <p className="desc max-w-[633px] max-auto text-[#828282]">
          Lorem ipsum dolor sit amet consectetur. Dictumst tortor metus ut
          bibendum ut consectetur. Eu cras consectetur vestibulum ornare diam
          magna ac.
        </p>
      </section>
      <motion.section
        className="flex items-center justify-center flex-wrap gap-6"
        variants={staggerVariants}
      >
        {paths.map((path, key) => (
          <PathsCard
            key={key}
            // @ts-ignore
            img={path.img}
            career={path.career}
          />
        ))}
      </motion.section>

      <div className="w-full mx-auto flex items-center justify-center">
        <Button
          disabled={isNextDisabled}
          variant={"violate"}
          onClick={onNext}
          className="max-w-[284px] mx-auto"
        >
          Next
        </Button>
      </div>
    </motion.div>
  );
}
