"use client";

import { motion } from "framer-motion";

import { useAppSelector } from "@/lib/store/hooks";

import { Button } from "@/components/ui/button";

import PathsCard from "@/components/app/start/PathsCard";
// import { paths } from "@/lib/data/path";
import {
  getLearningPaths,
  getUserSelectedPaths,
  updateUsersLearningPaths,
} from "@/actions/getLearningPaths";
import { useQuery } from "@tanstack/react-query";
import Loading from "@/app/loading";
import { useEffect, useState } from "react";
import { LearningPath } from "@/lib/types/types";

const staggerVariants = {
  visible: { opacity: 1, transition: { staggerChildren: 0.5, delay: 0.1 } },
  hidden: { opacity: 0 },
};

export const getPaths = async () => {
  const res = await getLearningPaths();
  return res;
};

export default function SelectLearningPath({
  setCurrentStep,
}: {
  setCurrentStep: any;
}) {
  const user = useAppSelector((state) => state.user.userData);
  const [selectedPath, setSelectedPath] = useState<LearningPath | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isNextDisabled = !selectedPath;

  const nextStep = () => {
    setCurrentStep((prev: number) => prev + 1);
  };

  const handlePathClick = (path: LearningPath) => {
    setSelectedPath((prevPath) => (prevPath?.id === path.id ? null : path));
  };

  const handleNextClick = async () => {
    if (!selectedPath || !user) {
      console.error("No path selected.");
      return;
    }

    const updates = {
      active: true,
      selfScore: 0,
      completion: 0,
    };

    setIsLoading(true);

    try {
      if (userPaths && userPaths.pathId) {
        // User has already selected a path, update the existing path
        await updateUsersLearningPaths(user.id, selectedPath.id, updates);
      } else {
        // User is selecting a path for the first time
        await updateUsersLearningPaths(user.id, selectedPath.id, updates);
      }
      setIsLoading(false);
    } catch (error) {
      console.error("Error updating user path:", error);
      setError("Error updating user path");
    } finally {
      setIsLoading(false);
      nextStep();
    }
  };

  const {
    data: paths,
    isLoading: PathsLoading,
    isError,
  } = useQuery({
    queryKey: ["paths"],
    queryFn: getPaths,
  });

  const {
    data: userPaths,
    isLoading: userPathsLoading,
    isError: userPathsError,
  } = useQuery({
    queryKey: ["userPaths"],
    queryFn: () =>
      user ? getUserSelectedPaths(user.id) : Promise.resolve(null),
    enabled: !!user,
  });

  useEffect(() => {
    // Check if the user has a selected path in the database
    if (user && userPaths && userPaths.pathId) {
      const userSelectedPath = paths?.find(
        (path: any) => path.id === userPaths.pathId
      );

      if (userSelectedPath) {
        setSelectedPath(userSelectedPath);
      }
    }
  }, [user, paths, userPaths]);

  if (PathsLoading)
    return (
      <>
        <Loading />
      </>
    );

  if (isError) return <>Something went wrong</>;

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      layout
      variants={staggerVariants}
      className="h-full flex flex-col items-center justify-center gap-[40px] "
    >
      <section className="space-y-1">
        <h1 className="max-lg:text-2xl header">Select your learning Path</h1>
        <p className="max-lg:text-sm desc max-w-[633px] max-auto text-[#828282]">
          Get guided through tailored study materials and skill assessments. And
          if your goals evolve, switching paths is simple. Your journey, your
          choice.
        </p>
      </section>
      <motion.section
        className="flex items-center justify-center flex-wrap gap-4 lg:gap-6"
        variants={staggerVariants}
      >
        {paths?.map((path: any, key: number) => (
          <PathsCard
            key={key}
            id={path.id}
            icon={path.icon || ""}
            name={path.name || ""}
            onClick={() => handlePathClick(path)}
            isSelected={selectedPath?.id === path.id}
          />
        ))}
      </motion.section>

      <div className="w-full mx-auto flex items-center justify-center">
        <Button
          disabled={isNextDisabled}
          variant={"violate"}
          onClick={handleNextClick}
          className="max-w-[284px] mx-auto"
        >
          Next
        </Button>
      </div>
    </motion.div>
  );
}
