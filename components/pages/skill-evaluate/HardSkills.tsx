import { motion } from "framer-motion";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";

import { Button } from "@/components/ui/button";
import { HardSkill, hardSkills } from "@/lib/data/hardSkills";
import HardSkillsCard from "@/components/app/start/HardSkillsCard";
import { addSelectedSkill } from "@/lib/store/hardSkill/hardSkill";
import { paths } from "@/lib/data/path";

const staggerVariants = {
  visible: { opacity: 1, transition: { staggerChildren: 0.5, delay: 0.1 } },
  hidden: { opacity: 0 },
};

export default function HardSkillsPage({ onNext }: { onNext: () => void }) {
  const dispatch = useAppDispatch();
  const selectedSkill = useAppSelector(
    (state) => state.hardSkill.selectedSkills
  );

  console.log("selectedSkill", selectedSkill);
  const { career } = useAppSelector((state) => state.path.selectedPath);

  // Finding the selected career in the paths array
  const selectedCareer = paths.find((path) => path.career === career);
  // Extracting the skills for the selected career
  const filteredHardSkills = selectedCareer
    ? selectedCareer.skills.map((skill) => ({
        img: "", // Set the appropriate image source
        title: skill.skill,
        scale: skill.scale,
      }))
    : [];

  const handleScaleClick = (skill: HardSkill, selectedScale: number) => {
    // Update the selected scale for the corresponding skill
    dispatch(addSelectedSkill({ skill, selectedScale }));
  };

  console.log("filteredHardSkills", filteredHardSkills);

  const isNextDisabled = !filteredHardSkills.every((skill) => {
    const isSelected = selectedSkill.find((s) => s.skill.title === skill.title);
    return isSelected && isSelected.selectedScale > 0;
  });
  return (
    <motion.div
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
        className="grid grid-cols-1 gap-5 px-4"
        variants={staggerVariants}
      >
        {filteredHardSkills.map((skill, key) => (
          <HardSkillsCard
            key={key}
            img={skill.img}
            title={skill.title}
            language={skill.language}
            scale={{
              values: skill.scale.values,
              selected: skill.scale.selected,
            }}
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
        className="w-[284px] mx-auto"
      >
        Next
      </Button>
    </motion.div>
  );
}
