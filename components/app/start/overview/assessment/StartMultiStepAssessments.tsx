import WhiteWrapper from "@/components/layout/WhiteWrapper";
import { motion } from "framer-motion";
import Sidebar from "./Sidebar";
import QuestionsPanel from "./QuestionsPanel";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { useEffect } from "react";
import {
  setCurrentSkillType,
  setQuestions,
} from "@/lib/store/skillAssessmentSession/skillAssessmentSession";
import { hardSkillsAssessmentData } from "@/lib/data/skillAssessmentsSessions";
import { paths } from "@/lib/data/path";
import { useQuery } from "@tanstack/react-query";
import { getHardQuestions, getSoftQuestions } from "@/actions/assessment";
import useUserPaths from "@/components/hooks/useUserPaths";
import { startAssessment } from "@/lib/backend/assessment";

export default function StartMultiStepAssessments() {
  const user = useAppSelector((state) => state.user.userData);
  const { userPaths, userPathsLoading, userPathsError } = useUserPaths(user);
  const {
    data: hardSkillQuestions,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["hardQNA"],
    queryFn: () => {
      if (!user || !userPaths) {
        throw new Error("User ID is undefined");
      }
      return startAssessment(19);
    },

    enabled: !!userPaths,
  });
  console.log("hardSkillQuestions", hardSkillQuestions);

  const {
    data: softSkillQuestions,
    isLoading: isSoftSkillLoading,
    isError: isSoftSkillError,
  } = useQuery({
    queryKey: ["softQNA"],
    queryFn: () => {
      if (!user || !userPaths) {
        throw new Error("User ID is undefined");
      }
      return getSoftQuestions(userPaths?.path.id);
    },

    enabled: !!userPaths,
  });

  console.log(hardSkillQuestions);
  if (isLoading) return "Loading...";

  if (isError) return <>Something went wrong!</>;

  return (
    <motion.div>
      <div className="h-[140px] md:h-[189px] bg-Moderate_violet z-10 w-screen "></div>
      <motion.div className="grid grid-cols-1 lg:grid-cols-7 xl:grid-cols-5 gap-8 max-w-screen-2xl mx-auto -mt-20 px-6 py-4">
        {/* steps calculate */}
        <motion.div className="w-full mx-auto lg:col-span-2 xl:col-span-1">
          <WhiteWrapper>
            <Sidebar />
          </WhiteWrapper>
        </motion.div>
        {/* questions and answers with progressbar */}
        {/* <motion.div className="w-full lg:col-span-5 xl:col-span-4">
          <WhiteWrapper>
            <QuestionsPanel
              // @ts-ignore
              hardSkillQuestions={hardSkillQuestions || []}
              // @ts-ignore
              softSkillQuestions={softSkillQuestions || []}
            />
          </WhiteWrapper>
        </motion.div> */}
      </motion.div>
    </motion.div>
  );
}
