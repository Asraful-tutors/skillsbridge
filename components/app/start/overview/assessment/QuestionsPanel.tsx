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

interface Question {
  text: string;
  options: QuestionOption[];
  id: number; // Add this line
  skillId: number;
  // Include other properties of the question if needed
}
export default function QuestionsPanel({
  hardSkillQuestions,
}: {
  hardSkillQuestions: Question[];
}) {
  const [questions, setQuestions] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [currentSkillType, setCurrentSkillType] = useState("hard");
  const [selectedAnswers, setSelectedAnswers] = useState<SelectedAnswers>({});
  console.log("selectedAnswers", selectedAnswers);

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
    if (currentStep === hardSkillQuestions.length - 1) {
      if (currentSkillType === "hard") {
        setCurrentSkillType("soft");

        const softQuestions = paths
          .filter((skill) => skill.type !== "hard")
          .flatMap((skill) => skill.skills)
          .flatMap((skill) => skill.questions);

        setCurrentStep(0);
        // Reset selected answers when moving to the next set of questions
        setSelectedAnswers({});
        console.log("calling api");
        // Use setTimeout to make sure state is updated before making the API call
        setTimeout(async () => {
          await upsertSelectedAnswers(selectedAnswers);
          console.log("finished calling api");
        }, 0);
      } else {
        alert("Assessment finished!");
      }
    } else {
      setCurrentStep((prevStep) => prevStep + 1);
    }
  };

  // useEffect(() => {
  //   handleNext();

  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [currentStep, currentSkillType]);
  const handleBack = () => {
    setCurrentStep((prevStep) => Math.max(0, prevStep - 1));
  };

  if (
    !hardSkillQuestions ||
    !Array.isArray(hardSkillQuestions) ||
    hardSkillQuestions.length === 0
  ) {
    return <div>Loading or no questions available.</div>;
  }

  const currentQuestion = hardSkillQuestions[currentStep];

  if (!currentQuestion) {
    return <div>No questions available for the current step.</div>;
  }

  return (
    <motion.div className="flex flex-col gap-16">
      <ProgressBar
        currentStep={currentStep}
        totalSteps={hardSkillQuestions.length}
      />
      <div className="flex flex-col gap-8">
        <p>
          {" "}
          Q: {currentStep + 1} ({hardSkillQuestions.length - currentStep - 1}{" "}
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
        currentStep === hardSkillQuestions.length - 1 ? (
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
