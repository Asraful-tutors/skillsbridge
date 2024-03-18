import React, { useEffect, useRef } from "react";
import { motion } from "framer-motion";

interface SkillEntry {
  skill: {
    name: string;
    scale: {
      values: number[];
    };
  };
  selfScore: number;
}

interface ChartData {
  data: SkillEntry[];
  disableAnimation?: boolean;
}

const ChartComponent = ({ data, disableAnimation }: ChartData) => {
  return (
    <div className="my-4 flex flex-col gap-3.5 ">
      {data?.map((entry, index) => (
        <div
          key={index}
          className="flex flex-col lg:flex-row lg:items-center gap-4 lg:gap-5"
        >
          <h3 className="text-sm lg:text-lg font-semibold text-[#4D4D9B] !w-[386px] min-w-[156px] whitespace-pre-wrap ">
            {entry?.skill?.name}
          </h3>
          <div className="flex rounded-md py-4 w-full">
            {Array.from({ length: 100 }, (_, innerIndex) => (
              <div
                key={innerIndex}
                className={`flex flex-col items-center relative bg-[#DDDDDD] shadow-inner shadow-[#320864]/[.25] ${
                  innerIndex === 0 ? "rounded-l-full" : ""
                } ${innerIndex === 99 ? "rounded-r-full" : ""}`}
              >
                {innerIndex % 10 === 0 && (
                  <span className="text-xs text-gray-500 absolute -bottom-5 left-0">
                    {innerIndex}
                  </span>
                )}
                <motion.div
                  className={`cursor-pointer w-[5.5px] h-[8px] border-[1px] shadow-md shadow-[#320864]/[.10] border-[#999999]/[.20] ${
                    innerIndex === 0 ? "rounded-l-full" : ""
                  } ${innerIndex === 99 ? "rounded-r-full" : ""}`}
                ></motion.div>

                {entry.selfScore === innerIndex + 1 && (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="44"
                    viewBox="0 0 18 44"
                    fill="none"
                    className="absolute -top-6 -right-3 z-50"
                  >
                    <path
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      d="M15.2038 2.79368C13.5576 1.14748 11.3249 0.222656 8.99677 0.222656C6.6687 0.222656 4.43597 1.14748 2.78977 2.79368C1.14357 4.43988 0.21875 6.6726 0.21875 9.00068C0.21875 11.3288 1.14357 13.5615 2.78977 15.2077L8.28977 20.7077C8.4773 20.8952 8.73161 21.0005 8.99677 21.0005C9.26194 21.0005 9.51625 20.8952 9.70377 20.7077L15.2038 15.2077C16.0189 14.3926 16.6655 13.4249 17.1066 12.3599C17.5478 11.2949 17.7748 10.1534 17.7748 9.00068C17.7748 7.84793 17.5478 6.70647 17.1066 5.64147C16.6655 4.57647 16.0189 3.60879 15.2038 2.79368ZM7.49677 9.00068C7.49677 8.60286 7.65481 8.22132 7.93611 7.94002C8.21742 7.65872 8.59895 7.50068 8.99677 7.50068H9.00677C9.4046 7.50068 9.78613 7.65872 10.0674 7.94002C10.3487 8.22132 10.5068 8.60286 10.5068 9.00068V9.01068C10.5068 9.4085 10.3487 9.79004 10.0674 10.0713C9.78613 10.3526 9.4046 10.5107 9.00677 10.5107H8.99677C8.59895 10.5107 8.21742 10.3526 7.93611 10.0713C7.65481 9.79004 7.49677 9.4085 7.49677 9.01068V9.00068Z"
                      fill="#FFDD00"
                    />
                    <line
                      x1="9"
                      y1="23"
                      x2="9"
                      y2="43"
                      stroke="#FFDD00"
                      stroke-width="2"
                      strokeLinecap="round"
                    />
                  </svg>
                )}
              </div>
            ))}
            <div className="flex flex-col items-center gap-0.5 relative mr-0.5">
              <span className="text-xs text-gray-500 absolute -bottom-5 left-0">
                100
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ChartComponent;
