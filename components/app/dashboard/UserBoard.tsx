import React from "react";
import { Progress } from "@/components/ui/progress";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { AnimatePresence } from "framer-motion";
import { logOut } from "@/lib/backend/user";

interface UserBoardProps {
  visible: boolean;
}

export default function UserBoard({ visible }: UserBoardProps) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ height: 0, transformOrigin: "center 290px" }}
          animate={{ height: 100 }}
          exit={{ height: 0 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="absolute bg-white rounded-[20px] w-[400px] z-[60] top-[20px] sm:top-[116px] -right-12 sm:right-2 overflow-hidden scale-75 sm:scale-100"
        >
          <div className="pt-4 flex flex-col items-center">
            {/* <Button className="mb-5 rounded-[8px] bg-[#EBEBEB] text-black w-[355px] text-base font-bold p-4 justify-start hover:bg-[#EBEBEB] hover:opacity-70">
            <Image
              alt="Settings"
              width={24}
              height={24}
              src={"/images/settings.svg"}
              className="mr-[10px]"
            />
            Settings
          </Button> */}
            <Button
              onClick={() => logOut()}
              className="rounded-[8px] bg-[#EBEBEB] text-black w-[355px] text-base font-bold p-4 justify-start hover:bg-[#EBEBEB] hover:opacity-70"
            >
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
        </motion.div>
      )}
    </AnimatePresence>
  );
}
