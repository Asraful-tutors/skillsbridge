import { motion } from "framer-motion";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";

import { Button } from "@/components/ui/button";
import { HardSkill, hardSkills } from "@/lib/data/hardSkills";
import HardSkillsCard from "@/components/app/start/HardSkillsCard";
import { addSelectedSkill } from "@/lib/store/hardSkill/hardSkill";

const staggerVariants = {
  visible: { opacity: 1, transition: { staggerChildren: 0.5, delay: 0.1 } },
  hidden: { opacity: 0 },
};

export default function HardSkillsPage({ onNext }: { onNext: () => void }) {
  const dispatch = useAppDispatch();
  const selectedSkill = useAppSelector(
    (state) => state.hardSkill.selectedSkills
  );

  const handleScaleClick = (skill: HardSkill, selectedScale: number) => {
    dispatch(addSelectedSkill({ skill, selectedScale }));
  };

  const isNextDisabled = hardSkills.some((skill) => {
    const isSelected = selectedSkill.find((s) => s.skill === skill);
    return !isSelected || isSelected.selectedScale === 0;
  });

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      layout
      variants={staggerVariants}
      className="flex flex-col items-center justify-center h-full w-full gap-10"
    >
      <section className="space-y-1">
        <h1 className="header">Evaluate your level of Hard Skills</h1>
        <p className="desc text-[#616060]">
          Skillsbridge will tailor feedback to your role&apos;s communication
          needs
        </p>
      </section>
      <motion.section
        className="grid grid-cols-1 gap-5"
        variants={staggerVariants}
      >
        {hardSkills.map((skill, key) => (
          <HardSkillsCard
            key={key}
            {...skill}
            onScaleClick={(selectedScale) =>
              handleScaleClick(skill, selectedScale)
            }
          />
        ))}
      </motion.section>

      <Button
        disabled={isNextDisabled}
        variant={"violate"}
        onClick={onNext}
        className="max-w-[284px] mx-auto"
      >
        Next
      </Button>
    </motion.div>
  );
}
