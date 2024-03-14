// @ts-nocheck

import Image from "next/image";
import React, { useState, useRef, RefObject } from "react";
import { Button } from "@/components/ui/button";
import UserBoard from "@/components/app/dashboard/UserBoard";
import useOutsideClick from "@/components/hooks/useOutsideClick";
import { useQuery } from "@tanstack/react-query";
import { getCurrentUser } from "@/lib/backend/user";
import useUserPaths from "@/components/hooks/useUserPaths";

export default function Header() {
  const [visible, setVisible] = useState(false);

  const { data: user } = useQuery({
    queryKey: ["/dashboard/hard"],
    queryFn: async () => {
      const data = await getCurrentUser();

      if (data) {
        const userData = {
          ...data.user,
          name: data.user?.name || "",
        };
        // @ts-ignore
        dispatch(setUserData(userData));
      }

      return data || {};
    },
  });
  const { userPaths, userPathsLoading, userPathsError } = useUserPaths(
    user as any
  );

  const handleVisibility = () => {
    setVisible(!visible);
  };

  useOutsideClick(visible, setVisible);

  return (
    <nav className="fixed top-0 right-0 flex items-center justify-between w-full z-[100]">
      {/* left */}
      <section className="clip-left bg-white_background max-w-[597px] h-[90px] px-5 md:px-10 py-[13px] flex items-center justify-start gap-5 md:gap-10 w-full">
        <Image
          src={"/logo/logo.svg"}
          width={129}
          height={48}
          alt="logo"
          decoding="async"
          loading="lazy"
          className="w-[129.984px] h-12 object-center object-cover"
        />
        <div className="flex flex-col gap-1 hidden md:block">
          <h2 className="header text-2xl text-start font-semibold">
            Milestone Journey
          </h2>
          {/* <p className="desc text-start">Milestone 01</p> */}
        </div>
      </section>

      {/* right */}
      <section className="clip-right bg-white_background max-w-[597px] h-[90px] px-5 md:px-10 py-[13px] flex items-center justify-end w-full gap-5 md:gap-10">
        <Button className="w-10 h-10 bg-[#E1E1E1] p-2 rounded-sm hover:bg-[#E1E1E1] hover:opacity-70 hidden md:block">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
          >
            <path
              d="M21.5303 14.4697L19.5 12.4395V9.75C19.4977 7.89138 18.8063 6.09964 17.5595 4.72124C16.3127 3.34284 14.5991 2.4757 12.75 2.2875V0.75H11.25V2.2875C9.40093 2.4757 7.68732 3.34284 6.44053 4.72124C5.19373 6.09964 4.50233 7.89138 4.5 9.75V12.4395L2.46975 14.4697C2.32909 14.6104 2.25004 14.8011 2.25 15V17.25C2.25 17.4489 2.32902 17.6397 2.46967 17.7803C2.61032 17.921 2.80109 18 3 18H8.25V18.75C8.25 19.7446 8.64509 20.6984 9.34835 21.4016C10.0516 22.1049 11.0054 22.5 12 22.5C12.9946 22.5 13.9484 22.1049 14.6517 21.4016C15.3549 20.6984 15.75 19.7446 15.75 18.75V18H21C21.1989 18 21.3897 17.921 21.5303 17.7803C21.671 17.6397 21.75 17.4489 21.75 17.25V15C21.75 14.8011 21.6709 14.6104 21.5303 14.4697ZM14.25 18.75C14.25 19.3467 14.0129 19.919 13.591 20.341C13.169 20.7629 12.5967 21 12 21C11.4033 21 10.831 20.7629 10.409 20.341C9.98705 19.919 9.75 19.3467 9.75 18.75V18H14.25V18.75Z"
              fill="#6767D2"
            />
          </svg>
        </Button>
        <Button
          className="flex items-center h-[64px] bg-[#13A098] rounded-full"
          onClick={handleVisibility}
        >
          <Image
            src={user?.user?.image ? user?.user.image : "/images/user.png"}
            width={40}
            height={40}
            alt="logo"
            decoding="async"
            loading="lazy"
            className="w-10 h-10 object-center object-cover rounded-full aspect-auto sm:mr-[13px]"
          />
          <div className="flex flex-col items-start hidden sm:block">
            <h3 className="text-xl font-medium line-clamp-1 whitespace-pre-wrap">
              {user?.user?.name}
            </h3>{" "}
            {/* replace with user name */}
            <div className="flex flex-row text-[#FFFFFF]/[.81] text-base">
              <h3 className="hidden lg:block">
                Learning path&nbsp;&nbsp;-&nbsp;&nbsp;
              </h3>
              <h3 className="font-bold">{userPaths?.path?.name}</h3>{" "}
              {/* replace with user path */}
            </div>
          </div>
        </Button>
      </section>
      <UserBoard visible={visible} />
    </nav>
  );
}
