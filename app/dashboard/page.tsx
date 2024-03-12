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
import { useParams, usePathname } from "next/navigation";
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

export default function DashboardPage() {
  const dispatch = useAppDispatch();
  const [selectedData, setSelectedData] = useState([]);
  const [formattedPathName, setFormattedPathName] = useState(null);
  const userEmail =
    typeof window !== "undefined" ? localStorage.getItem("userData") : null;
  const parsedEmail = userEmail ? JSON.parse(userEmail) : null;
  const email = parsedEmail ? parsedEmail.email : null;

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
  } = useQuery({
    queryKey: ["completedMilestones"],
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

  const minZoom = 0.7;
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

  // useEffect(() => {
  //   document.addEventListener("mousemove", handleMouseMove as any);
  //   document.addEventListener("mouseup", handleMouseUp);

  //   document.addEventListener("touchmove", handleMouseMove as any);
  //   document.addEventListener("touchend", handleMouseUp);

  //   return () => {
  //     document.removeEventListener("mousemove", handleMouseMove as any);
  //     document.removeEventListener("mouseup", handleMouseUp);

  //     document.removeEventListener("touchmove", handleMouseMove as any);
  //     document.removeEventListener("touchend", handleMouseUp);
  //   };
  // }, [handleMouseMove, handleMouseUp, divStyle.scale, divStyle.isDragging]);

  const [openPdfDownloader, setOpenDownloader] = useState(false);

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

  useEffect(() => {
    // Call the isMilestoneCompleted function for each milestone
    const newCompletionStatus = allMilestonesData.map(
      (milestone, index) =>
        isMilestoneCompleted(milestone.id) || milestoneCompletion[index]
    );

    setMilestoneCompletion(newCompletionStatus);
  }, [allMilestonesData, completedMilestones]);

  useEffect(() => {
    if (completedMilestones?.length == 18) {
      setOpenDownloader(true);
    }
  }, [completedMilestones]);

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

  if (!user)
    return (
      <>
        <Loading />
      </>
    );

  return (
    <section className="bg-[url('/images/dashboard.svg')]   bg-cover bg-center bg-repeat w-screen h-screen relative overflow-hidden">
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
        className="relative w-[5000.75px] "
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
        onTouchStart={handleMouseDown}
        onWheel={handleZoom}
      >
        {/* Milestone 1 */}
        <div className="absolute top-64 left-4">
          <div
            className="relative before:absolute before:content-[url('/images/milestone1_before.svg')] before:-top-10 before:-right-[165px] before:w-full before:h-full
          after:absolute after:content-[url('/images/milestone1_after.svg')] after:-bottom-[235px] after:-right-[125px] after:w-full after:h-full after:object-cover after:object-center
          "
          >
            <Link
              href={`/dashboard/milestone/${allMilestonesData[3]?.id}`}
              className="group relative cursor-pointer"
            >
              <Image
                alt="milestone 1"
                width={240.638}
                height={245.156}
                src={"/images/milestone1.png"}
                className="w-[300px] h-[245.156px] z-40 "
              />
              <span className="w-[134px] h-[32px] h-full absolute -bottom-[160px] left-[80px] z-50 text-white font-bold text-xl shadow-sm">
                {allMilestonesData[3]?.name}
              </span>
            </Link>
          </div>
        </div>
        {/* Milestone 2 */}
        <div className="absolute -top-[35px] left-[490px]">
          <div
            className="z-0 relative before:absolute before:content-[url('/images/milestone2_before.svg')] before:top-[80px] before:-right-[335px] before:w-full before:h-full
         after:absolute after:content-[url('/images/milestone2_after.svg')] after:-bottom-[230px] after:-right-[300px] after:w-full after:h-full after:object-cover after:object-center
         "
          >
            <Link
              href={`/dashboard/milestone/${allMilestonesData[4]?.id}`}
              className="group relative cursor-pointer"
            >
              <Image
                alt="milestone 2"
                width={240.638}
                height={245.156}
                src={"/images/milestone2.svg"}
                className="w-full h-full  z-40"
              />
              <span className="w-[134px] h-[32px] h-full absolute -bottom-[160px] left-[80px] z-50 text-white font-bold text-xl shadow-sm">
                {allMilestonesData[4]?.name}
              </span>
            </Link>
          </div>
        </div>
        {/* Milestone 3 */}
        <div className="absolute top-[810px] left-[220px]">
          <div
            className="z-0 relative before:absolute before:content-[url('/images/milestone3_before.svg')] before:rotate-2 before:-top-[559px] before:left-[217px] before:w-full before:h-full before:object-cover before:object-center
            after:absolute after:content-[url('/images/milestone3_after.svg')] after:-top-[85px] after:-right-[255px] after:w-full after:h-full after:object-cover after:object-center
            "
          >
            <Link
              href={`/dashboard/milestone/${allMilestonesData[5]?.id}`}
              className="group relative cursor-pointer"
            >
              <Image
                alt="milestone 3"
                width={240.638}
                height={245.156}
                src={"/images/milestone3.svg"}
                className="w-full h-full z-40 "
              />
              <span className="w-[134px] h-[32px] h-full absolute -bottom-[160px] left-[80px] z-50 text-white font-bold text-xl shadow-sm">
                {allMilestonesData[5]?.name}
              </span>
            </Link>
          </div>
        </div>
        {/* Milestone 4 */}
        <div className="absolute top-[500px] left-[680px]">
          <div
            className="z-10 relative
              after:absolute after:content-[url('/images/milestone4_after.svg')] after:top-[90px] after:-right-[260px] after:w-full after:h-full after:object-cover after:object-center"
          >
            <Link
              href={`/dashboard/milestone/${allMilestonesData[6]?.id}`}
              className="group relative cursor-pointer"
            >
              <Image
                alt="milestone 3"
                width={240.638}
                height={245.156}
                src={"/images/milestone3.svg"}
                className="w-full h-full z-40 "
              />
              <span className="w-[134px] h-[32px] h-full absolute -bottom-[160px] left-[80px] z-50 text-white font-bold text-xl shadow-sm">
                {allMilestonesData[6]?.name}
              </span>
            </Link>
          </div>
        </div>
        {/* Milestone 5 */}
        <div className="absolute -top-[50px] left-[1000px] z-40">
          <div className="">
            <Link
              href={`/dashboard/milestone/${allMilestonesData[7]?.id}}`}
              className="group relative cursor-pointer"
            >
              <Image
                alt="milestone 5"
                width={240.638}
                height={245.156}
                src={"/images/milestone5.svg"}
                className="w-full h-full "
              />
              <span className="w-[134px] h-[32px] h-full absolute -bottom-[160px] left-[80px] z-50 text-white font-bold text-xl shadow-sm">
                {allMilestonesData[7]?.name}
              </span>
            </Link>
          </div>
        </div>
        {/* Milestone 6 */}
        <div className="absolute top-[735px] left-[1165px] z-40">
          <div
            className="z-0 relative before:absolute before:content-[url('/images/milestone6_before.svg')] before:rotate-2 before:-top-[40px] before:-left-[240px] before:w-full before:h-full before:object-cover before:object-center
             after:absolute after:content-[url('/images/milestone6_after.svg')] after:-top-[115px] after:-right-[125px] after:w-full after:h-full after:object-cover after:object-center"
          >
            <Link
              href={`/dashboard/milestone/${allMilestonesData[8]?.id}`}
              className="group relative cursor-pointer"
            >
              <Image
                alt="milestone 6"
                width={240.638}
                height={245.156}
                src={"/images/milestone6.svg"}
                className="w-full h-full "
              />
              <span className="w-full h-full  absolute -bottom-[160px] left-[80px] z-50 text-white font-bold text-xl shadow-sm">
                {allMilestonesData[8]?.name}
              </span>
            </Link>
          </div>
        </div>
        {/* Milestone 7 */}
        <div className="absolute top-[420px] left-[1290px] z-30">
          <div
            className="relative before:absolute before:content-[url('/images/milestone7_before.svg')] before:rotate-2 before:-top-[340px] before:-left-[115px] before:w-full before:h-full before:object-cover before:object-center
            "
          >
            <Link
              href={`/dashboard/milestone/${allMilestonesData[9]?.id}`}
              className="group relative cursor-pointer"
            >
              <Image
                alt="milestone 7"
                width={240.638}
                height={245.156}
                src={"/images/milestone7.svg"}
                className="min-w-[240.638px] min-h-[245.156px] "
              />
              <span className="w-full h-full  absolute -bottom-[160px] left-[80px] z-50 text-white font-bold text-xl shadow-sm">
                {allMilestonesData[9]?.name}
              </span>
            </Link>
          </div>
        </div>

        {/* milestone 8 */}

        <div className="absolute top-[19rem] left-[91rem]">
          <div
            className="z-0 relative  after:object-cover after:object-center
         "
          >
            <Link
              href={`/dashboard/milestone/${allMilestonesData[10]?.id}`}
              className="group relative cursor-pointer"
            >
              <Image
                alt="milestone 2"
                width={240.638}
                height={245.156}
                src={"/images/milestone8.png"}
                className="w-full h-full z-40  rotate-[-39deg]"
              />

              <span className="w-full h-full  absolute -bottom-[160px] left-[80px] z-50 text-white font-bold text-xl shadow-sm">
                {allMilestonesData[10]?.name}
              </span>
            </Link>
          </div>
        </div>
        {/* milestone 9 */}

        <div className="absolute top-[15rem] left-[106rem]">
          <div
            className="z-0 relative  after:object-cover after:object-center
         "
          >
            <Link
              href={`/dashboard/milestone/${allMilestonesData[11]?.id}`}
              className="group relative cursor-pointer"
            >
              <Image
                alt="milestone 2"
                width={240.638}
                height={245.156}
                src={"/images/milestone19.png"}
                className="w-full h-full z-40 scale-[1.05] rotate-[-25deg]"
              />

              <span className=" absolute top-[10px] left-[130px] max-w-[250px] whitespace-pre-wrap z-50 text-xl font-bold whitespace-nowrap text-white">
                {allMilestonesData[11]?.name}
              </span>
            </Link>
          </div>
        </div>
        {/* milestone 10 */}

        <div className="absolute top-[14rem] left-[121rem]">
          <div
            className="z-0 relative  after:object-cover after:object-center
         "
          >
            <Link
              href={`/dashboard/milestone/${allMilestonesData[12]?.id}`}
              className="group relative cursor-pointer"
            >
              <Image
                alt="milestone 2"
                width={240.638}
                height={245.156}
                src={"/images/milestone19.png"}
                className="w-full h-full z-40"
              />

              <span className=" absolute bottom-[4%] left-[80px] z-50 text-xl font-bold max-w-[250px] whitespace-pre-wrap text-white">
                {allMilestonesData[12]?.name}
              </span>
            </Link>
          </div>
        </div>
        {/* milestone 11 */}

        <div className="absolute top-[14rem] left-[136rem]">
          <div
            className="z-0 relative  after:object-cover after:object-center
         "
          >
            <Link
              href={`/dashboard/milestone/${allMilestonesData[13]?.id}`}
              className="group relative cursor-pointer"
            >
              <Image
                alt="milestone 2"
                width={240.638}
                height={245.156}
                src={"/images/milestone19.png"}
                className="w-full h-full z-40"
              />

              <span className=" absolute top-[10px] left-[130px] z-50 text-xl font-bold whitespace-nowrap text-white">
                {allMilestonesData[13]?.name}
              </span>
            </Link>
          </div>
        </div>
        {/* milestone 12 */}

        <div className="absolute top-[14rem] left-[150rem]">
          <div
            className="z-0 relative  after:object-cover after:object-center
         "
          >
            <Link
              href={`/dashboard/milestone/${allMilestonesData[14]?.id}`}
              className="group relative cursor-pointer"
            >
              <Image
                alt="milestone 2"
                width={240.638}
                height={245.156}
                src={"/images/milestone19.png"}
                className="w-full h-full z-40"
              />

              <span className=" absolute bottom-[10px] left-[100px] z-50 text-xl font-bold max-w-[250px] whitespace-pre-wrap text-white">
                {allMilestonesData[14]?.name}
              </span>
            </Link>
          </div>
        </div>

        {/* milestone 13 */}

        <div className="absolute top-[14rem] left-[166rem]">
          <div
            className="z-0 relative 
         "
          >
            <Link
              href={`/dashboard/milestone/${allMilestonesData[15]?.id}`}
              className="group relative cursor-pointer"
            >
              <Image
                alt="milestone 2"
                width={240.638}
                height={245.156}
                src={"/images/milestone19.png"}
                className="w-full h-full z-40"
              />

              <span className=" absolute top-[10px] left-[130px] z-50 text-xl font-bold max-w-[250px] whitespace-pre-wrap text-white">
                {allMilestonesData[15]?.name}
              </span>
            </Link>
          </div>
        </div>
        {/* milestone 14 */}

        <div className="absolute top-[14rem] left-[179rem]">
          <div
            className="z-0 relative 
         "
          >
            <Link
              href={`/dashboard/milestone/${allMilestonesData[16]?.id}`}
              className="group relative cursor-pointer"
            >
              <Image
                alt="milestone 2"
                width={240.638}
                height={245.156}
                src={"/images/milestone19.png"}
                className="w-full h-full z-40"
              />

              <span className=" absolute top-[-8%] left-[130px]  z-50 text-xl font-bold max-w-[250px] whitespace-pre-wrap text-white">
                {allMilestonesData[16]?.name}
              </span>
            </Link>
          </div>
        </div>

        {/* milestone 15 */}

        <div className="absolute top-[14rem] left-[195rem]">
          <div
            className="z-0 relative 
         "
          >
            <Link
              href={`/dashboard/milestone/${allMilestonesData[17]?.id}`}
              className="group relative cursor-pointer"
            >
              <Image
                alt="milestone 2"
                width={240.638}
                height={245.156}
                src={"/images/milestone19.png"}
                className="w-full h-full z-40"
              />

              <span className=" absolute top-[-8%] left-[130px] max-w-[250px] whitespace-pre-wrap  z-50 text-xl font-bold text-white">
                {allMilestonesData[17]?.name}
              </span>
            </Link>
          </div>
        </div>

        {/* milestone 16 */}

        <div className="absolute top-[14rem] left-[210rem]">
          <div
            className="z-0 relative 
         "
          >
            <Link
              href={`/dashboard/milestone/${allMilestonesData[18]?.id}`}
              className="group relative cursor-pointer"
            >
              <Image
                alt="milestone 2"
                width={240.638}
                height={245.156}
                src={"/images/milestone19.png"}
                className="w-full h-full z-40"
              />

              <span className=" absolute bottom-[4%] left-[80px] max-w-[250px] whitespace-pre-wrap  z-50 text-xl font-bold  text-white">
                {allMilestonesData[18]?.name}
              </span>
            </Link>
          </div>
        </div>
        {/* milestone 17 */}

        <div className="absolute top-[14rem] left-[225rem]">
          <div
            className="z-0 relative 
         "
          >
            <Link
              href={`/dashboard/milestone/${allMilestonesData[19]?.id}`}
              className="group relative cursor-pointer"
            >
              <Image
                alt="milestone 2"
                width={240.638}
                height={245.156}
                src={"/images/milestone19.png"}
                className="w-full h-full z-40"
              />

              <span className=" absolute top-[-8%] left-[80px] max-w-[250px] whitespace-pre-wrap  z-50 text-xl font-bold  text-white">
                {allMilestonesData[19]?.name}
              </span>
            </Link>
          </div>
        </div>

        {/* milestone 18 */}

        <div className="absolute top-[14rem] left-[240rem]">
          <div
            className="z-0 relative 
         "
          >
            <Link
              href={`/dashboard/milestone/${allMilestonesData[20]?.id}`}
              className="group relative cursor-pointer"
            >
              <Image
                alt="milestone 2"
                width={240.638}
                height={245.156}
                src={"/images/milestone19.png"}
                className="w-full h-full z-40"
              />

              <span className=" absolute bottom-[10px] left-[80px] max-w-[250px] whitespace-pre-wrap z-50 text-xl font-bold  text-white">
                {allMilestonesData[20]?.name}
              </span>
            </Link>
          </div>
        </div>

        {/* milestone 19 */}

        <div className="absolute top-[14rem] left-[255rem]">
          <div
            className="z-0 relative 
         "
          >
            <Link
              href={`/dashboard/milestone/${allMilestonesData[0]?.id}`}
              className="group relative cursor-pointer"
            >
              <Image
                alt="milestone 2"
                width={240.638}
                height={245.156}
                src={"/images/milestone19.png"}
                className="w-full h-full z-40"
              />

              <span className=" absolute top-[-8%] left-[80px] max-w-[250px] whitespace-pre-wrap z-50 text-xl font-bold  text-white">
                {allMilestonesData[0]?.name}
              </span>
            </Link>
          </div>
        </div>

        {/* milestone 20 */}

        <div className="absolute top-[14rem] left-[270rem]">
          {isMilestoneCompleted(allMilestonesData[0]?.id) ? (
            <div
              className="z-0 relative 
         "
            >
              <Link
                href={`/dashboard/milestone/${allMilestonesData[1]?.id}`}
                className="group relative cursor-pointer"
              >
                <Image
                  alt="milestone 2"
                  width={240.638}
                  height={245.156}
                  src={"/images/milestone19.png"}
                  className="w-full h-full z-40"
                />

                <span className=" absolute top-[-14%] shadow-md left-[140px] max-w-[250px] z-50 text-xl font-bold whitespace-nowrap text-white whitespace-pre-wrap">
                  {allMilestonesData[1]?.name}
                </span>
              </Link>
            </div>
          ) : (
            <div className="z-0 relative ">
              <div
                onMouseEnter={() => handleMouseAction(2, true)}
                onMouseLeave={() => handleMouseAction(2, false)}
                onClick={() => {
                  setFormattedPathName(allMilestonesData[1]?.id);
                  // setSelectedData();
                  setPathId(2);
                  handleModal();
                }}
                className="group relative"
              >
                <Image
                  alt="milestone 2"
                  width={240.638}
                  height={245.156}
                  src={"/images/milestone19.png"}
                  className="w-full h-full z-40 opacity-50 "
                />
                <span className=" absolute bottom-[10px] left-[130px] max-w-[250px] z-50 text-xl font-bold whitespace-nowrap text-white">
                  {allMilestonesData[1]?.name}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* milestone 21 */}

        <div className="absolute top-[14rem] left-[289rem]">
          {isMilestoneCompleted(allMilestonesData[1]?.id) ? (
            <div
              className="z-0 relative 
         "
            >
              <Link
                href={`/dashboard/milestone/${allMilestonesData[2]?.id}`}
                className="group relative cursor-pointer"
              >
                <Image
                  alt="milestone 2"
                  width={240.638}
                  height={245.156}
                  src={"/images/milestone19.png"}
                  className="w-full h-full z-40"
                />

                <span className=" absolute top-[10px] left-[130px] z-50 text-xl font-bold whitespace-nowrap text-white">
                  {allMilestonesData[2]?.name}
                </span>
              </Link>
            </div>
          ) : (
            <div className="z-0 relative ">
              <div
                onMouseEnter={() => handleMouseAction(2, true)}
                onMouseLeave={() => handleMouseAction(2, false)}
                onClick={() => {
                  setFormattedPathName(allMilestonesData[2]?.id);
                  // setSelectedData();
                  setPathId(2);
                  handleModal();
                }}
                className="group relative"
              >
                <Image
                  alt="milestone 2"
                  width={240.638}
                  height={245.156}
                  src={"/images/milestone19.png"}
                  className="w-full h-full z-40 opacity-50 "
                />
                <span className=" absolute top-[10px] left-[130px] z-50 text-xl font-bold whitespace-nowrap text-white">
                  {allMilestonesData[2]?.name}
                </span>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </section>
  );
}
