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

  function isMilestoneCompleted(milestoneId: number) {
    return (
      completedMilestones?.some(
        (milestone) =>
          milestone.milestoneId === milestoneId && milestone.completed
      ) ?? false
    );
  }

  const pathname = usePathname();

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
    if (completedMilestones?.length == 21) {
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

  if (!user) return <>Something went wrong</>;

  return (
    <section className="bg-[url('/images/dashboard.svg')] bg-cover bg-center bg-repeat w-screen h-screen relative overflow-hidden">
      <Header />
      <PdfDownloader open={openPdfDownloader} setOpen={setOpenDownloader} />
      {/* {!userHardSkillsLoading && !userSoftSkillsLoading ? ( */}
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
        className="relative w-[5000.75px]"
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
              href={`/dashboard/milestone/${allMilestonesData[0]?.id}`}
              className="group relative cursor-pointer"
            >
              <Image
                alt="milestone 1"
                width={240.638}
                height={245.156}
                src={"/images/milestone1.png"}
                className="w-[300px] h-[245.156px] z-40 "
              />
              <Image
                alt="milestone 1"
                width={134}
                height={32}
                src={"/images/milestone1_title.svg"}
                className="w-[134px] h-[32px] h-full absolute -bottom-[120px] left-[80px] z-50"
              />
            </Link>
          </div>
        </div>
        {/* Milestone 2 */}
        <div className="absolute -top-[35px] left-[490px]">
          {isMilestoneCompleted(allMilestonesData[0]?.id) ? (
            <div
              className="z-0 relative before:absolute before:content-[url('/images/milestone2_before.svg')] before:top-[80px] before:-right-[335px] before:w-full before:h-full
         after:absolute after:content-[url('/images/milestone2_after.svg')] after:-bottom-[230px] after:-right-[300px] after:w-full after:h-full after:object-cover after:object-center
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
                  src={"/images/milestone2.svg"}
                  className="w-full h-full  z-40"
                />
                <Image
                  alt="milestone 2"
                  width={134}
                  height={32}
                  src={"/images/milestone2_title.svg"}
                  className="w-[134px] h-[32px] h-full absolute top-[10px] left-[130px] z-50"
                />
              </Link>
            </div>
          ) : (
            <div
              className="z-0 relative before:absolute before:content-[url('/images/milestone2_before.svg')] before:top-[80px] before:-right-[335px] before:w-full before:h-full
        after:absolute after:content-[url('/images/milestone2_after.svg')] after:-bottom-[230px] after:-right-[300px] after:w-full after:h-full after:object-cover after:object-center
        "
            >
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
                  src={"/images/milestone2.svg"}
                  className="w-full h-full z-40 opacity-50 "
                />
                <Image
                  alt="milestone 2"
                  width={134}
                  height={32}
                  src={"/images/milestone2_title.svg"}
                  className="w-[134px] h-[32px] h-full absolute top-[10px] left-[130px] z-50"
                />
              </div>
            </div>
          )}
        </div>
        {/* Milestone 3 */}
        <div className="absolute top-[810px] left-[220px]">
          {isMilestoneCompleted(allMilestonesData[1]?.id) ? (
            <div
              className="z-0 relative before:absolute before:content-[url('/images/milestone3_before.svg')] before:rotate-2 before:-top-[559px] before:left-[217px] before:w-full before:h-full before:object-cover before:object-center
            after:absolute after:content-[url('/images/milestone3_after.svg')] after:-top-[85px] after:-right-[255px] after:w-full after:h-full after:object-cover after:object-center
            "
            >
              <Link
                href={`/dashboard/milestone/${allMilestonesData[2]?.id}`}
                className="group relative cursor-pointer"
              >
                <Image
                  alt="milestone 3"
                  width={240.638}
                  height={245.156}
                  src={"/images/milestone3.svg"}
                  className="w-full h-full z-40 "
                />
                <Image
                  alt="milestone 3"
                  width={134}
                  height={32}
                  src={"/images/milestone3_title.svg"}
                  className="w-[134px] h-[32px] h-full absolute -top-[20px] left-[70px] z-50"
                />
              </Link>
            </div>
          ) : (
            <div
              className="z-0 relative before:absolute before:content-[url('/images/milestone3_before.svg')] before:rotate-2 before:-top-[559px] before:left-[217px] before:w-full before:h-full before:object-cover before:object-center
          after:absolute after:content-[url('/images/milestone3_after.svg')] after:-top-[85px] after:-right-[255px] after:w-full after:h-full after:object-cover after:object-center
          "
            >
              <div
                onMouseEnter={() => handleMouseAction(3, true)}
                onMouseLeave={() => handleMouseAction(3, false)}
                onClick={() => {
                  setFormattedPathName(allMilestonesData[2]?.id);

                  // setSelectedData();
                  setPathId(3);

                  handleModal();
                }}
                className="group relative"
              >
                <Image
                  alt="milestone 3"
                  width={240.638}
                  height={245.156}
                  src={"/images/milestone3.svg"}
                  className="w-full h-full z-40 opacity-50 "
                />
                <Image
                  alt="milestone 3"
                  width={134}
                  height={32}
                  src={"/images/milestone3_title.svg"}
                  className="w-[134px] h-[32px] h-full absolute -top-[20px] left-[70px] z-50"
                />
              </div>
            </div>
          )}
        </div>
        {/* Milestone 4 */}
        <div className="absolute top-[400px] left-[580px]">
          {isMilestoneCompleted(allMilestonesData[2]?.id) ? (
            <div
              className="z-10 relative
              after:absolute after:content-[url('/images/milestone4_after.svg')] after:top-[120px] after:-right-[340px] after:w-full after:h-full after:object-cover after:object-center"
            >
              <Link
                href={`/dashboard/milestone/${allMilestonesData[3]?.id}`}
                className="group relative cursor-pointer"
              >
                <Image
                  alt="milestone 4"
                  width={240.638}
                  height={245.156}
                  src={"/images/milestone4.svg"}
                  className="w-full h-full  z-40"
                />
              </Link>
            </div>
          ) : (
            <div
              className="z-10 relative
            after:absolute after:content-[url('/images/milestone4_after.svg')] after:top-[120px] after:-right-[340px] after:w-full after:h-full after:object-cover after:object-center"
            >
              <div
                onMouseEnter={() => handleMouseAction(4, true)}
                onMouseLeave={() => handleMouseAction(4, false)}
                onClick={() => {
                  setFormattedPathName(allMilestonesData[3]?.id);

                  setPathId(4);

                  handleModal();
                }}
                className="group"
              >
                <Image
                  alt="milestone 4"
                  width={240.638}
                  height={245.156}
                  src={"/images/milestone4.svg"}
                  className="w-full h-full z-40 opacity-50"
                />
              </div>
            </div>
          )}
        </div>
        {/* Milestone 5 */}
        <div className="absolute -top-[50px] left-[1000px] z-40">
          {isMilestoneCompleted(allMilestonesData[3]?.id) ? (
            <div className="">
              <Link
                href={`/dashboard/milestone/${allMilestonesData[4]?.id}}`}
                className="group relative cursor-pointer"
              >
                <Image
                  alt="milestone 5"
                  width={240.638}
                  height={245.156}
                  src={"/images/milestone5.svg"}
                  className="w-full h-full "
                />
                <Image
                  alt="milestone 5"
                  width={134}
                  height={32}
                  src={"/images/milestone5_title.svg"}
                  className="w-[134px] h-[32px] h-full absolute -bottom-[10px] left-[30px] z-50"
                />
              </Link>
            </div>
          ) : (
            <div className="">
              <div
                onMouseEnter={() => handleMouseAction(5, true)}
                onMouseLeave={() => handleMouseAction(5, false)}
                onClick={() => {
                  setFormattedPathName(allMilestonesData[4]?.id);

                  setPathId(5);
                  handleModal();
                }}
                className="group relative"
              >
                <Image
                  alt="milestone 5"
                  width={240.638}
                  height={245.156}
                  src={"/images/milestone5.svg"}
                  className="w-full h-full opacity-50"
                />
                <Image
                  alt="milestone 5"
                  width={134}
                  height={32}
                  src={"/images/milestone5_title.svg"}
                  className="w-[134px] h-[32px] h-full absolute -bottom-[10px] left-[30px] z-50"
                />
              </div>
            </div>
          )}
        </div>
        {/* Milestone 6 */}
        <div className="absolute top-[735px] left-[1165px] z-40">
          {isMilestoneCompleted(allMilestonesData[4]?.id) ? (
            <div
              className="z-0 relative before:absolute before:content-[url('/images/milestone6_before.svg')] before:rotate-2 before:-top-[40px] before:-left-[240px] before:w-full before:h-full before:object-cover before:object-center
             after:absolute after:content-[url('/images/milestone6_after.svg')] after:-top-[115px] after:-right-[125px] after:w-full after:h-full after:object-cover after:object-center"
            >
              <Link
                href={`/dashboard/milestone/${allMilestonesData[5]?.id}`}
                className="group relative cursor-pointer"
              >
                <Image
                  alt="milestone 6"
                  width={240.638}
                  height={245.156}
                  src={"/images/milestone6.svg"}
                  className="w-full h-full "
                />
                <Image
                  alt="milestone 6"
                  width={134}
                  height={32}
                  src={"/images/milestone6_title.svg"}
                  className="w-[134px] h-[32px] h-full absolute -bottom-[10px] left-[30px] z-50"
                />
              </Link>
            </div>
          ) : (
            <div
              className="z-0 relative before:absolute before:content-[url('/images/milestone6_before.svg')] before:rotate-2 before:-top-[40px] before:-left-[240px] before:w-full before:h-full before:object-cover before:object-center
            after:absolute after:content-[url('/images/milestone6_after.svg')] after:-top-[115px] after:-right-[125px] after:w-full after:h-full after:object-cover after:object-center"
            >
              <div
                onMouseEnter={() => handleMouseAction(6, true)}
                onMouseLeave={() => handleMouseAction(6, false)}
                onClick={() => {
                  setFormattedPathName(allMilestonesData[5]?.id);

                  setPathId(6);
                  handleModal();
                }}
                className="group relative"
              >
                <Image
                  alt="milestone 6"
                  width={240.638}
                  height={245.156}
                  src={"/images/milestone6.svg"}
                  className="w-full h-full opacity-50"
                />
                <Image
                  alt="milestone 6"
                  width={134}
                  height={32}
                  src={"/images/milestone6_title.svg"}
                  className="w-[134px] h-[32px] h-full absolute -bottom-[10px] left-[30px] z-50"
                />
              </div>
            </div>
          )}
        </div>
        {/* Milestone 7 */}
        <div className="absolute top-[420px] left-[1290px] z-30">
          {isMilestoneCompleted(allMilestonesData[5]?.id) ? (
            <div
              className="relative before:absolute before:content-[url('/images/milestone7_before.svg')] before:rotate-2 before:-top-[340px] before:-left-[115px] before:w-full before:h-full before:object-cover before:object-center
            "
            >
              <Link
                href={`/dashboard/milestone/${allMilestonesData[6]?.id}`}
                className="group relative cursor-pointer"
              >
                <Image
                  alt="milestone 7"
                  width={240.638}
                  height={245.156}
                  src={"/images/milestone7.svg"}
                  className="min-w-[240.638px] min-h-[245.156px] "
                />
                <Image
                  alt="milestone 7"
                  width={134}
                  height={32}
                  src={"/images/milestone7_title.svg"}
                  className="w-[134px] h-[32px] h-full absolute top-[50px] left-[50px] z-50"
                />
              </Link>
            </div>
          ) : (
            <div
              className="relative before:absolute before:content-[url('/images/milestone7_before.svg')] before:rotate-2 before:-top-[340px] before:-left-[115px] before:w-full before:h-full before:object-cover before:object-center
            "
            >
              <div
                onMouseEnter={() => handleMouseAction(7, true)}
                onMouseLeave={() => handleMouseAction(7, false)}
                onClick={() => {
                  setFormattedPathName(allMilestonesData[6]?.id);

                  setPathId(7);
                  handleModal();
                }}
                className="group relative"
              >
                <Image
                  alt="milestone 7"
                  width={240.638}
                  height={245.156}
                  src={"/images/milestone7.svg"}
                  className="min-w-[240.638px] min-h-[245.156px] opacity-50"
                />
                <Image
                  alt="milestone 7"
                  width={134}
                  height={32}
                  src={"/images/milestone7_title.svg"}
                  className="w-[134px] h-[32px] h-full absolute top-[50px] left-[50px] z-50"
                />
              </div>
            </div>
          )}
        </div>

        {/* milestone 8 */}

        <div className="absolute top-[19rem] left-[89rem]">
          {isMilestoneCompleted(allMilestonesData[6]?.id) ? (
            <div
              className="z-0 relative  after:object-cover after:object-center
         "
            >
              <Link
                href={`/dashboard/milestone/${allMilestonesData[7]?.id}`}
                className="group relative cursor-pointer"
              >
                <Image
                  alt="milestone 2"
                  width={240.638}
                  height={245.156}
                  src={"/images/milestone8.png"}
                  className="w-full h-full z-40  rotate-[-39deg]"
                />

                <span className=" absolute top-[10px] left-[100px] z-50 text-xl font-bold whitespace-nowrap text-white">
                  Milestone 8
                </span>
              </Link>
            </div>
          ) : (
            <div
              className="z-0 relative  after:object-cover after:object-center
         "
            >
              <div
                onMouseEnter={() => handleMouseAction(2, true)}
                onMouseLeave={() => handleMouseAction(2, false)}
                onClick={() => {
                  setFormattedPathName(allMilestonesData[7]?.id);
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
                  src={"/images/milestone8.png"}
                  className="w-full h-full z-40 rotate-[-35deg] opacity-50"
                />

                <span className=" absolute top-[10px] left-[130px] z-50 text-xl font-bold whitespace-nowrap text-white">
                  Milestone 8
                </span>
              </div>
            </div>
          )}
        </div>
        {/* milestone 9 */}

        <div className="absolute top-[15rem] left-[100rem]">
          {isMilestoneCompleted(allMilestonesData[7]?.id) ? (
            <div
              className="z-0 relative  after:object-cover after:object-center
         "
            >
              <Link
                href={`/dashboard/milestone/${allMilestonesData[8]?.id}`}
                className="group relative cursor-pointer"
              >
                <Image
                  alt="milestone 2"
                  width={240.638}
                  height={245.156}
                  src={"/images/milestone19.png"}
                  className="w-full h-full z-40 scale-[1.05] rotate-[-25deg]"
                />

                <span className=" absolute top-[10px] left-[130px] z-50 text-xl font-bold whitespace-nowrap text-white">
                  Milestone 9
                </span>
              </Link>
            </div>
          ) : (
            <div className="z-0 relative ">
              <div
                onMouseEnter={() => handleMouseAction(2, true)}
                onMouseLeave={() => handleMouseAction(2, false)}
                onClick={() => {
                  setFormattedPathName(allMilestonesData[8]?.id);
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
                  className="w-full h-full z-40 opacity-50 scale-[1.05] rotate-[-25deg]"
                />
                <span className=" absolute top-[10px] left-[130px] z-50 text-xl font-bold whitespace-nowrap text-white">
                  Milestone 9
                </span>
              </div>
            </div>
          )}
        </div>
        {/* milestone 10 */}

        <div className="absolute top-[14rem] left-[111rem]">
          {isMilestoneCompleted(allMilestonesData[8]?.id) ? (
            <div
              className="z-0 relative  after:object-cover after:object-center
         "
            >
              <Link
                href={`/dashboard/milestone/${allMilestonesData[9]?.id}`}
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
                  Milestone 10
                </span>
              </Link>
            </div>
          ) : (
            <div className="z-0 relative ">
              <div
                onMouseEnter={() => handleMouseAction(2, true)}
                onMouseLeave={() => handleMouseAction(2, false)}
                onClick={() => {
                  setFormattedPathName(allMilestonesData[9]?.id);
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
                  Milestone 10
                </span>
              </div>
            </div>
          )}
        </div>
        {/* milestone 11 */}

        <div className="absolute top-[14rem] left-[122rem]">
          {isMilestoneCompleted(allMilestonesData[9]?.id) ? (
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
                  src={"/images/milestone19.png"}
                  className="w-full h-full z-40"
                />

                <span className=" absolute top-[10px] left-[130px] z-50 text-xl font-bold whitespace-nowrap text-white">
                  Milestone 11
                </span>
              </Link>
            </div>
          ) : (
            <div className="z-0 relative ">
              <div
                onMouseEnter={() => handleMouseAction(2, true)}
                onMouseLeave={() => handleMouseAction(2, false)}
                onClick={() => {
                  setFormattedPathName(allMilestonesData[10]?.id);
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
                  Milestone 11
                </span>
              </div>
            </div>
          )}
        </div>
        {/* milestone 12 */}

        <div className="absolute top-[14rem] left-[133rem]">
          {isMilestoneCompleted(allMilestonesData[10]?.id) ? (
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
                  className="w-full h-full z-40"
                />

                <span className=" absolute top-[10px] left-[130px] z-50 text-xl font-bold whitespace-nowrap text-white">
                  Milestone 12
                </span>
              </Link>
            </div>
          ) : (
            <div className="z-0 relative ">
              <div
                onMouseEnter={() => handleMouseAction(2, true)}
                onMouseLeave={() => handleMouseAction(2, false)}
                onClick={() => {
                  setFormattedPathName(allMilestonesData[11]?.id);
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
                  Milestone 12
                </span>
              </div>
            </div>
          )}
        </div>

        {/* milestone 13 */}

        <div className="absolute top-[14rem] left-[145rem]">
          {isMilestoneCompleted(allMilestonesData[11]?.id) ? (
            <div
              className="z-0 relative 
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

                <span className=" absolute top-[10px] left-[130px] z-50 text-xl font-bold whitespace-nowrap text-white">
                  Milestone 13
                </span>
              </Link>
            </div>
          ) : (
            <div className="z-0 relative ">
              <div
                onMouseEnter={() => handleMouseAction(2, true)}
                onMouseLeave={() => handleMouseAction(2, false)}
                onClick={() => {
                  setFormattedPathName(allMilestonesData[12]?.id);
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
                  Milestone 13
                </span>
              </div>
            </div>
          )}
        </div>
        {/* milestone 14 */}

        <div className="absolute top-[14rem] left-[156rem]">
          {isMilestoneCompleted(allMilestonesData[12]?.id) ? (
            <div
              className="z-0 relative 
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
                  Milestone 14
                </span>
              </Link>
            </div>
          ) : (
            <div className="z-0 relative ">
              <div
                onMouseEnter={() => handleMouseAction(2, true)}
                onMouseLeave={() => handleMouseAction(2, false)}
                onClick={() => {
                  setFormattedPathName(allMilestonesData[13]?.id);
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
                  Milestone 14
                </span>
              </div>
            </div>
          )}
        </div>

        {/* milestone 15 */}

        <div className="absolute top-[14rem] left-[168rem]">
          {isMilestoneCompleted(allMilestonesData[13]?.id) ? (
            <div
              className="z-0 relative 
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

                <span className=" absolute top-[10px] left-[130px] z-50 text-xl font-bold whitespace-nowrap text-white">
                  Milestone 15
                </span>
              </Link>
            </div>
          ) : (
            <div className="z-0 relative ">
              <div
                onMouseEnter={() => handleMouseAction(2, true)}
                onMouseLeave={() => handleMouseAction(2, false)}
                onClick={() => {
                  setFormattedPathName(allMilestonesData[14]?.id);
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
                  Milestone 15
                </span>
              </div>
            </div>
          )}
        </div>

        {/* milestone 16 */}

        <div className="absolute top-[14rem] left-[180rem]">
          {isMilestoneCompleted(allMilestonesData[14]?.id) ? (
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

                <span className=" absolute top-[10px] left-[130px] z-50 text-xl font-bold whitespace-nowrap text-white">
                  Milestone 16
                </span>
              </Link>
            </div>
          ) : (
            <div className="z-0 relative ">
              <div
                onMouseEnter={() => handleMouseAction(2, true)}
                onMouseLeave={() => handleMouseAction(2, false)}
                onClick={() => {
                  setFormattedPathName(allMilestonesData[15]?.id);
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
                  Milestone 16
                </span>
              </div>
            </div>
          )}
        </div>
        {/* milestone 17 */}

        <div className="absolute top-[14rem] left-[192rem]">
          {isMilestoneCompleted(allMilestonesData[15]?.id) ? (
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

                <span className=" absolute top-[10px] left-[130px] z-50 text-xl font-bold whitespace-nowrap text-white">
                  Milestone 17
                </span>
              </Link>
            </div>
          ) : (
            <div className="z-0 relative ">
              <div
                onMouseEnter={() => handleMouseAction(2, true)}
                onMouseLeave={() => handleMouseAction(2, false)}
                onClick={() => {
                  setFormattedPathName(allMilestonesData[16]?.id);
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
                  Milestone 17
                </span>
              </div>
            </div>
          )}
        </div>

        {/* milestone 18 */}

        <div className="absolute top-[14rem] left-[203rem]">
          {isMilestoneCompleted(allMilestonesData[16]?.id) ? (
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

                <span className=" absolute top-[10px] left-[130px] z-50 text-xl font-bold whitespace-nowrap text-white">
                  Milestone 18
                </span>
              </Link>
            </div>
          ) : (
            <div className="z-0 relative ">
              <div
                onMouseEnter={() => handleMouseAction(2, true)}
                onMouseLeave={() => handleMouseAction(2, false)}
                onClick={() => {
                  setFormattedPathName(allMilestonesData[17]?.id);
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
                  Milestone 18
                </span>
              </div>
            </div>
          )}
        </div>

        {/* milestone 19 */}

        <div className="absolute top-[14rem] left-[215rem]">
          {isMilestoneCompleted(allMilestonesData[17]?.id) ? (
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

                <span className=" absolute top-[10px] left-[130px] z-50 text-xl font-bold whitespace-nowrap text-white">
                  Milestone 19
                </span>
              </Link>
            </div>
          ) : (
            <div className="z-0 relative ">
              <div
                onMouseEnter={() => handleMouseAction(2, true)}
                onMouseLeave={() => handleMouseAction(2, false)}
                onClick={() => {
                  setFormattedPathName(allMilestonesData[18]?.id);
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
                  Milestone 19
                </span>
              </div>
            </div>
          )}
        </div>

        {/* milestone 20 */}

        <div className="absolute top-[14rem] left-[226rem]">
          {isMilestoneCompleted(allMilestonesData[18]?.id) ? (
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

                <span className=" absolute top-[10px] left-[130px] z-50 text-xl font-bold whitespace-nowrap text-white">
                  Milestone 20
                </span>
              </Link>
            </div>
          ) : (
            <div className="z-0 relative ">
              <div
                onMouseEnter={() => handleMouseAction(2, true)}
                onMouseLeave={() => handleMouseAction(2, false)}
                onClick={() => {
                  setFormattedPathName(allMilestonesData[19]?.id);
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
                  Milestone 20
                </span>
              </div>
            </div>
          )}
        </div>

        {/* milestone 21 */}

        <div className="absolute top-[14rem] left-[237rem]">
          {isMilestoneCompleted(allMilestonesData[19]?.id) ? (
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

                <span className=" absolute top-[10px] left-[130px] z-50 text-xl font-bold whitespace-nowrap text-white">
                  Milestone 21
                </span>
              </Link>
            </div>
          ) : (
            <div className="z-0 relative ">
              <div
                onMouseEnter={() => handleMouseAction(2, true)}
                onMouseLeave={() => handleMouseAction(2, false)}
                onClick={() => {
                  setFormattedPathName(allMilestonesData[20]?.id);
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
                  Milestone 21
                </span>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </section>
  );
}
