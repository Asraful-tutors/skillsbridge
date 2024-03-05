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

interface Skill {
  skill: {
    name: string;
  };
}

export default function IsEligable({
  userPaths,
  milestone,
}: {
  userPaths: any;
  milestone: any;
}) {
  const params = useParams();
  const { path } = userPaths;
  console.log("milestone", milestone);
  return (
    <motion.div className="w-full text-black max-w-screen-2xl h-full my-8 rounded-2xl mx-auto grid grid-cols-1 xl:grid-cols-2 gap-12 py-[77px] xl:pr-0 px-12 bg-white_background">
      <div className="">
        <Breadcrumb />
        <h1 className="text-[40px] font-bold mb-[18px]">
          {milestone?.milestones[0]?.name}
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
            {milestone?.milestones[0]?.description || (
              <span>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
                enim ad minim veniam, quis nostrud exercitation ullamco laboris
                nisi ut aliquip ex ea commodo consequat.{" "}
              </span>
            )}
          </p>
        </div>
        {milestone?.milestones[0]?.skillRequirements?.length > 0 && (
          <div className="flex flex-col mb-[84px]">
            <h3 className="text-base font-medium mb-[9px]">
              Skills you&apos;ll learn
            </h3>
            <div className="flex flex-row gap-3 flex-wrap">
              {milestone?.milestones[0]?.skillRequirements?.map(
                (item: Skill, key: number) => (
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
                    {item.skill?.name}
                  </Badge>
                )
              )}
            </div>
          </div>
        )}
        <div className="flex flex-row gap-[42px] mx-auto flex-wrap">
          <Button
            asChild
            variant={"violate"}
            className="w-full md:max-w-[284px]"
          >
            <a href={milestone?.milestones[0]?.link || "#"} target="_blank">
              Go to course
            </a>
          </Button>
          <Button
            asChild
            variant={"violate"}
            className="w-full md:max-w-[284px]"
          >
            <Link
              href={`/dashboard/milestone/${userPaths?.path.name}/${params?.pathId}/assessment`}
            >
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
        className="w-[604px] h-[555px] object-center object-cover hidden xl:block justify-self-end my-auto"
      />
    </motion.div>
  );
}
