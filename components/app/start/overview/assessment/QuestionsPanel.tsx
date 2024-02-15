import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ProgressBar } from "@/components/shared/ProgressBar";
import Link from "next/link";
import { paths } from "@/lib/data/path";
import { useEffect, useState } from "react";

import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { upsertSelectedAnswers } from "@/actions/assessment";

interface QuestionOption {
  text: string;
  correct: boolean;
}
interface SelectedAnswers {
  [key: string]: {
    answer: QuestionOption;
    questionId: number;
    skillId: number;
  };
}

export interface SkillScore {
  skillId: number;
  score: number; // Score out of 5
  // Add other properties as needed, e.g., totalQuestions, correctAnswers
}
interface Question {
  text: string;
  options: QuestionOption[];
  id: number; // Add this line
  skillId: number;
  // Include other properties of the question if needed
}
export default function QuestionsPanel({
  hardSkillQuestions,
  softSkillQuestions,
}: {
  hardSkillQuestions: Question[];
  softSkillQuestions: Question[];
}) {
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [softQuizCompleted, setSoftQuizCompleted] = useState(false);
  const [currentSkillQuestions, setCurrentSkillQuestions] =
    useState(hardSkillQuestions);
  const [currentStep, setCurrentStep] = useState(0);
  const [currentSkillType, setCurrentSkillType] = useState("hard");
  const [selectedAnswers, setSelectedAnswers] = useState<SelectedAnswers>({});
  const [skillScores, setSkillScores] = useState<SkillScore[]>([]);

  useEffect(() => {
    if (currentSkillType === "hard") {
      setCurrentSkillQuestions(hardSkillQuestions);
    } else {
      setCurrentSkillQuestions(softSkillQuestions);
    }
  }, [currentSkillType, hardSkillQuestions, softSkillQuestions]);

  const formatSelectedAnswersAndCalculateScores = () => {
    const formattedAnswers: {
      [key: number]: { correctAnswers: number; totalQuestions: number };
    } = {};
    const skillScoresData: SkillScore[] = [];

    for (const [, answerData] of Object.entries(selectedAnswers)) {
      const { skillId, questionId } = answerData;
      formattedAnswers[skillId] = formattedAnswers[skillId] || {
        correctAnswers: 0,
        totalQuestions: 0,
      };

      if (answerData.answer.correct) {
        formattedAnswers[skillId].correctAnswers++;
      }
      formattedAnswers[skillId].totalQuestions++;
    }

    for (const [skillId, answerData] of Object.entries(formattedAnswers)) {
      // Round the score to the nearest integer
      const score = Math.round(
        (answerData.correctAnswers / answerData.totalQuestions) * 5
      );
      skillScoresData.push({ skillId: parseInt(skillId), score });
    }

    setSkillScores(skillScoresData);
  };

  const handleAnswerSelection = (
    questionText: string,
    answer: QuestionOption,
    questionId: number,
    skillId: number
  ) => {
    setSelectedAnswers((prevAnswers) => ({
      ...prevAnswers,
      [questionText]: { answer, questionId, skillId },
    }));
  };

  const handleNext = async () => {
    if (currentStep === currentSkillQuestions.length - 1) {
      if (currentSkillType === "hard") {
        setCurrentSkillType("soft");
        setCurrentStep(0);
        // Reset selected answers when moving to the next set of questions
        formatSelectedAnswersAndCalculateScores();
        setSelectedAnswers({});
        setQuizCompleted(true);
      } else {
        // Here, you can fetch the soft questions and answers
        setCurrentSkillQuestions(softSkillQuestions);
        setCurrentStep(0);
        // Reset selected answers when moving to the next set of questions
        formatSelectedAnswersAndCalculateScores();
        setSelectedAnswers({});
        setSoftQuizCompleted(true);
      }
    } else {
      setCurrentStep((prevStep) => prevStep + 1);
    }
  };

  useEffect(() => {
    // This useEffect will run whenever skillScores is updated or the quiz is completed
    if (quizCompleted || currentSkillType !== "hard") {
      upsertSelectedAnswers(skillScores).then(() => {
        console.log("API call completed for hard skill");
      });
      setSkillScores([]);
    }
  }, [quizCompleted]);

  useEffect(() => {
    if (softQuizCompleted && currentSkillType === "soft") {
      upsertSelectedAnswers(skillScores).then(() => {
        console.log("API call completed for soft skill");
      });
      setSkillScores([]);
    }
  }, [softQuizCompleted, skillScores, currentSkillType]);
  const handleBack = () => {
    setCurrentStep((prevStep) => Math.max(0, prevStep - 1));
  };

  if (
    !currentSkillQuestions ||
    !Array.isArray(currentSkillQuestions) ||
    currentSkillQuestions.length === 0
  ) {
    return <div>Loading or no questions available.</div>;
  }

  const currentQuestion = currentSkillQuestions[currentStep];

  if (!currentQuestion) {
    return <div>No questions available for the current step.</div>;
  }

  return (
    <motion.div className="flex flex-col gap-16">
      <ProgressBar
        currentStep={currentStep}
        totalSteps={currentSkillQuestions.length}
      />
      <div className="flex flex-col gap-8">
        <p>
          {" "}
          Q: {currentStep + 1} ({currentSkillQuestions.length - currentStep - 1}{" "}
          questions are remaining)
        </p>
        <h2 className="text-black text-base font-semibold leading-[150%]">
          {currentQuestion.text}
        </h2>
        {/* Add the question text above the answer choices */}
        <RadioGroup className="grid grid-cols-1 lg:grid-cols-2 gap-x-20 gap-y-7">
          {currentQuestion.options.map((answer, index) => (
            <div className="flex items-center space-x-2" key={index}>
              <RadioGroupItem
                onClick={() =>
                  handleAnswerSelection(
                    currentQuestion.text,
                    answer,
                    currentQuestion.id,
                    currentQuestion.skillId
                  )
                }
                value={answer.text}
                id={answer.text}
              />
              <Label htmlFor={answer.text}>{answer.text}</Label>
            </div>
          ))}
        </RadioGroup>
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

        {currentSkillType === "soft" &&
        currentStep === currentSkillQuestions.length - 1 ? (
          <Button
            variant={"violate"}
            // asChild
            onClick={() => {
              formatSelectedAnswersAndCalculateScores();

              upsertSelectedAnswers(skillScores).then(() => {
                console.log("API call completed for soft skill");
              });
            }}
            className="max-w-[284px] w-full border border-Moderate_violet"
          >
            <Link href={"/start/overview/assessment/profile"}>Finish</Link>
          </Button>
        ) : (
          <Button
            onClick={handleNext}
            disabled={!selectedAnswers[currentQuestion.text]}
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
