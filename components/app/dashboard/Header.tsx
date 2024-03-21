// @ts-nocheck

import Image from "next/image";
import React, { useState, useRef, RefObject, useEffect } from "react";
import { Button } from "@/components/ui/button";
import UserBoard from "@/components/app/dashboard/UserBoard";
import useOutsideClick from "@/components/hooks/useOutsideClick";
import { useQuery } from "@tanstack/react-query";
import { getCompletedMilestones, getCurrentUser } from "@/lib/backend/user";
import useUserPaths from "@/components/hooks/useUserPaths";
import PdfView from "@/components/shared/PdfView";
import { PDFDownloadLink } from "@react-pdf/renderer";
import PdfGenerator from "@/components/shared/PdfGenerator";
import { useAppSelector } from "@/lib/store/hooks";

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

  const [allMilestonesData, setAllMilestonesData] = useState([]);

  const {
    data: allMilestones,
    isLoading: isLoadingAllMilestones,
    isError: isErrorAllMilestones,
  } = useQuery({
    queryKey: ["getAllMilestones", userPaths],
    // @ts-ignore
    queryFn: async () => {
      // Check if userPaths is available
      if (!userPaths) {
        return []; // or any default value that makes sense for your application
      }

      // Ensure that getAllMilestones returns data
      const data = await getAllMilestones(userPaths.pathId);
      setAllMilestonesData(data);
      // Return the data to satisfy useQuery expectations
      return data;
    },
    enabled: !!user,
  });

  const {
    data: completedMilestones,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["completedMilestones"],
    // @ts-ignore
    queryFn: async () => {
      const data = await getCompletedMilestones(user.id);
      return data || [];
    },
    enabled: !!user,
  });

  const [openPdf, setOpenPdf] = useState(false);

  const [milestoneCompletion, setMilestoneCompletion] = useState(
    Array(20).fill(false)
  ); // Initialize an array of 20 elements with false

  useEffect(() => {
    // Call the isMilestoneCompleted function for each milestone
    const newCompletionStatus = allMilestonesData.map(
      (milestone, index) =>
        isMilestoneCompleted(milestone.id) || milestoneCompletion[index]
    );

    setMilestoneCompletion(newCompletionStatus);
  }, [allMilestonesData]);

  const [showDownload, setShowDownload] = useState(false);

  useEffect(() => {
    if (completedMilestones?.length >= 2) {
      try {
        localStorage.setItem("__test__", "test");
        localStorage.removeItem("__test__");
      } catch (e) {
        // localStorage is not available
        console.error(
          "Local storage is disabled. Please enable it to use this website."
        );
        return;
      }

      const matcher = localStorage.getItem("hasCompletedMilestones");
      if (matcher == "aX76fQ93z") {
        console.log("matched");
        setShowDownload(true);
      }
    }
  }, [completedMilestones]);

  const handleVisibility = () => {
    setVisible(!visible);
  };

  useOutsideClick(visible, setVisible);

  const certifyTo = useAppSelector((state) => state.user.userData);
  // Get the current date
  const currentDate = new Date();
  const day = currentDate.getDate();
  const month = currentDate.getMonth() + 1; // Month is 0-indexed
  const year = currentDate.getFullYear();

  return (
    <nav className="fixed top-0 right-0 flex items-center lg:justify-between w-full z-[100]">
      {/* left */}
      <PdfView open={openPdf} setOpen={setOpenPdf} />
      <section className="clip-left bg-white_background lg:max-w-[597px] h-[90px] px-5 md:px-10 py-[13px] flex items-center justify-start gap-5 md:gap-10 w-full">
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
      <section className="clip-right bg-white_background lg:max-w-[597px] h-[90px] px-5 md:px-10 py-[13px] flex items-center justify-end w-full gap-5">
        {showDownload ? (
          <>
            <PDFDownloadLink
              document={
                <PdfGenerator
                  user={certifyTo}
                  day={day}
                  month={month}
                  year={year}
                />
              }
              fileName="certificate.pdf"
            >
              {({ loading, error }) =>
                loading ? (
                  <Button variant={"violate"} className="">
                    Loading doc..
                  </Button>
                ) : (
                  <Button
                    variant={"violate"}
                    className="bg-Moderate_violet  items-center gap-2 rounded-md text-sm overflow-hidden px-2 py-0 flex"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke-width="1.5"
                      stroke="currentColor"
                      class="w-4 h-4"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M7.5 7.5h-.75A2.25 2.25 0 0 0 4.5 9.75v7.5a2.25 2.25 0 0 0 2.25 2.25h7.5a2.25 2.25 0 0 0 2.25-2.25v-7.5a2.25 2.25 0 0 0-2.25-2.25h-.75m-6 3.75 3 3m0 0 3-3m-3 3V1.5m6 9h.75a2.25 2.25 0 0 1 2.25 2.25v7.5a2.25 2.25 0 0 1-2.25 2.25h-7.5a2.25 2.25 0 0 1-2.25-2.25v-.75"
                      />
                    </svg>
                    Download
                  </Button>
                )
              }
            </PDFDownloadLink>
          </>
        ) : null}

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
