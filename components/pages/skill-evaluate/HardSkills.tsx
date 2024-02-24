import { motion } from "framer-motion";
import { useAppSelector } from "@/lib/store/hooks";

import { Button } from "@/components/ui/button";
import HardSkillsCard from "@/components/app/start/HardSkillsCard";
import { useQuery } from "@tanstack/react-query";
import useUserPaths from "@/components/hooks/useUserPaths";
import {
  getFilteredPaths,
  getHardSkillsForPath,
} from "@/actions/getLearningPaths";
import Loading from "@/app/loading";
import { useMemo, useState } from "react";
import { upsertHardSkills } from "@/actions/usersSkillsAssessment";

const staggerVariants = {
  visible: { opacity: 1, transition: { staggerChildren: 0.5, delay: 0.1 } },
  hidden: { opacity: 0 },
};

export default function HardSkillsPage({
  setCurrentStep,
}: {
  setCurrentStep: any;
}) {
  const user = useAppSelector((state) => state.user.userData);
  const { userPaths, userPathsLoading, userPathsError } = useUserPaths(user);

  const [scaledSkills, setScaledSkills] = useState<
    { skillId: number; selfScore: number }[]
  >([]);

  const nextStep = () => {
    setCurrentStep((prev: number) => prev + 1);
  };

  const {
    data: hardSkills,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["hardSkills"],
    queryFn: () => {
      if (!userPaths || !userPaths.path) {
        throw new Error("User paths or path ID is undefined");
      }
      return getHardSkillsForPath(userPaths.path.id);
    },
    enabled: !!userPaths,
  });
  console.log("hardSkills", hardSkills);

  const handleScaleClick = (skillId: number, selfScore: number) => {
    setScaledSkills((prevSkills) => [
      ...prevSkills.filter((skill) => skill.skillId !== skillId),
      { skillId, selfScore },
    ]);
  };
  console.log(scaledSkills);
  const handleNextClick = async () => {
    if (!user) {
      console.error("User is not defined");
      return;
    }
    // Upsert scaled skills
    await upsertHardSkills(user.id, scaledSkills).then(() => nextStep());
    // Continue with onNext logic
    // onNext()
  };

  const isNextDisabled = useMemo(() => {
    const scaledSkillsCount = scaledSkills.length;
    const totalSkillsCount = hardSkills?.length || 0;
    return scaledSkillsCount !== totalSkillsCount;
  }, [scaledSkills, hardSkills]);

  if (isLoading)
    return (
      <>
        <Loading />
      </>
    );

  if (isError) return <>Something went wrong</>;

  return (
    <motion.div
      layout
      className="flex flex-col items-center justify-center h-full w-full gap-10"
    >
      <section className="space-y-1">
        <h1 className="header">Evaluate your level of Hard Skills</h1>
        <p className="desc text-[#616060]">
          Your self-evaluation helps us tailor your learning experience to
          bridge gaps and enhance strengths.
        </p>
      </section>
      <motion.section className="grid grid-cols-1 gap-5 px-4">
        {hardSkills?.map((data: any, key: number) => (
          // @ts-ignore
          <HardSkillsCard
            key={key}
            id={data.id}
            name={data.name}
            onScaleClick={(selfScore) => handleScaleClick(data.id, selfScore)}
          />
        ))}
      </motion.section>

      <Button
        disabled={isNextDisabled}
        variant={"violate"}
        onClick={handleNextClick}
        className="w-[284px] mx-auto"
      >
        Next
      </Button>
    </motion.div>
  );
}
