import { motion } from "framer-motion";

export const ProgressBar = ({
  currentStep,
  totalSteps,
}: {
  currentStep: number;
  totalSteps: number;
}) => {
  const stepSegments = totalSteps;
  const segmentWidth = 100 / stepSegments;

  const calculateSegmentColor = (segmentIndex: number) => {
    // Adjust the colors based on your design preferences
    const currentColor = "bg-Moderate_violet";
    const nextColor = "bg-[#e3cfff]";
    const otherColor = "bg-gray-300";

    if (segmentIndex === currentStep) {
      return currentColor;
    } else if (segmentIndex === currentStep + 1) {
      return nextColor;
    } else {
      return otherColor;
    }
  };

  return (
    <motion.div className="w-full mb-4">
      <div className="bg-gray-200 h-4 rounded-full relative space-x-2">
        {[...Array(stepSegments)].map((_, index) => (
          <motion.div
            key={index}
            className={`h-4 rounded-full absolute z-${
              stepSegments - index
            } ${calculateSegmentColor(index)}`}
            style={{
              width: `${segmentWidth}%`,
              left: `${index * segmentWidth}%`,
            }}
          ></motion.div>
        ))}
      </div>
    </motion.div>
  );
};
