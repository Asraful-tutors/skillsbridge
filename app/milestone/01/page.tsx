"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import WhiteWrapper from "@/components/layout/WhiteWrapper";
import TaskProgress from "@/components/app/milestone/01/TaskProgress";

export default function Milestone_01() {
  return (
    <motion.div className="w-full text-black max-w-screen-2xl h-full my-8 rounded-2xl mx-auto grid grid-cols-1 xl:grid-cols-2 gap-12 py-[77px] xl:pr-0 px-12 bg-white_background">
      <div className="">
        <h4 className="text-base font-medium opacity-55 mb-2">Milestone 01</h4>
        <h1 className="text-[40px] font-bold mb-[18px]">
          Basic Coding for game development
        </h1>
        <Image
          src={"/images/gamer.svg"}
          alt={"gamer"}
          width={604}
          height={555}
          className="w-[604px] h-[555px] object-center object-cover xl:hidden justify-self-start mb-8"
        />
        <div className="flex flex-col mb-8">
          <h2 className="text-xl font-semibold mb-1.5 text-subheading">
            Overview
          </h2>
          <p className="text-base opacity-50">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat.{" "}
          </p>
        </div>
        <div className="flex flex-col mb-[42px]">
          <h3 className="text-base font-medium mb-[9px]">
            Skills you&apos;ll learn
          </h3>
          <div className="flex flex-row gap-3 flex-wrap">
            <Badge className="rounded-full w-[134px] h-[37px] flex justify-center text-badge_text bg-arctic/[.56] text-sm shadow-none">
              Analytical skills
            </Badge>
            <Badge className="rounded-full w-[134px] h-[37px] flex justify-center text-badge_text bg-cadet_blue/[.56] text-sm shadow-none">
              Problem-Solving
            </Badge>
            <Badge className="rounded-full w-[134px] h-[37px] flex justify-center text-badge_text bg-pink/[.56] text-sm shadow-none">
              Critical Thinking
            </Badge>
            <Badge className="rounded-full w-[134px] h-[37px] flex justify-center text-badge_text bg-apricot/[.37] text-sm shadow-none">
              Adaptability
            </Badge>
          </div>
        </div>
        <div className="py-[15px] mb-8">
          <h2 className="text-xl font-semibold mb-[27px] text-subheading">
            Tasks to complete
          </h2>

          <TaskProgress progress={1} />
        </div>
        <Button
          /* onClick={} */
          variant={"violate"}
          className="max-w-[284px] mx-auto"
        >
          Go to course
        </Button>
      </div>
      <Image
        src={"/images/gamer.svg"}
        alt={"gamer"}
        width={604}
        height={555}
        className="w-[604px] h-[555px] object-center object-cover hidden xl:block justify-self-end my-auto"
      />
    </motion.div>
  );
}
