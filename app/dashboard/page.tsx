// @ts-nocheck

"use client";

import React, { useState, useEffect, useRef } from "react";
import Header from "@/components/app/dashboard/Header";
import SkillsBoard from "@/components/app/dashboard/SkillsBoard";
import Image from "next/image";
import CompletionBox from "@/components/app/dashboard/CompletionBox";
import { motion } from "framer-motion";
import useOutsideClick from "@/components/hooks/useOutsideClick";
import MilestoneModal from "@/components/app/dashboard/MilestoneModal";
import { useAppDispatch } from "@/lib/store/hooks";
import { useQuery } from "@tanstack/react-query";
import { getCompletedMilestones, getCurrentUser } from "@/lib/backend/user";
import { setUserData } from "@/lib/store/user/userSlice";
import Link from "next/link";
import useUserPaths from "@/components/hooks/useUserPaths";
import Loading from "../loading";
import { useParams, usePathname, useRouter } from "next/navigation";
import useUserPathSkills from "@/components/hooks/useUserPathSkills";
import {
  getDashboardSoftSkills,
  getDashboardhardSkills,
  getSoftSkills,
} from "@/actions/overView";
import {
  getAllMilestones,
  getMilestoneQuestions,
  isEligible,
} from "@/lib/backend/mileStoneCourses";
import PdfDownloader from "@/components/shared/PdfDownloader";
import SizingOverlay from "@/components/app/dashboard/SizingOverlay";
import PdfView from "@/components/shared/PdfView";
import { toast } from "sonner";

