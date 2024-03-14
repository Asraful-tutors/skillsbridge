// @ts-nocheck

"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RequiredSkillCard } from "@/components/shared/RequiredSkillCard";
import { useQuery } from "@tanstack/react-query";
import Loading from "@/app/loading";
import {
  getSingleAssessment,
  getSkillNames,
} from "@/lib/backend/mileStoneCourses";
import { useState } from "react";

interface Skill {
  skill: {
    name: string;
  };
}

interface UserSkill {
  skills: Skill[];
}

export default function MilestoneModal({
  formattedPathName,

  setVisible,
}: {
  formattedPathName: any;

  setVisible: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const [mileStoneData, setMileStone] = useState(null);
  const [mileStoneName, setMileStoneName] = useState([]);
  const {
    data: mileStone,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["milestoneSIngle", formattedPathName],
    queryFn: async () => {
      const data = await getSingleAssessment(formattedPathName);

      setMileStone(data);
      return data;
    },
    enabled: !!formattedPathName,
  });

  const {
    data: skillName,
    isLoading: skillNameLoading,
    isError: skillNameError,
  } = useQuery({
    queryKey: ["skillName", mileStone],
    queryFn: async () => {
      const data = await getSkillNames(formattedPathName);
      setMileStoneName(data);
      return data;
    },
    enabled: !!mileStoneData,
  });

  if (isLoading || skillNameLoading) {
    return (
      <>
        <Loading />
      </>
    );
  }

  if (isError || skillNameError) {
    return "Something went wrong";
  }

  return (
    <div className="z-[100] bg-black/[.70] w-screen h-screen absolute top-0 left-0 flex items-center">
      <motion.div
        className={`popup w-full relative text-black max-w-screen-2xl mx-auto max-h-[800px] max-h-screen my-8 rounded-2xl sm:mx-10 xl:mx-auto grid grid-cols-1 xl:grid-cols-10 gap-12 p-0 bg-white_background overflow-y-scroll xl:overflow-hidden`}
      >
        <div className="absolute right-4 top-4">
          <Button
            onClick={() => setVisible(false)}
            className="font-semibold h-10 w-10 text-xl text-white bg-[#9E54FF] hover:bg-[#9E54FF] hover:opacity-70 shadow-none rounded-full"
          >
            x
          </Button>
        </div>
        <div className="col-span-5 2xl:col-span-6 my-[77px] mx-12 relative">
          <h1 className="text-[40px] font-bold mb-[18px]">
            {mileStoneData?.data?.name}
            {/* milestone title */}
          </h1>
          <div className="flex flex-col mb-8">
            <h2 className="text-xl font-semibold mb-1.5 text-subheading">
              Overview
            </h2>
            <p className="text-base opacity-50">
              {mileStoneData?.data?.description || (
                <span>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                  do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                  Ut enim ad minim veniam, quis nostrud exercitation ullamco
                  laboris nisi ut aliquip ex ea commodo consequat.{" "}
                </span>
              )}
            </p>
          </div>
          <div className="flex flex-col mb-[42px]">
            <div className="flex flex-row gap-3 flex-wrap">
              {mileStoneName?.length > 0 ? (
                <div className="flex flex-col mb-[84px]">
                  <h3 className="text-base font-medium mb-[9px]">
                    Skills you&apos;ll learn
                  </h3>
                  <div className="flex flex-row gap-3 flex-wrap">
                    {mileStoneName?.map((item: Skill, key: number) => {
                      return (
                        <Badge
                          key={key}
                          variant={"nonHoverable"}
                          className={`rounded-full w-fit px-4 py-2 flex justify-center text-badge_text bg-apricot/[.56] text-sm shadow-none tracking-tighter-[-0.154px] ${
                            key % 4 === 0
                              ? "bg[#A8DAFF8F]"
                              : key % 4 === 1
                              ? "bg-[#94C6EB8F]"
                              : key % 4 === 2
                              ? "bg-[#FFA8D28F]"
                              : "bg-[#FF84005E]"
                          }`}
                        >
                          {item?.name}
                        </Badge>
                      );
                    })}
                  </div>
                </div>
              ) : null}
            </div>
          </div>
          <Button
            /* onClick={} */
            variant={"violate"}
            className={`max-w-[284px] mx-auto
              "cursor-not-allowed"
            } `}
            disabled={true}
          >
            <p className="flex flex-row">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="mr-2"
              >
                <path
                  d="M18 8H17V6C17 3.24 14.76 1 12 1C9.24 1 7 3.24 7 6V8H6C4.9 8 4 8.9 4 10V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V10C20 8.9 19.1 8 18 8ZM9 6C9 4.34 10.34 3 12 3C13.66 3 15 4.34 15 6V8H9V6ZM18 20H6V10H18V20ZM12 17C13.1 17 14 16.1 14 15C14 13.9 13.1 13 12 13C10.9 13 10 13.9 10 15C10 16.1 10.9 17 12 17Z"
                  fill="#F5F5F5"
                />
              </svg>
              Locked
            </p>
          </Button>
        </div>

        {mileStoneData?.data?.skillRequirements?.length > 0 ? (
          <div className="col-span-5 2xl:col-span-4 bg-[#E2E2FE] flex flex-col items-center rounded-b-2xl xl:rounded-r-2xl xl:rounded-b-none py-[32px] xl:max-h-[800px] xl:overflow-y-scroll">
            <div>
              <h2 className="mb-5 text-2xl font-bold">
                To unlock, you require
              </h2>
              <div className="flex flex-col items-center xl:items-start">
                {mileStoneData?.data?.skillRequirements?.map(
                  (skill: any, i: number) => (
                    <RequiredSkillCard
                      key={i}
                      skill={skill}
                      mileStoneName={mileStoneName}
                    />
                  )
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="col-span-5 mt-20 text-xl font-semibold 2xl:col-span-4 bg-[#E2E2FE] flex flex-col items-center rounded-b-2xl xl:rounded-r-2xl xl:rounded-b-none py-[32px] xl:max-h-[800px] xl:overflow-y-scroll">
            No required skills
          </div>
        )}
      </motion.div>
    </div>
  );
}
