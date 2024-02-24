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
import { initialAssessment } from "@/lib/backend/initialqna";
import { useAppSelector } from "@/lib/store/hooks";
import { useRouter } from "next/navigation";

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
  options: QuestionOption[];
}
interface Question {
  question?: any;
  text?: string;
  data?: QuestionData;
}
export default function QuestionsPanel({
  questions,
  setCurrentSkillType,
  currentSkillType,
}: {
  questions: { questions: Question[] };
  setCurrentSkillType: any;
  currentSkillType: string;
}) {
  const user = useAppSelector((state) => state.user.userData);
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [isOptionSelected, setIsOptionSelected] = useState(false);

  // get the total number of questions
  const totalQuestions = questions?.questions?.length || 0;
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

  console.log("answers", answers);
  const handleNext = () => {
    if (isOptionSelected) {
      if (currentQuestion === questions?.questions?.length - 1) {
        // It's the last question, set another state for step 2
        if (user) {
          startTransition(() => {
            initialAssessment(user?.id, answers);
          });
        }

        setCurrentSkillType("soft");
        setAnswers([]);
        setCurrentQuestion(0);
      } else {
        setCurrentQuestion(currentQuestion + 1);
      }

      setIsOptionSelected(false);
    }
  };

  const handleBack = () => {
    setCurrentQuestion(currentQuestion - 1);
  };

  const isLastSoftQuestion =
    currentQuestion === questions?.questions?.length - 1 &&
    currentSkillType === "soft";

  if (!questions?.questions?.length) {
    return (
      <>
        <Loading />
      </>
    );
  }

  const currentQuestionData = questions?.questions[currentQuestion];
  return (
    <motion.div className="flex flex-col gap-16">
      <ProgressBar
        currentStep={currentQuestion}
        totalSteps={questions?.questions?.length}
      />
      <div className="flex flex-col gap-8">
        <p>
          Q: {currentQuestion + 1} of {remainingQuestions} questions remaining
        </p>
        <h2 className="text-black text-base font-semibold leading-[150%]">
          {currentSkillType !== "hard" ? (
            <>{currentQuestionData?.text}</>
          ) : (
            <>{currentQuestionData?.question?.text}</>
          )}
        </h2>
        {/* Add the question text above the answer choices */}
        <RadioGroup className="grid grid-cols-1 lg:grid-cols-2 gap-x-20 gap-y-7">
          {currentSkillType !== "hard" ? (
            <>
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
                        htmlFor={answer.text}
                        className="tracking-wide leading-3"
                      >
                        {answer.text}
                      </Label>
                    </div>
                  );
                }
              )}
            </>
          ) : (
            <>
              {currentQuestionData?.question?.data?.options.map(
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
                        className="tracking-wide leading-3"
                        htmlFor={answer.text}
                      >
                        {answer.text}
                      </Label>
                    </div>
                  );
                }
              )}
            </>
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
                  initialAssessment(user?.id, answers);
                });
              }
              setAnswers([]);
              router.push("/start/overview/assessment/profile");
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
  );
}
