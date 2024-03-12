// @ts-nocheck

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ProgressBar } from "@/components/shared/ProgressBar";
import Link from "next/link";
import { paths } from "@/lib/data/path";
import { useEffect, useState, useTransition } from "react";

import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { upsertSelectedAnswers } from "@/actions/assessment";
import Loading from "@/app/loading";
import {
  initialAssessment,
  mileStoneAssessment,
} from "@/lib/backend/initialqna";
import { useAppSelector } from "@/lib/store/hooks";
import { usePathname, useRouter } from "next/navigation";
import WhiteWrapper from "@/components/layout/WhiteWrapper";

interface QuestionOption {
  text: string;
  correct: boolean;
  points: number;
}
interface Answer {
  questionIndex: number;
  selectedOptionIndex: number;
  points: any;
}

export interface SkillScore {
  skillId: number;
  score: number;
}

interface QuestionData {
  type: string;
  options: any;
}
interface Question {
  question?: any;
  text?: string;
  data?: QuestionData;
}
export default function MileStoneAssessment({
  questions,
}: {
  questions: { questions: Question[] };
}) {
  const user = useAppSelector((state) => state.user.userData);
  const router = useRouter();
  const pathName = usePathname();
  const [isPending, startTransition] = useTransition();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [isOptionSelected, setIsOptionSelected] = useState(false);
  const [percentage, setPercentage] = useState([]);

  // get the total number of questions
  const totalQuestions = questions?.length || 0;
  const remainingQuestions = totalQuestions - currentQuestion - 1;

  const handleAnswer = (
    questionIndex: any,
    selectedOptionIndex: number,
    points: any
  ) => {
    // Check if the question already has an answer, if yes, remove it
    const updatedAnswers = answers.filter(
      (answer) => answer.questionIndex !== questionIndex
    );

    // Add the new answer
    updatedAnswers.push({ questionIndex, selectedOptionIndex, points });
    setAnswers(updatedAnswers);

    setIsOptionSelected(true);
  };

  const handleNext = () => {
    if (isOptionSelected) {
      setCurrentQuestion(currentQuestion + 1);

      setIsOptionSelected(false);
    }
  };

  const handleBack = () => {
    setCurrentQuestion(currentQuestion - 1);
  };

  const isLastSoftQuestion = currentQuestion === questions?.length - 1;

  if (!questions || questions?.length < 1) {
    return <Loading />;
  }

  const currentQuestionData = questions[currentQuestion];

  return (
    <motion.div className=" w-full h-full">
      <div className="h-[140px] md:h-[189px] bg-Moderate_violet z-10 w-screen "></div>
      <>
        <motion.div className="flex flex-col gap-16 max-w-7xl mx-auto bg-white_background px-6 py-8 lg:px-16 lg:py-10 -mt-20 rounded-xl border border-transparent">
          <ProgressBar
            currentStep={currentQuestion}
            totalSteps={questions?.length}
          />
          <div className="flex flex-col gap-8">
            <p>
              Q: {currentQuestion + 1} ({totalQuestions - currentQuestion}{" "}
              questions remaining)
            </p>
            <h2 className="text-black text-base font-semibold leading-[150%]">
              {currentQuestionData?.text}
            </h2>
            {/* Add the question text above the answer choices */}
            <RadioGroup className="grid grid-cols-1 lg:grid-cols-2 gap-x-20 gap-y-7">
              {currentQuestionData?.data?.options.map(
                (answer: QuestionOption, index: number) => {
                  return (
                    <div className="flex items-center space-x-2" key={index}>
                      <RadioGroupItem
                        type={currentQuestionData?.question?.data?.type}
                        onClick={() =>
                          handleAnswer(
                            currentQuestionData,
                            index,
                            answer.points
                          )
                        }
                        value={answer.text}
                        id={answer.text}
                      />
                      <Label
                        className="tracking-wide leading-5"
                        htmlFor={answer.text}
                      >
                        {answer.text}
                      </Label>
                    </div>
                  );
                }
              )}
            </RadioGroup>
          </div>
          <div className="flex items-center justify-between gap-10 py-5">
            <Button
              onClick={handleBack}
              disabled={currentQuestion === 0}
              variant={"outline"}
              className="max-w-[284px] w-full  border border-Moderate_violet"
            >
              Back
            </Button>

            {isLastSoftQuestion ? (
              <Button
                onClick={() => {
                  if (user) {
                    startTransition(() => {
                      mileStoneAssessment(answers);
                    });
                  }
                  setAnswers([]);
                  router.push(`${pathName}/score`);
                }}
                disabled={!isOptionSelected}
                variant={"violate"}
                className="max-w-[284px] w-full  border border-Moderate_violet"
              >
                Finish
              </Button>
            ) : (
              <Button
                onClick={handleNext}
                disabled={!isOptionSelected}
                variant={"violate"}
                className="max-w-[284px] w-full  border border-Moderate_violet"
              >
                Save & Next
              </Button>
            )}
          </div>
        </motion.div>
      </>
    </motion.div>
  );
}
