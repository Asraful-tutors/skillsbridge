import { motion } from "framer-motion";

import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import {
  addSelectedAnswer,
  setCurrentSkillType,
  setCurrentStep,
  setQuestions,
} from "@/lib/store/skillAssessmentSession/skillAssessmentSession";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";
import { paths } from "@/lib/data/path";
import Link from "next/link";
import { ProgressBar } from "@/components/shared/ProgressBar";

export default function QuestionsPanel({
  selectedCareer,
}: {
  selectedCareer: any;
}) {
  const dispatch = useAppDispatch();
  const questions = useAppSelector(
    (state) => state.skillAssessmentSession.questions
  );
  const currentStep = useAppSelector(
    (state) => state.skillAssessmentSession.currentStep
  );

  const currentSkillType = useAppSelector(
    (state) => state.skillAssessmentSession.currentSkillType
  );

  useEffect(() => {
    // Find the selected career in your paths array
    const selectedCareerData = paths.find(
      (data) => data.career === selectedCareer?.career
    );
    console.log("selectedCareerData", selectedCareerData);

    if (selectedCareerData) {
      const allQuestions = selectedCareerData.skills.reduce(
        (
          acc: {
            question: string;
            type: string; // Add the type information
            answers: { text: string; correct: boolean }[];
          }[],
          skill
        ) => {
          const skillQuestions = skill.questions.map((question: any) => ({
            question: question.question,
            type: selectedCareerData.type, // Set the type for each question
            answers: question.answers,
          }));
          return [...acc, ...skillQuestions];
        },
        []
      );

      dispatch(setQuestions(allQuestions));
      dispatch(setCurrentSkillType(selectedCareerData.type as any));
    }
  }, [dispatch, selectedCareer]);

  const handleAnswerSelection = (question: string, answer: any) => {
    dispatch(addSelectedAnswer({ question, answer }));
  };

  const handleNext = () => {
    if (currentStep === questions.length - 1) {
      if (currentSkillType === "hard") {
        dispatch(setCurrentSkillType("soft"));

        const softQuestions = paths
          .filter((skill: any) => skill.type !== "hard")
          .flatMap((skill: any) => skill.skills)
          .flatMap((skill: any) => skill.questions);

        // Set the questions for "soft" skills
        dispatch(setQuestions(softQuestions));
        dispatch(setCurrentStep(0));
      } else {
        alert("Assessment finished!");
      }
    } else {
      // Reset the selected answer when moving to the next question
      dispatch(
        addSelectedAnswer({ question: currentQuestion.question, answer: null })
      );

      // Move to the next question for "hard" skills
      dispatch(setCurrentStep(currentStep + 1));
    }
  };

  const handleBack = () => {
    dispatch(setCurrentStep(currentStep - 1));
  };

  const currentQuestion = questions[currentStep];
  console.log("currentStep", currentStep);
  console.log("currentSkillType", currentSkillType);
  console.log("currentQuestion", currentQuestion);

  if (!currentQuestion) {
    return <div>No questions available for the current step.</div>;
  }

  return (
    <motion.div className="flex flex-col gap-16">
      <ProgressBar currentStep={currentStep} totalSteps={questions.length} />
      <div className="flex flex-col gap-8">
        <p>
          {" "}
          Q: {currentStep + 1} ({questions.length - currentStep - 1} questions
          are remaining)
        </p>
        <h2 className="text-black text-base font-semibold leading-[150%]">
          {currentQuestion.question}
        </h2>
        <ul className="grid grid-cols-1 lg:grid-cols-2 gap-x-20 gap-y-7">
          {currentQuestion.answers.map((answer: any, index: number) => (
            <li key={index}>
              <label
                htmlFor={answer.text}
                className="text-black text-base font-semibold leading-[150%] flex items-center gap-2"
              >
                <input
                  type="radio"
                  name="answer"
                  id={answer.text}
                  value={answer.text}
                  onChange={() =>
                    handleAnswerSelection(currentQuestion.question, answer)
                  }
                />
                {answer.text}
              </label>
            </li>
          ))}
        </ul>
      </div>

      <div className="flex items-center justify-between gap-10 py-5">
        <Button
          onClick={handleBack}
          disabled={currentStep === 0}
          variant={"outline"}
          className="max-w-[284px] w-full  border border-Moderate_violet"
        >
          Back
        </Button>

        {currentSkillType === "soft" && currentStep === questions.length - 1 ? (
          // Render a link or navigate directly using onClick
          <Button
            variant={"violate"}
            asChild
            className="max-w-[284px] w-full border border-Moderate_violet"
          >
            <Link href={"/start/overview/assessment/profile"}>Finish</Link>
          </Button>
        ) : (
          <Button
            onClick={handleNext}
            variant={"violate"}
            className="max-w-[284px] w-full  border border-Moderate_violet"
          >
            Save & Next
          </Button>
        )}
      </div>
    </motion.div>
  );
}
