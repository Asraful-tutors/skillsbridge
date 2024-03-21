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
    try {
      localStorage.setItem("__test__", "test"); // Try to set an item in localStorage
      localStorage.removeItem("__test__"); // Remove the test item
    } catch (e) {
      // localStorage is not available
      alert("Local storage is disabled. Please enable it to use this website.");
      return;
    }

    // Check if the password is stored in localStorage
    const storedPassword = localStorage.getItem("code");
    if (
      storedPassword &&
      storedPassword === process.env.NEXT_PUBLIC_ACCESS_PASSWORD
    ) {
      // Password is present and matches, redirect to the specified link
      setCanAccess(false);
    } else {
      // Password not present or doesn't match, open the modal
      setCanAccess(false);
    }
  }, [pathName, open]);

  return (
    <motion.div className="flex flex-col items-center justify-center gap-[50px]">
      <div className="flex flex-col items-center justify-center gap-[50px] bg-[#F2F7F7] p-10 rounded-2xl">
        <div className=" flex flex-col gap-2.5 rounded-3xl">
          <div className="max-w-[200px] mx-auto rounded-full overflow-hidden">
            <Image
              // @ts-ignore
              src={user?.image ? user.image : "/images/user.png"}
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
