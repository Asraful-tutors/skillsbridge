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
    // Assign different colors based on the segmentIndex
    // You can customize the colors based on your design
    if (segmentIndex === currentStep) {
      return "bg-Moderate_violet"; // Current step color
    } else if (segmentIndex < currentStep) {
      return "bg-Moderate_violet"; // Previous steps color
    } else if (segmentIndex === currentStep + 1) {
      return "bg-[#e3cfff]"; // Slightly lighter color for the next step
    } else {
      return "bg-gray-300"; // Other segments color
    }
  };

  return (
    <motion.div className="w-full mb-4">
      <motion.div className="bg-gray-200 h-4 rounded-full overflow-hidden relative">
        {[...Array(stepSegments)].map((_, index) => (
          <motion.div
            key={index}
            className={`h-4 absolute z-${
              stepSegments - index
            } ${calculateSegmentColor(index)}`}
            animate={{
              width: `${segmentWidth}%`,
              left: `${index * segmentWidth}%`,
            }}
            transition={{
              duration: 0.5,
              ease: "easeInOut",
            }}
          ></motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
};
