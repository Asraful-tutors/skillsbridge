import { motion } from "framer-motion";

import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import {
  addSelectedAnswer,
  setCurrentStep,
} from "@/lib/store/skillAssessmentSession/skillAssessmentSession";
import { Button } from "@/components/ui/button";

export default function QuestionsPanel() {
  const dispatch = useAppDispatch();
  const questions = useAppSelector(
    (state) => state.skillAssessmentSession.questions
  );
  const currentStep = useAppSelector(
    (state) => state.skillAssessmentSession.currentStep
  );

  const handleAnswerSelection = (question: string, answer: any) => {
    dispatch(addSelectedAnswer({ question, answer }));
  };

  const handleNext = () => {
    dispatch(setCurrentStep(currentStep + 1));
  };

  const handleBack = () => {
    dispatch(setCurrentStep(currentStep - 1));
  };

  const currentQuestion = questions[currentStep];
  if (!currentQuestion) {
    return <div>No questions available for the current step.</div>;
  }

  return (
    <motion.div className="flex flex-col gap-16">
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

      <div className="flex items-center justify-between gap-10 py-5">
        <Button
          onClick={handleBack}
          disabled={currentStep === 0}
          variant={"outline"}
          className="max-w-[284px] w-full  border border-Moderate_violet"
        >
          Back
        </Button>
        <Button
          onClick={handleNext}
          variant={"violate"}
          disabled={currentStep === questions.length - 1}
          className="max-w-[284px] w-full  border border-Moderate_violet"
        >
          Save & Next
        </Button>
      </div>
    </motion.div>
  );
}
