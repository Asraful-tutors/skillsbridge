import { motion } from "framer-motion";
import { ReactNode } from "react";

export default function SkillAssessment({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <motion.div className="w-full max-h-[355px] bg-light_sky rounded-2xl p-8 flex flex-col gap-4">
      <h3 className="text-xl font-bold leading-[150%]">{title}</h3>
      <div className="h-auto overflow-y-scroll">{children}</div>
    </motion.div>
  );
}
