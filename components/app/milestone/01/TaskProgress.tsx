import React from "react";
import { motion } from "framer-motion";

export default function TaskProgress({ progress }: { progress: number }) {
  progress = 0;
  return (
    <motion.div className="flex flex-col">
      <div className="flex flex-row mb-[11px]">
        <div
          className={`border-gray bg-deep_blue border-0 w-[18px] h-[18px] flex justify-center items-center`}
        >
          <div className="w-[8px] h-[2px] bg-white"></div>
        </div>
        <hr
          className={`${
            progress === 1 || progress === 2
              ? "border-deep_blue"
              : "border-gray"
          } border-t-2 border-dotted w-[1px] my-2 ml-2`}
        />
        <hr
          className={`${
            progress === 1 || progress === 2
              ? "border-deep_blue"
              : "border-gray"
          } border-t-2 border-dashed w-[174px] my-2 mx-1.5`}
        />
        <hr
          className={`${
            progress === 1 || progress === 2
              ? "border-deep_blue"
              : "border-gray"
          } border-t-2 border-dotted w-[1px] my-2 mr-2`}
        />
        <div
          className={`border-gray ${
            progress === 1 || progress === 2
              ? "bg-deep_blue border-0"
              : "bg-white border-2"
          } w-[18px] h-[18px] flex justify-center items-center`}
        >
          {(progress === 1 || progress === 2) && (
            <div className="w-[8px] h-[2px] bg-white"></div>
          )}
        </div>
        <hr
          className={`${
            progress === 2 ? "border-deep_blue" : "border-gray"
          } border-t-2 border-dotted w-[1px] my-2 ml-2`}
        />
        <hr
          className={`${
            progress === 2 ? "border-deep_blue" : "border-gray"
          } border-t-2 border-dashed w-[174px] my-2 mx-1.5`}
        />
        <hr
          className={`${
            progress === 2 ? "border-deep_blue" : "border-gray"
          } border-t-2 border-dotted w-[1px] my-2 mr-2`}
        />
        <div
          className={`border-gray ${
            progress === 2 ? "bg-deep_blue border-0" : "bg-white border-2"
          } w-[18px] h-[18px] flex justify-center items-center`}
        >
          {progress === 2 && <div className="w-[8px] h-[2px] bg-white"></div>}
        </div>
        <hr className="w-[80px] opacity-0" />
      </div>
      <div className="flex flex-row">
        <p className="max-w-[96px] text-sm text-subheading/[.68]">
          Go to courses and enroll
        </p>
        <hr className="w-[126px] opacity-0" />
        <p className="max-w-[96px] text-sm text-subheading/[.68]">
          Complete assignments & project
        </p>
        <hr className="w-[126px] opacity-0" />
        <p className="max-w-[96px] text-sm text-subheading/[.68]">
          Take assessment to earn points
        </p>
      </div>
    </motion.div>
  );
}