export default function DashboardPage() {
  const dispatch = useAppDispatch();
  const [selectedData, setSelectedData] = useState([]);
  const [formattedPathName, setFormattedPathName] = useState(null);
  const userEmail =
    typeof window !== "undefined" ? localStorage.getItem("userData") : null;
  const parsedEmail = userEmail ? JSON.parse(userEmail) : null;
  const email = parsedEmail ? parsedEmail.email : null;
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState(null);

  const [allMilestonesData, setAllMilestonesData] = useState([]);
  const [completedMilestoesData, setCompletedMilestoesData] = useState([]);
  const [pathId, setPathId] = useState(0);

  const {
    data: activeUser,
    isLoading: userLoading,
    isError: isUserError,
  } = useQuery({
    queryKey: ["/dashboard/hard"],
    queryFn: async () => {
      const data = await getCurrentUser(email);

      if (data) {
        const userData = {
          ...data.user,
          name: data.user?.name || "",
        };
        setUser(userData);
        // @ts-ignore
        dispatch(setUserData(userData));
      }

      return data || {};
    },
  });

  const { userPaths, userPathsLoading, userPathsError } = useUserPaths(
    user as any
  );

  const params = useParams();

  const { userSkills, userSkillsLoading, userSkillsError } =
    useUserPathSkills();

  const {
    data: userSoftSkills,
    isLoading: userSoftSkillsLoading,
    isError: userSoftSkillsError,
  } = useQuery({
    queryKey: ["user-softSkills"],
    // @ts-ignore
    queryFn: async () => await getDashboardSoftSkills(user?.user?.id),
  });

  const {
    data: userHardSkills,
    isLoading: userHardSkillsLoading,
    isError: userHardSkillsError,
  } = useQuery({
    queryKey: ["user-hardSkills"],
    // @ts-ignore
    queryFn: async () => await getDashboardhardSkills(user?.user?.id),
  });

  // get completed milestones

  const {
    data: completedMilestones,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["completedMilestones", pathname],
    // @ts-ignore
    queryFn: async () => {
      const data = await getCompletedMilestones(user.id);
      setCompletedMilestoesData(data);
      return data || [];
    },
    enabled: !!user,
  });

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

  const [hovered, setHovered] = useState<{ [key: number]: boolean }>({});
  const [divStyle, setDivStyle] = useState({
    scale: 1,
    top: 0,
    left: 0,
    isDragging: false,
    dragStartX: 0,
    dragStartY: 0,
  });

  const [visible, setVisible] = useState(false);
  const prevClientX = useRef(0);
  const prevClientY = useRef(0);

  const minZoom = 0.5;
  const maxZoom = 2;

  /* Supposed to take information about milestone to check if the milestone is available.
  If milestone is not yet availabe, throws modal with required skills */
  const handleModal = () => {
    setVisible(!visible);
  };

  useOutsideClick(visible, setVisible);

  const handleMouseAction = (imageNumber: number, value: boolean) => {
    setHovered((prevHovered) => ({
      ...prevHovered,
      [imageNumber]: value,
    }));
  };

  const handleZoom: React.WheelEventHandler<HTMLDivElement> = (event) => {
    const newScale = divStyle.scale + (event.deltaY > 0 ? -0.2 : 0.2);
    const restrictedScale = Math.max(minZoom, Math.min(newScale, maxZoom));

    setDivStyle((prevDivStyle) => ({
      ...prevDivStyle,
      scale: restrictedScale,
    }));
  };

  const handleMouseDown = (event: React.MouseEvent | React.TouchEvent) => {
    event.preventDefault();
    const clientX =
      "touches" in event ? event.touches[0].clientX : event.clientX;
    const clientY =
      "touches" in event ? event.touches[0].clientY : event.clientY;

    setDivStyle((prevDivStyle) => ({
      ...prevDivStyle,
      isDragging: true,
    }));

    prevClientX.current = clientX;
    prevClientY.current = clientY;
  };

  const handleMouseMove = (event: React.MouseEvent | React.TouchEvent) => {
    requestAnimationFrame(() => {
      const clientX =
        "touches" in event ? event.touches[0].clientX : event.clientX;
      const clientY =
        "touches" in event ? event.touches[0].clientY : event.clientY;

      if (divStyle.isDragging) {
        const deltaX = clientX - prevClientX.current;
        const deltaY = clientY - prevClientY.current;

        setDivStyle((prevDivStyle) => ({
          ...prevDivStyle,
          left: prevDivStyle.left + deltaX,
          top: prevDivStyle.top + deltaY,
        }));

        prevClientX.current = clientX;
        prevClientY.current = clientY;
      }
    });
  };

  const handleMouseUp = () => {
    setDivStyle((prevDivStyle) => ({
      ...prevDivStyle,
      isDragging: false,
    }));
  };

  useEffect(() => {
    document.addEventListener("mousemove", handleMouseMove as any);
    document.addEventListener("mouseup", handleMouseUp);

    document.addEventListener("touchmove", handleMouseMove as any);
    document.addEventListener("touchend", handleMouseUp);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove as any);
      document.removeEventListener("mouseup", handleMouseUp);

      document.removeEventListener("touchmove", handleMouseMove as any);
      document.removeEventListener("touchend", handleMouseUp);
    };
  }, [handleMouseMove, handleMouseUp, divStyle.scale, divStyle.isDragging]);

  const [openPdfDownloader, setOpenDownloader] = useState(false);
  const [loading, setLoading] = useState(false);
  // useEffect hook to run whenever completedMilestones or allMilestonesData change

  function isMilestoneCompleted(milestoneId: number) {
    return (
      completedMilestones?.some(
        (milestone) =>
          milestone.milestoneId === milestoneId && milestone.completed
      ) ?? false
    );
  }

  const handleDivStyle = (props: any) => {
    return setDivStyle({
      scale: props.scale,
      top: props.position.top,
      left: props.position.left,
    });
  };

  const [milestoneCompletion, setMilestoneCompletion] = useState(
    Array(20).fill(false)
  ); // Initialize an array of 20 elements with false

  let matcher = null;

  if (typeof window !== "undefined") {
    matcher = window.localStorage.getItem("hasCompletedMilestones");
  }

  useEffect(() => {
    if (completedMilestones?.length >= 3) {
      if (matcher == "aX76fQ93z") {
        setOpenDownloader(false);
      } else {
        setOpenDownloader(true);
      }
    }
  }, [completedMilestones, pathname, matcher]);

  if (
    userPathsLoading ||
    userSoftSkillsLoading ||
    userHardSkillsLoading ||
    // isLoading ||
    isLoadingAllMilestones ||
    userLoading ||
    isLoading
  )
    return (
      <>
        <Loading />
      </>
    );

  if (!user || !allMilestones)
    return (
      <>
        <Loading />
      </>
    );

  if (allMilestonesData.length <= 0)
    return (
      <>
        <Loading />
      </>
    );

  return (
    <section className="bg-[url('/images/dashboard.svg')] bg-cover bg-center bg-repeat w-screen h-screen relative overflow-hidden">
      <Header />

      <PdfDownloader open={openPdfDownloader} setOpen={setOpenDownloader} />
      <SizingOverlay props={handleDivStyle} />
      <SkillsBoard
        //@ts-ignore
        user={user}
        userSoftSkills={userSoftSkills}
        userHardSkills={userHardSkills}
      />
      {/* ) : null} */}

      {visible && (
        // @ts-ignore
        <MilestoneModal
          setVisible={setVisible}
          userSkills={userSkills}
          formattedPathName={formattedPathName}
        />
      )}
      <motion.div
        className="relative w-full select-none"
        style={{
          transform: `scale(${divStyle.scale})`,
          top: `${divStyle.top}px`,
          left: `${divStyle.left}px`,
        }}
        animate={{
          scale: divStyle.scale || 1,
        }}
        transition={{ duration: 0.1, ease: "linear" }}
        onMouseDown={handleMouseDown}
        onWheel={handleZoom}
        onTouchStart={handleMouseDown}
      >
        {/* Milestone 1 */}
        <div className="absolute top-64 left-4">
          <div
            className="relative before:absolute before:content-[url('/images/milestone1_before.svg')] before:-top-10 before:-right-[165px] before:w-full before:h-full
          after:absolute after:content-[url('/images/milestone1_after.svg')] after:-bottom-[235px] after:-right-[125px] after:w-full after:h-full after:object-cover after:object-center
          "
          >
            <Link
              href={`/dashboard/milestone/${allMilestonesData[0]?.id}`}
              className="group relative cursor-pointer z-50 inline-block rounded-full overflow-hidden"
            >
              <Image
                alt="milestone 1"
                width={240.638}
                height={245.156}
                src={"/images/milestone1.png"}
                className="w-[240px] h-[245.156px] rounded-full"
                style={{
                  filter: isMilestoneCompleted(allMilestonesData[0]?.id)
                    ? `saturate(4)`
                    : `saturate(1)`,
                }}
              />
            </Link>
            <span className="w-[134px] h-[32px] absolute top-1/2 left-1/2 z-50 text-white font-bold text-2xl">
              {allMilestonesData[0]?.name}{" "}
              {isMilestoneCompleted(allMilestonesData[0]?.id)
                ? "  (Completed)"
                : ""}
            </span>
          </div>
        </div>
        {/* Milestone 2 */}
        <div className="absolute -top-[35px] left-[490px]">
          <div
            className="relative before:absolute before:content-[url('/images/milestone2_before.svg')] before:top-[80px] before:-right-[335px] before:w-full before:h-full
         after:absolute after:content-[url('/images/milestone2_after.svg')] after:-bottom-[230px] after:-right-[300px] after:w-full after:h-full after:object-cover after:object-center
         "
          >
            <Link
              href={`/dashboard/milestone/${allMilestonesData[1]?.id}`}
              className="relative cursor-pointer z-50 inline-block rounded-full overflow-hidden"
            >
              <Image
                alt="milestone 2"
                width={240.638}
                height={245.156}
                src={"/images/milestone2.svg"}
                className="w-[356px] h-[340.156px] rounded-full"
                style={{
                  filter: isMilestoneCompleted(allMilestonesData[1]?.id)
                    ? `saturate(4)`
                    : `saturate(1)`,
                }}
              />
            </Link>
            <span className="w-[134px] h-[32px] absolute z-50 top-1/2 left-1/2 text-white font-bold text-2xl">
              {allMilestonesData[1]?.name}
              {isMilestoneCompleted(allMilestonesData[1]?.id)
                ? "  (Completed)"
                : ""}
            </span>
          </div>
        </div>
        {/* Milestone 3 */}
        <div className="absolute top-[810px] left-[220px]">
          <div
            className="relative before:absolute before:content-[url('/images/milestone3_before.svg')] before:rotate-2 before:-top-[559px] before:left-[217px] before:w-full before:h-full before:object-cover before:object-center
            after:absolute after:content-[url('/images/milestone3_after.svg')] after:-top-[85px] after:-right-[255px] after:w-full after:h-full after:object-cover after:object-center
            "
          >
            <Link
              href={`/dashboard/milestone/${allMilestonesData[2]?.id}`}
              className="group relative cursor-pointer z-50 inline-block rounded-full overflow-hidden"
            >
              <Image
                alt="milestone 3"
                width={240.638}
                height={245.156}
                src={"/images/milestone3.svg"}
                className="w-[356px] h-[340.156px] rounded-full"
                style={{
                  filter: isMilestoneCompleted(allMilestonesData[2]?.id)
                    ? `saturate(4)`
                    : `saturate(1)`,
                }}
              />
            </Link>
            <span className="w-[134px] h-[32px] absolute top-1/2 left-1/2 z-50 text-white font-bold text-2xl">
              {allMilestonesData[2]?.name}
              {isMilestoneCompleted(allMilestonesData[2]?.id)
                ? "  (Completed)"
                : ""}
            </span>
          </div>
        </div>
        {/* Milestone 4 */}
        <div className="absolute top-[490px] left-[635px]">
          <div
            className="relative after:absolute after:content-[url('/images/milestone4_after.svg')] after:top-[69px] after:-right-[320px] after:w-full after:h-full after:object-cover after:object-center"
          >
            <Link
              href={`/dashboard/milestone/${allMilestonesData[3]?.id}`}
              className="group relative cursor-pointer z-50 inline-block rounded-full overflow-hidden"
            >
              <Image
                alt="milestone 3"
                width={240.638}
                height={245.156}
                src={"/images/milestone4.svg"}
                className="w-[356px] h-[340.156px] rounded-full"
                style={{
                  filter: isMilestoneCompleted(allMilestonesData[3]?.id)
                    ? `saturate(4)`
                    : `saturate(1)`,
                }}
              />
            </Link>
            <span className="w-[134px] h-[32px] absolute z-50 top-1/2 left-1/2 text-white font-bold text-2xl">
              {allMilestonesData[3]?.name}
              {isMilestoneCompleted(allMilestonesData[3]?.id)
                ? "  (Completed)"
                : ""}
            </span>
          </div>
        </div>
        {/* Milestone 5 */}
        <div className="absolute -top-[50px] left-[1000px]">
          <div className="">
            <Link
              href={`/dashboard/milestone/${allMilestonesData[4]?.id}}`}
              className="group relative cursor-pointer z-50 inline-block rounded-full overflow-hidden"
            >
              <Image
                alt="milestone 5"
                width={240.638}
                height={245.156}
                src={"/images/milestone5.svg"}
                className="w-[240.638px] h-[245.156px] rounded-full"
                style={{
                  filter: isMilestoneCompleted(allMilestonesData[4]?.id)
                    ? `saturate(4)`
                    : `saturate(1)`,
                }}
              />
            </Link>
            <span className="w-[134px] h-[32px] absolute top-1/2 left-1/2 z-50 text-white font-bold text-2xl">
              {allMilestonesData[4]?.name}
              {isMilestoneCompleted(allMilestonesData[4]?.id)
                ? " (Completed)"
                : ""}
            </span>
          </div>
        </div>
        {/* Milestone 6 */}
        <div className="absolute top-[700px] left-[1165px]">
          <div
            className="relative before:absolute before:content-[url('/images/milestone6_before.svg')] before:rotate-2 before:-top-[5px] before:-left-[240px] before:w-full before:h-full before:object-cover before:object-center
             after:absolute after:content-[url('/images/milestone6_after.svg')] after:-top-[95px] after:-right-[125px] after:w-full after:h-full after:object-cover after:object-center"
          >
            <Link
              href={`/dashboard/milestone/${allMilestonesData[5]?.id}`}
              className="group relative cursor-pointer z-50 inline-block rounded-full overflow-hidden"
            >
              <Image
                alt="milestone 6"
                width={240.638}
                height={245.156}
                src={"/images/milestone6.svg"}
                className="min-w-[240.638px] min-h-[245.156px] rounded-full"
                style={{
                  filter: isMilestoneCompleted(allMilestonesData[5]?.id)
                    ? `saturate(4)`
                    : `saturate(1)`,
                }}
              />
            </Link>
            <span className="w-[134px] h-[32px] absolute top-1/2 left-1/2 z-50 text-white font-bold text-2xl">
              {allMilestonesData[5]?.name}
              {isMilestoneCompleted(allMilestonesData[5]?.id)
                ? "  (Completed)"
                : ""}
            </span>
          </div>
        </div>
        {/* Milestone 7 */}
        <div className="absolute top-[420px] left-[1290px]">
          <div
            className="relative before:absolute before:content-[url('/images/milestone7_before.svg')] before:rotate-2 before:-top-[340px] before:-left-[115px] before:w-full before:h-full before:object-cover before:object-center
            "
          >
            <Link
              href={`/dashboard/milestone/${allMilestonesData[6]?.id}`}
              className="group relative cursor-pointer z-50 inline-block rounded-full overflow-hidden"
            >
              <Image
                alt="milestone 7"
                width={240.638}
                height={245.156}
                src={"/images/milestone7.svg"}
                className="min-w-[240.638px] min-h-[245.156px] rounded-full"
                style={{
                  filter: isMilestoneCompleted(allMilestonesData[6]?.id)
                    ? `saturate(4)`
                    : `saturate(1)`,
                }}
              />
            </Link>
            <span className="w-[134px] h-[32px] absolute top-1/2 left-1/2 z-50 text-white font-bold text-2xl">
              {allMilestonesData[6]?.name}
              {isMilestoneCompleted(allMilestonesData[6]?.id)
                ? "  (Completed)"
                : ""}
            </span>
          </div>
        </div>

        {allMilestonesData?.slice(7).map((milestone, index) => (
          <div
            key={index}
            className={`absolute`}
            style={{
              left: 1200 + 300 * (index % 4 === 3 ? index + 0.5 : index + 1),
              top:
                index % 4 === 0
                  ? 0
                  : index % 4 === 1
                  ? 420
                  : index % 4 === 2
                  ? 700
                  : 190,
            }}
          >
            <div
              key={index}
              className={`relative ${
                index % 4 === 0
                  ? index === 0
                    ? "before:absolute before:content-[url('/images/milestone7_before.svg')] before:rotate-[130deg] before:top-[50px] before:-left-[220px] before:w-full before:h-full before:object-cover before:object-center after:absolute after:content-[url('/images/milestone7_before.svg')] after:top-[180px] after:-right-[179px] after:w-full after:h-full after:object-cover after:object-center"
                    : "before:absolute before:content-[url('/images/milestone4_after.svg')] before:rotate-2 before:-top-[40px] before:-left-[190px] before:rotate-[160deg] before:w-full before:h-full before:object-cover before:object-center after:absolute after:content-[url('/images/milestone3_before.svg')] after:top-[190px] after:-left-[220px] after:rotate-[20deg] after:scale-110 after:w-full after:h-full after:object-cover after:object-center"
                  : index % 4 === 1
                  ? index === 1
                    ? "before:absolute before:content-[url('/images/milestone4_after.svg')] before:top-[50px] before:-left-[320px] before:w-full before:h-full before:object-cover before:object-center"
                    : "before:absolute before:content-[url('/images/milestone3_before.svg')] before:rotate-2 before:top-[10px] before:-left-[300px] before:rotate-[50deg] before:scale-110 before:w-full before:h-full before:object-cover before:object-center after:absolute after:content-[url('/images/milestone4_after.svg')] after:-top-[180px] after:-left-[40px] after:-rotate-[110deg] after:w-full after:h-full after:object-cover after:object-center"
                  : index % 4 === 2
                  ? "before:absolute before:content-[url('/images/milestone1_before.svg')] before:-top-[100px] before:-left-[200px] before:rotate-[50deg] before:w-full before:h-full before:object-cover before:object-center"
                  : "before:absolute before:content-[url('/images/milestone4_after.svg')] before:rotate-2 before:-top-[20px] before:-left-[240px] before:rotate-[160deg] before:w-full before:h-full before:object-cover before:object-center after:absolute after:content-[url('/images/milestone3_before.svg')] after:-top-[80px] after:-left-[190px] after:rotate-[90deg] after:w-full after:h-full after:object-cover after:object-center"
              }`}
            >
              <Link
                href={
                  index <= 11
                    ? `/dashboard/milestone/${allMilestonesData[index + 7]?.id}`
                    : isMilestoneCompleted(allMilestonesData[index + 6]?.id)
                    ? `/dashboard/milestone/${allMilestonesData[index + 7]?.id}`
                    : "#"
                }
                className={`cursor-pointer z-50 inline-block rounded-full overflow-hidden ${
                  index <= 11
                    ? ""
                    : isMilestoneCompleted(allMilestonesData[index + 6]?.id)
                    ? ""
                    : "sepia"
                }`}
                onClick={
                  index <= 11
                    ? undefined
                    : isMilestoneCompleted(allMilestonesData[index + 6]?.id)
                    ? undefined
                    : (event) => {
                        event.preventDefault();
                        setFormattedPathName(allMilestonesData[index + 7]?.id);
                        // setSelectedData();
                        // setPathId();
                        handleModal();
                      }
                }
              >
                <Image
                  alt={`milestone ${index}`}
                  width={240.638}
                  height={245.156}
                  src={`/images/milestone${(index % 6) + 2}.svg`}
                  className={`min-w-[240.638px] min-h-[245.156px] rounded-full`}
                  style={{
                    filter: isMilestoneCompleted(
                      allMilestonesData[index + 7]?.id
                    )
                      ? `saturate(4)`
                      : `saturate(1)`,
                  }}
                />
              </Link>
              <span className="w-[134px] h-[32px] absolute z-50 top-1/2 left-1/2 text-white font-bold text-2xl">
                {allMilestonesData[index + 7]?.name}
                {isMilestoneCompleted(allMilestonesData[index + 7]?.id)
                  ? "  (Completed)"
                  : ""}
              </span>
            </div>
          </div>
        ))}
      </motion.div>
    </section>
  );
}
