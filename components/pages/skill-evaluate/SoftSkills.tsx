import { motion } from "framer-motion";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";

import { Button } from "@/components/ui/button";
import { SoftSkills, softSkills } from "@/lib/data/softSkills";
import SoftSkillsCard from "@/components/app/start/SoftSkillsCard";
import { addSelectedSkill } from "@/lib/store/softSkill/softSkill";
import Link from "next/link";

const staggerVariants = {
  visible: { opacity: 1, transition: { staggerChildren: 0.5, delay: 0.1 } },
  hidden: { opacity: 0 },
};

export default function SoftSkillsPage({ onNext }: { onNext: () => void }) {
  const dispatch = useAppDispatch();
  const selectedSkill = useAppSelector(
    (state) => state.softSkill.selectedSkills
  );

  const handleScaleClick = (skill: SoftSkills, selectedScale: number) => {
    dispatch(addSelectedSkill({ skill, selectedScale }));
  };

  const isNextDisabled = softSkills.some((skill) => {
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
        <h1 className="header">Evaluate your level of Soft Skills</h1>
        <p className="desc text-[#616060]">
          Skillsbridge will tailor feedback to your role&apos;s communication
          needs
        </p>
      </section>
      <motion.section
        className="grid grid-cols-1 gap-5"
        variants={staggerVariants}
      >
        {softSkills.map((skill, key) => (
          <SoftSkillsCard
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
        asChild
      >
        <Link href={"/start/overview"}>Next</Link>
      </Button>
    </motion.div>
  );
}
