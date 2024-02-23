import React from "react";
import { Progress } from "@/components/ui/progress";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { AnimatePresence } from "framer-motion";

interface UserBoardProps {
  visible: boolean,
}

export default function UserBoard({
  visible,
}: UserBoardProps) {
  return (
    <AnimatePresence>
      {visible && <motion.div
      initial={{ height: 0, transformOrigin: 'center 290px' }}
      animate={{ height: 619.8 }}
      exit={{ height: 0 }}
      transition={{ duration: 0.5, ease: 'easeInOut' }}
      className="absolute bg-white rounded-[20px] w-[400px] z-[60] top-[20px] sm:top-[116px] -right-12 sm:right-2 overflow-hidden scale-75 sm:scale-100"
      >
        <div className="bg-[#F0FAFB] h-[141px] rounded-t-[20px] p-[21px] relative">
          <Button className="border-[1px] border-[#6CB1B8] px-[6px] py-[4px] text-[#3A3333] text-sm font-medium bg-transparent shadow-none absolute right-[21px] top-[21px] hover:bg-transparent hover:opacity-70">
            Edit profile
            <Image
              alt="User Image"
              width={16}
              height={16}
              src={"/images/edit.svg"}
              className="ml-1"
            />
          </Button>
          <Image
            alt="User Image"
            width={94}
            height={94}
            src={"/images/user.png"} /* replace with user image source */
            className="w-[94px] h-[94px] rounded-full absolute -bottom-[22px] left-[24px]"
          />
          <div className="flex flex-col absolute bottom-[13px] right-[33px]">
            <h3 className="text-xl font-medium">{"Sam Thomas"}</h3> {/* replace with user name */}
            <div className="flex flex-row text-[#0E7684] text-base">
              <h3>Learning path&nbsp;&nbsp;-&nbsp;&nbsp;</h3>
              <h3 className="font-bold">{"Game Design"}</h3> {/* replace with user path */}
            </div>
          </div>
        </div>
        <div className="pt-[75px] pb-[32px] px-[28px] flex flex-col items-center">
          <div className="mb-[28px]">
            <div className="flex flex-row justify-between mb-3 text-sm">
              <h3>{"milestone 1".toUpperCase()}</h3> {/* replace title with variable */}
              <h3>Completed {50}%</h3> {/* replace value with variable */}
            </div>
            <Progress value={20} indicatorColor="bg-gradient-to-b from-[#83A1FF] to-[#1E3AA1]" className="w-[347px] h-[16px]"/> {/* replace value with variable */}
          </div>
          <div className="rounded-[12px] border-[1px] border-[#A3A3A3] px-5 pt-5 pb-3 w-[344px] grid grid-cols-2 mb-[28px]">
            <div className="">
              <h3 className="text-sm mb-1">My learning path</h3>
              <h3 className="text-xl font-bold mb-[25px]">{"Game Design"}</h3> {/* replace title with variable */}
              <Link href={"/"} className="text-[#1756B5] underline text-sm font-bold">Change it</Link> {/* replace href */}
            </div>
            <div className="w-[111px] h-[59px] bg-[#D9D9D9] justify-self-end rounded-[8px]"></div>
          </div>
          <Button className="mb-5 rounded-[8px] bg-[#EBEBEB] text-black w-[355px] text-base font-bold p-4 justify-start hover:bg-[#EBEBEB] hover:opacity-70">
            <Image
              alt="Settings"
              width={24}
              height={24}
              src={"/images/settings.svg"}
              className="mr-[10px]"
            />
            Settings
          </Button>
          <Button className="rounded-[8px] bg-[#EBEBEB] text-black w-[355px] text-base font-bold p-4 justify-start hover:bg-[#EBEBEB] hover:opacity-70">
            <Image
              alt="Log out"
              width={24}
              height={24}
              src={"/images/logout.svg"}
              className="mr-[10px]"
            />
            Logout
          </Button>
        </div>
      </motion.div>}
    </AnimatePresence>
  );
}
