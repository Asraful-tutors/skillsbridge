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
  const [percentage, setPercentage] = useState([]);

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

    const groupedPoints =
      currentSkillType !== "hard"
        ? currentQuestionData?.data?.options?.map((question) => question.points)
        : currentQuestionData?.question?.data?.options?.map(
            (question: any) => question.points
          );

    const options = currentQuestionData?.question?.data?.options || [];

    const softOptions = currentQuestionData?.data?.options || [];

    const selectedSkillPoints = options[selectedOptionIndex]?.points || [];

    const softSelectedSkillPoints =
      softOptions[selectedOptionIndex]?.points || [];

    const skillPoints = {};

    // Group points by skillId
    groupedPoints.forEach((pointArray) => {
      pointArray.forEach((point) => {
        const { skillId, points } = point;
        if (!skillPoints[skillId]) {
          skillPoints[skillId] = [];
        }
        skillPoints[skillId].push(points);
      });
    });

    // Find the maximum points for each skillId
    const skillMaxPoints = {};
    Object.keys(skillPoints).forEach((skillId) => {
      skillMaxPoints[skillId] = Math.max(...skillPoints[skillId]);
    });
    // Convert selectedSkillPoints to an object
    const selectedSkillPointsObject = selectedSkillPoints.reduce(
      (acc, point) => {
        acc[point.skillId] = point.points;
        return acc;
      },
      {}
    );

    // soft type
    const selectedSoftSkillPointsObject = softSelectedSkillPoints.reduce(
      (acc, point) => {
        acc[point.skillId] = point.points;
        return acc;
      },
      {}
    );

    // Calculate the percentage for each skill
    const skillPercentages = Object.keys(skillMaxPoints).map((skillId) => {
      const maxPoints = skillMaxPoints[skillId];
      const selectedPoints = selectedSkillPointsObject[skillId] || 0;
      const selectedSoftPoints = selectedSoftSkillPointsObject[skillId] || 0;
      let percentage;
      if (currentSkillType === "hard") {
        percentage = (selectedPoints / maxPoints) * 100;
      } else {
        percentage = (selectedSoftPoints / maxPoints) * 100;
      }

      return { questionIndex, skillId, percentage };
    });

    const updatedPercentage = percentage.filter(
      (item) => item.questionIndex !== questionIndex
    );

    // Add the new skillPercentages
    setPercentage([...updatedPercentage, ...skillPercentages]);

    // Add the new answer
    updatedAnswers.push({ questionIndex, selectedOptionIndex, points });
    setAnswers(updatedAnswers);

    setIsOptionSelected(true);
  };

  const handleNext = () => {
    if (isOptionSelected) {
      if (currentQuestion === questions?.questions?.length - 1) {
        // It's the last question, set another state for step 2
        if (user) {
          startTransition(() => {
            initialAssessment(percentage);
          });
        }

        setCurrentSkillType("soft");
        setAnswers([]);
        setPercentage([]);
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
                        className="tracking-wide leading-4"
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
                        className="tracking-wide leading-4"
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
                  initialAssessment(percentage);
                });
              }
              setPercentage([]);
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
