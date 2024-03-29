// @ts-nocheck
"use client";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import Image from "next/image";
import TaskProgress from "../../milestone/01/TaskProgress";
import { Button } from "@/components/ui/button";
import Breadcrumb from "@/components/shared/Breadcrumb";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { BsInfoCircle } from "react-icons/bs";

interface Skill {
  skill?: {
    name: string;
  };
}

export default function IsEligable({
  milestone,
  skillNames,
}: {
  milestone: any;
  skillNames: any;
}) {
  const params = useParams();

  return (
    <motion.div className="w-full text-black max-w-screen-2xl h-full my-8 rounded-2xl mx-auto grid grid-cols-1 xl:grid-cols-2 gap-12 py-6 lg:py-[77px] xl:pr-0 px-12 bg-white_background">
      <div className="">
        <Breadcrumb />
        <h1 className="text-2xl lg:text-[40px] font-bold mb-[40px] max-lg:mt-4">
          {milestone?.name}
        </h1>
        <Image
          src={"/images/gamer.svg"}
          alt={"gamer"}
          width={604}
          height={555}
          className="w-full lg:w-[604px] aspect-video lg:h-[555px] object-center object-cover xl:hidden justify-self-start mb-8"
        />
        <div className="flex flex-col mb-10">
          <h2 className="text-lg lg:text-xl font-semibold mb-1.5 text-subheading">
            Overview
          </h2>
          <p className="text-sm lg:text-base opacity-50">
            {milestone?.description || (
              <span>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
                enim ad minim veniam, quis nostrud exercitation ullamco laboris
                nisi ut aliquip ex ea commodo consequat.{" "}
              </span>
            )}
          </p>
        </div>
        {skillNames?.length > 0 && (
          <div className="flex flex-col mb-10">
            <h3 className="text-base font-medium mb-[9px]">
              Skills you&apos;ll learn
            </h3>
            <div className="flex flex-row gap-3 flex-wrap">
              {skillNames?.map((item: any, key: number) => (
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
              ))}
            </div>
          </div>
        )}

        <div className="flex gap-2 bg-purple-100 p-3 rounded-md mb-8">
          <div>
            <BsInfoCircle className="text-purple-800 mt-0.5" size={20} />
          </div>
          <p className="text-sm tracking-wide text-badge_text">
            Encountered a few head-scratchers? No stress if some questions seem
            odd or out of place. This assessment isn&apos;t just about correct
            answers; it&apos;s about exploring your problem-solving strategies
            and how you apply soft skills to tackle hard-skill challenges. Your
            approach and how you navigate these questions are what matter most.
            Dive in with confidence — your unique way of thinking is what
            matters here.
          </p>
        </div>

        <div className="flex flex-row gap-5 lg:gap-[42px] mx-auto flex-wrap">
          <Button
            asChild
            variant={"violate"}
            className="w-full md:max-w-[284px] max-lg:py-3"
          >
            <a href={milestone?.link || "#"} target="_blank">
              Go to course
            </a>
          </Button>
          <Button
            asChild
            variant={"violate"}
            className="w-full md:max-w-[284px] max-lg:py-3"
          >
            <Link href={`/dashboard/milestone/${params?.id}/assessment`}>
              Take Assessments
            </Link>
          </Button>
        </div>
      </div>
      <Image
        src={"/images/gamer.svg"}
        alt={"gamer"}
        width={604}
        height={555}
        className="w-[604px] aspect-square object-center object-cover hidden xl:block justify-self-end my-auto"
      />
    </motion.div>
  );
}
