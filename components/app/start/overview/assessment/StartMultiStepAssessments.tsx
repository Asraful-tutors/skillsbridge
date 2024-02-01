import WhiteWrapper from "@/components/layout/WhiteWrapper";
import { motion } from "framer-motion";
import Sidebar from "./Sidebar";
import QuestionsPanel from "./QuestionsPanel";
import { useAppDispatch } from "@/lib/store/hooks";
import { useEffect } from "react";
import {
  setCurrentSkillType,
  setQuestions,
} from "@/lib/store/skillAssessmentSession/skillAssessmentSession";
import { hardSkillsAssessmentData } from "@/lib/data/skillAssessmentsSessions";

export default function StartMultiStepAssessments() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(setQuestions(hardSkillsAssessmentData[0].questions));
    dispatch(setCurrentSkillType("hardSkills"));
  }, [dispatch]);

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
        <motion.div className="w-full lg:col-span-5 xl:col-span-4">
          <WhiteWrapper>
            <QuestionsPanel />
          </WhiteWrapper>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
