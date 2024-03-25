import { motion } from "framer-motion";
import { useAppSelector } from "@/lib/store/hooks";

import { Button } from "@/components/ui/button";
import SoftSkillsCard from "@/components/app/start/SoftSkillsCard";
import Link from "next/link";
import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getSoftSkillsForPath } from "@/actions/getLearningPaths";
import Loading from "@/app/loading";
import { upsertSoftSkills } from "@/actions/usersSkillsAssessment";

const staggerVariants = {
  visible: { opacity: 1, transition: { staggerChildren: 0.5, delay: 0.1 } },
  hidden: { opacity: 0 },
};

export default function SoftSkillsPage() {
  const user = useAppSelector((state) => state.user.userData);

  const [scaledSkills, setScaledSkills] = useState<
    { skillId: number; selfScore: number }[]
  >([]);

  const {
    data: softSkills,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["softSkills"],
    queryFn: () => getSoftSkillsForPath(),
  });

  const handleScaleClick = (skillId: number, selfScore: number) => {
    setScaledSkills((prevSkills) => [
      ...prevSkills.filter((skill) => skill.skillId !== skillId),
      { skillId, selfScore },
    ]);
  };

  const handleNextClick = async () => {
    if (!user) {
      console.error("User is not defined");
      return;
    }
    await upsertSoftSkills(user.id, scaledSkills);
  };

  const isNextDisabled = useMemo(() => {
    const scaledSkillsCount = scaledSkills.length;
    const totalSkillsCount = softSkills?.length || 0;
    return totalSkillsCount > 0 && scaledSkillsCount !== totalSkillsCount;
  }, [scaledSkills, softSkills]);

  if (isLoading)
    return (
      <>
        <Loading />
      </>
    );

  if (isError) return <>Something went wrong</>;
  return (
    <div className="flex flex-col items-center justify-center h-full w-full gap-10">
      <section className="space-y-1">
        <h1 className="header">Evaluate your level of Soft Skills</h1>
        <p className="desc text-[#616060] max-w-5xl mx-auto">
          Rate yourself from 1 to 10 in the following fields based on your
          perception. This self-reflection is crucial for personal growth and
          aligning you with the right journey.
        </p>
      </section>
      <motion.section
        className="grid grid-cols-1 gap-5"
        variants={staggerVariants}
      >
        {softSkills?.map((data: any, key: number) => (
          <SoftSkillsCard
            key={key}
            name={data.name}
            onScaleClick={(selfScore) => handleScaleClick(data.id, selfScore)}
          />
        ))}
      </motion.section>
      {isNextDisabled ? (
        <Button
          disabled={isNextDisabled}
          variant={"violate"}
          className="max-w-[284px] mx-auto"
        >
          Next
        </Button>
      ) : (
        <Button
          disabled={isNextDisabled}
          variant={"violate"}
          onClick={handleNextClick}
          className="max-w-[284px] mx-auto"
          asChild
        >
          <Link href={"/start/overview"}>Next</Link>
        </Button>
      )}
    </div>
  );
}
