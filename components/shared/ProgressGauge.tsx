import React from "react";
import { motion } from "framer-motion";

interface GaugeProps {
  score: {
    total: number;
    correct: number;
    wrong: number;
  };
}

export function ProgressGauge({ score }: GaugeProps) {
  return (
    <div className="flex flex-col justify-center bg-[#F0F1F5] px-[50px] py-[34px] rounded-[20px] w-fit shadow-lg">
      <div className="w-[294px] h-[140px] mb-[30px] relative rounded-t-full">
      <svg width="294" height="140" xmlns="http://www.w3.org/2000/svg" className="mb-30">
        <path d="M147 0 A147 147 0 0 1 294 147 L147 147 Z" fill="#A7F3D0" />
        <path d="M147 0 A147 147 0 0 1 294 147 L147 147 Z" fill="#34D399" transform="rotate(-60 147 147)" />
        <path d="M147 0 A147 147 0 0 1 294 147 L147 147 Z" fill="#059669" transform="rotate(-120 147 147)" />
      </svg>
        <div className="absolute inset-0 flex justify-center items-end">
          <div className="z-100 w-[223px] h-[105px] bg-[#F0F1F5] rounded-t-full relative">
            <motion.svg
            width="121"
            height="16"
            viewBox="0 0 121 16"
            fill="none"
            className="absolute -left-1 -bottom-2"
            xmlns="http://www.w3.org/2000/svg"
            initial={{ rotate: 0, transformOrigin: "calc(100% - 7.645px) calc(100% - 7.645px)" }}
            animate={{ rotate: (score.correct / score.total) * 180, transformOrigin: "calc(100% - 7.645px) calc(100% - 7.645px)" }}
            transition={{ duration: 1, ease: "linear" }}
            >
              <path d="M0.0538779 7.83048L115.706 15.3458L115.765 1.27856L0.0538779 7.83048Z"
              fill="#121214"
              fill-opacity="0.84"
              />
              <path d="M113.155 15.9455C117.377 15.9631 120.814 12.555 120.831 8.33338C120.849 4.11174 117.441 0.675175 113.219 0.657596C108.997 0.640017 105.561 4.04808 105.543 8.26973C105.525 12.4914 108.933 15.9279 113.155 15.9455Z"
              fill="#121214"
              fill-opacity="0.84"
              />
            </motion.svg>
          </div>
        </div>
      </div>
      <div className="mb-[100px] mx-auto">
        <h2 className="text-xl mr-2 inline-block">Total score:</h2>
        <h2 className="text-xl font-semibold inline-block"> {(score.correct / score.total) * 100} / 100</h2>
      </div>
      <div className="">
        <div className="flex flex-row justify-between mb-6">
          <h2 className="text-base">Correct Answer(s)</h2>
          <h2 className="font-semibold text-base text-[#56AB2F]">{score.correct} / {score.total}</h2>
        </div>
        <div className="flex flex-row justify-between">
          <h2 className="text-base">Wrong Answer(s)</h2>
          <h2 className="font-semibold text-base text-[#F24822]">{score.wrong} / {score.total}</h2>
        </div>
      </div>
    </div>
  )
}
