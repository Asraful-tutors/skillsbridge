import React from "react";
import { Progress } from "@/components/ui/progress";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { AnimatePresence } from "framer-motion";
import { disableRedirectUser, logOut, redirectUser } from "@/lib/backend/user";
import { useRouter } from "next/navigation";

interface UserBoardProps {
  visible: boolean;
}

export default function UserBoard({ visible }: UserBoardProps) {
  const router = useRouter();
  const removeCode = () => {
    disableRedirectUser();
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ height: 0, transformOrigin: "center 290px" }}
          animate={{ height: 170 }}
          exit={{ height: 0 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="absolute bg-white rounded-[20px]  w-[400px] z-[100] top-[20px] sm:top-[116px] -right-12 sm:right-2 overflow-hidden scale-75 sm:scale-100"
        >
          <div className="pt-4 flex flex-col items-center">
            <Button
              asChild
              className="mb-5 rounded-[8px] bg-[#EBEBEB] text-black w-[355px] text-base font-bold p-4 justify-start hover:bg-[#EBEBEB] hover:opacity-70"
            >
              <span
                onClick={() => {
                  removeCode();
                  router.push("/start");
                }}
                className="flex items-center gap-4"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99"
                  />
                </svg>
                Change Paths
              </span>
            </Button>
            <Button
              onClick={() => {
                logOut();
              }}
              className="rounded-[8px] flex items-center gap-5 bg-[#EBEBEB] text-black w-[355px] text-base font-bold p-4 justify-start hover:bg-[#EBEBEB] hover:opacity-70"
            >
              <Image
                alt="Log out"
                width={24}
                height={24}
                src={"/images/logout.svg"}
                className=""
              />
              Logout
            </Button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
