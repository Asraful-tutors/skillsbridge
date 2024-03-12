"use client";
import useUserPaths from "@/components/hooks/useUserPaths";
import TunetPasswordPrompt from "@/components/shared/TunetPasswordPrompt";
import { Button } from "@/components/ui/button";
import { getCurrentUser } from "@/lib/backend/user";
import { useAppSelector } from "@/lib/store/hooks";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function UserProfileCard({ link }: { link?: string }) {
  const [open, setOpen] = useState(false);
  const [canAccess, setCanAccess] = useState(false);
  const pathName = usePathname();

  const user = useAppSelector((state) => state.user.userData);

  const { userPaths, userPathsLoading, userPathsError } = useUserPaths(
    user as any
  );

  useEffect(() => {
    // Check if the password is stored in localStorage
    const storedPassword = localStorage.getItem("code");
    if (
      storedPassword &&
      storedPassword === process.env.NEXT_PUBLIC_ACCESS_PASSWORD
    ) {
      // Password is present and matches, redirect to the specified link
      setCanAccess(true);
    } else {
      // Password not present or doesn't match, open the modal
      setCanAccess(false);
    }
  }, [pathName, open]);

  return (
    <motion.div className="flex flex-col items-center justify-center gap-[50px]">
      <div className="flex flex-col items-center justify-center gap-[50px] bg-[#F2F7F7] p-10 rounded-2xl">
        <div className="w-full flex items-center justify-end">
          {/* <Button
            variant={"outline"}
            className="max-w-[70px] flex items-center gap-2 p-2 text-sm font-medium leading-5"
          >
            Edit{" "}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 20 20"
              fill="none"
            >
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M15.8833 2.99189L17.0083 4.11689C17.6667 4.76689 17.6667 5.82523 17.0083 6.47523L5.98333 17.5002H2.5V14.0169L11.1667 5.34189L13.525 2.99189C14.175 2.34189 15.2333 2.34189 15.8833 2.99189ZM4.16667 15.8336L5.34167 15.8836L13.525 7.69189L12.35 6.51689L4.16667 14.7002V15.8336Z"
                fill="#757575"
              />
            </svg>
          </Button> */}
        </div>
        <div className=" flex flex-col gap-2.5 rounded-3xl">
          <div className="max-w-[200px] mx-auto rounded-full overflow-hidden">
            <Image
              src={"/images/user.png"}
              alt="user"
              width={200}
              height={200}
              className="w-52 aspect-auto object-center object-cover rounded-full"
              decoding="async"
              loading="lazy"
            />
          </div>
          <div className="flex flex-col gap-2">
            <p className="text-xl font-semibold leading-[150%] text-black text-center">
              {user?.name}
            </p>
            <p className="text-lg font-normal leading-[150%] text-center">
              Learning Path -{" "}
              <span className="font-bold">{userPaths?.path?.name}</span>
            </p>
          </div>
        </div>
        <div className="text-center text-blacke leading-[150%] space-y-2.5">
          <p className="font-semibold">A little bit about me:</p>
          <p className="font-normal text-black text-opacity-50">
            Passionate learner on the journey to becoming a game designer,
            seeking creativity and expertise in the exciting realm of game
            development.
          </p>
        </div>
      </div>

      {link ? (
        <>
          {canAccess ? (
            <Button
              asChild
              variant={"violate"}
              className="max-w-[284px] mx-auto"
            >
              <Link href={link}>Next</Link>
            </Button>
          ) : (
            <Button
              onClick={() => setOpen(true)}
              variant={"violate"}
              className="max-w-[284px] mx-auto"
            >
              Next
            </Button>
          )}
        </>
      ) : (
        <Button asChild variant={"violate"} className="max-w-[284px] mx-auto">
          <Link href={"/start/overview/assessment"}>Next</Link>
        </Button>
      )}

      {link && <TunetPasswordPrompt setOpen={setOpen} open={open} />}
    </motion.div>
  );
}
