"use client";

import Image from "next/image";
import UserAvatar from "./UserAvatar";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import Link from "next/link";
import { useEffect } from "react";
import { setUserData } from "@/lib/store/user/userSlice";

export default function Header({ user }: any) {
  const dispatch = useAppDispatch();
  const userData = useAppSelector((state) => state.user.userData);

  useEffect(() => {
    dispatch(setUserData(user));
  }, [dispatch, user]);

  console.log("userData", userData);

  return (
    <header className="flex items-center justify-between gap-24 px-[42px] py-6 lg:py-8 bg-white_background shadow-xl border-b-2 border-gray-200 shadow-gray-200">
      <Link href={"/"}>
        <Image
          src="/logo/logo.svg"
          alt="logo"
          width={130}
          decoding="async"
          loading="lazy"
          height={48}
          className="w-[110px] lg:w-[130px] object-cover object-center aspect-auto"
        />
      </Link>
      <div>
        <span></span>
        <span>
          <UserAvatar userData={userData} />
        </span>
      </div>
    </header>
  );
}
