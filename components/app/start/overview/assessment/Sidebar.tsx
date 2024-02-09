import { useAppSelector } from "@/lib/store/hooks";
import { motion } from "framer-motion";
import { useEffect, useState } from "react"; // Import useState for managing completed steps

const steps = [
  {
    step: "Hard Skills",
  },
  {
    step: "Soft skills",
  },
  {
    step: "Your skills report",
  },
];

const stepVariant = {
  initial: {
    opacity: 0,
  },
  animate: {
    opacity: 1,
  },
  exit: {
    opacity: 0,
  },
};

export default function Sidebar() {
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const currentSkillType = useAppSelector(
    (state) => state.skillAssessmentSession.currentSkillType
  );

  //   const handleStepClick = (index: number) => {
  //     if (completedSteps.includes(index)) {
  //       setCompletedSteps(completedSteps.filter((step) => step !== index));
  //     } else {
  //       setCompletedSteps([...completedSteps, index]);
  //     }
  //   };

  useEffect(() => {
    const determineCompletedSteps = () => {
      switch (currentSkillType) {
        case "hard":
          setCompletedSteps([]);
          break;
        case "soft":
          setCompletedSteps([0]);
          break;
        default:
          setCompletedSteps([0, 1]);
          break;
      }
    };

    determineCompletedSteps();
  }, [currentSkillType]);

  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{
        duration: 0.5,
        ease: "easeInOut",
      }}
      className="flex flex-col gap-7 items-center justify-center"
    >
      <h1 className="header text-xl text-left">Skills Assessments Sessions</h1>
      <motion.div
        transition={{
          duration: 0.5,
          ease: "easeInOut",
        }}
        className="flex flex-col justify-between h-full"
      >
        {steps.map((step, index) => {
          const isCompleted = completedSteps.includes(index);
          return (
            <div key={index} className="flex items-start gap-4 ">
              <motion.div
                variants={stepVariant}
                className="flex flex-col items-center"
              >
                <motion.div
                  animate={{
                    border: isCompleted ? "2px solid #B47BFF" : "",
                  }}
                  className="flex flex-col items-center shadow-md justify-center w-10 h-10 p-2 rounded-full bg-[#F0F1F5]"
                >
                  {isCompleted ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <path
                          d="M21.7949 7.54597L9.79492 19.546C9.6904 19.6509 9.56621 19.7341 9.42947 19.7909C9.29272 19.8476 9.14611 19.8769 8.99804 19.8769C8.84998 19.8769 8.70337 19.8476 8.56662 19.7909C8.42988 19.7341 8.30569 19.6509 8.20117 19.546L2.95117 14.296C2.84652 14.1913 2.76351 14.0671 2.70688 13.9304C2.65024 13.7936 2.62109 13.6471 2.62109 13.4991C2.62109 13.3511 2.65024 13.2046 2.70688 13.0678C2.76351 12.9311 2.84652 12.8069 2.95117 12.7022C3.05582 12.5976 3.18005 12.5146 3.31678 12.4579C3.45351 12.4013 3.60005 12.3721 3.74805 12.3721C3.89604 12.3721 4.04258 12.4013 4.17931 12.4579C4.31604 12.5146 4.44027 12.5976 4.54492 12.7022L8.99898 17.1563L20.203 5.9541C20.4144 5.74276 20.701 5.62402 20.9999 5.62402C21.2988 5.62402 21.5854 5.74276 21.7968 5.9541C22.0081 6.16544 22.1269 6.45209 22.1269 6.75098C22.1269 7.04986 22.0081 7.33651 21.7968 7.54785L21.7949 7.54597Z"
                          fill="#B47BFF"
                        />
                      </svg>
                    </svg>
                  ) : (
                    <motion.span
                      variants={stepVariant}
                      initial="initial"
                      animate="animate"
                      exit="exit"
                      className="text-gray-500"
                    >
                      {index + 1}
                    </motion.span>
                  )}
                </motion.div>
                {index !== 2 && (
                  <motion.div
                    variants={stepVariant}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    transition={{
                      duration: 0.5,
                      ease: "easeInOut",
                    }}
                    className={` ${
                      isCompleted ? "bg-Moderate_violet" : "bg-[#757575]"
                    } w-0.5 h-[100px]`}
                  />
                )}
              </motion.div>

              <div
                className={` ${
                  isCompleted ? "text-black" : "text-[#757575]"
                }  font-semibold leading-[150%] flex flex-col items-start h-full`}
                // onClick={() => handleStepClick(index)}
              >
                <h6 className="">{step.step}</h6>
                <p className="text-xs font-normal">Session 01</p>
              </div>
            </div>
          );
        })}
      </motion.div>
    </motion.div>
  );
}
