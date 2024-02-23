'use client'

import React, { useState, useEffect, useRef } from "react";
import Header from "@/components/app/dashboard/Header";
import SkillsBoard from "@/components/app/dashboard/SkillsBoard";
import Image from "next/image";
import CompletionBox from "@/components/app/dashboard/CompletionBox";
import { motion } from "framer-motion";
import useOutsideClick from "@/components/hooks/useOutsideClick";
import MilestoneModal from "@/components/app/dashboard/MilestoneModal";

export default function DashboardPage() {
  const [hovered, setHovered] = useState<{ [key: number]: boolean }>({})
  const [divStyle, setDivStyle] = useState({
    scale: 1,
    top: 0,
    left: 0,
    isDragging: false,
    dragStartX: 0,
    dragStartY: 0,
  })
  const [visible, setVisible] = useState(false)
  const prevClientX = useRef(0)
  const prevClientY = useRef(0)

  const minZoom = 0.7
  const maxZoom = 2

  /* Supposed to take information about milestone to check if the milestone is available.
  If milestone is not yet availabe, throws modal with required skills */
  const handleModal = () => {
    setVisible(!visible)
  }

  useOutsideClick(visible, setVisible)

  const handleMouseAction = (imageNumber: number, value: boolean) => {
    setHovered((prevHovered) => ({
      ...prevHovered,
      [imageNumber]: value,
    }))
  }

  const handleZoom: React.WheelEventHandler<HTMLDivElement> = (event) => {
    const newScale = divStyle.scale + (event.deltaY > 0 ? -0.2 : 0.2)
    const restrictedScale = Math.max(minZoom, Math.min(newScale, maxZoom))

    setDivStyle((prevDivStyle) => ({
      ...prevDivStyle,
      scale: restrictedScale,
    }))
  }

  const handleMouseDown = (event: React.MouseEvent | React.TouchEvent) => {
    event.preventDefault();
    const clientX = 'touches' in event ? event.touches[0].clientX : event.clientX
    const clientY = 'touches' in event ? event.touches[0].clientY : event.clientY

    setDivStyle((prevDivStyle) => ({
      ...prevDivStyle,
      isDragging: true,
    }))

    prevClientX.current = clientX
    prevClientY.current = clientY
  }

  const handleMouseMove = (event: React.MouseEvent | React.TouchEvent) => {
    requestAnimationFrame(() => {
      const clientX = 'touches' in event ? event.touches[0].clientX : event.clientX
      const clientY = 'touches' in event ? event.touches[0].clientY : event.clientY

      if (divStyle.isDragging) {
        const deltaX = clientX - prevClientX.current
        const deltaY = clientY - prevClientY.current

        setDivStyle((prevDivStyle) => ({
          ...prevDivStyle,
          left: prevDivStyle.left + deltaX,
          top: prevDivStyle.top + deltaY,
        }))

        prevClientX.current = clientX
        prevClientY.current = clientY
      }
    })
  }

  const handleMouseUp = () => {
    setDivStyle((prevDivStyle) => ({
      ...prevDivStyle,
      isDragging: false,
    }))
  }

  useEffect(() => {
    document.addEventListener('mousemove', handleMouseMove as any)
    document.addEventListener('mouseup', handleMouseUp)

    document.addEventListener('touchmove', handleMouseMove as any)
    document.addEventListener('touchend', handleMouseUp)

    return () => {
      document.removeEventListener('mousemove', handleMouseMove as any)
      document.removeEventListener('mouseup', handleMouseUp)

      document.removeEventListener('touchmove', handleMouseMove as any)
      document.removeEventListener('touchend', handleMouseUp)
    }
  }, [divStyle.scale, divStyle.isDragging])

  return (
    <section
    className="bg-[url('/images/dashboard.svg')] bg-cover bg-center bg-repeat w-screen h-screen relative overflow-hidden"
    >
      <Header />
      <SkillsBoard />
      {visible && <MilestoneModal setVisible={setVisible} />}
      <motion.div
      className="relative min-w-[1401.75px]"
      style={{
        transform: `scale(${divStyle.scale})`,
        top: `${divStyle.top}px`,
        left: `${divStyle.left}px`,
      }}
      animate={{
        scale: divStyle.scale || 1,
      }}
      transition={{ duration: 0.1, ease: 'linear' }}
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
            <div
            onMouseEnter={() => handleMouseAction(1, true)}
            onMouseLeave={() => handleMouseAction(1, false)}
            onClick={handleModal}
            className="group relative"
            >
              <Image
                alt="milestone 1"
                width={240.638}
                height={245.156}
                src={"/images/milestone1_light.svg"}
                className="w-[300px] h-[245.156px] group-hover:opacity-50 z-40"
              />
              <Image
                alt="milestone 1"
                width={134}
                height={32}
                src={"/images/milestone1_title.svg"}
                className="w-[134px] h-[32px] h-full absolute -bottom-[120px] left-[80px] z-50"
              />
              {hovered[1] && <CompletionBox />}
            </div>
          </div>
        </div>
        {/* Milestone 2 */}
        <div className="absolute -top-[35px] left-[490px]">
          <div
            className="z-0 relative before:absolute before:content-[url('/images/milestone2_before.svg')] before:top-[80px] before:-right-[335px] before:w-full before:h-full
          after:absolute after:content-[url('/images/milestone2_after.svg')] after:-bottom-[230px] after:-right-[300px] after:w-full after:h-full after:object-cover after:object-center
          "
          >
            <div
            onMouseEnter={() => handleMouseAction(2, true)}
            onMouseLeave={() => handleMouseAction(2, false)}
            onClick={handleModal}
            className="group relative"
            >
              <Image
                alt="milestone 2"
                width={240.638}
                height={245.156}
                src={"/images/milestone2.svg"}
                className="w-full h-full group-hover:opacity-50 z-40"
              />
              <Image
                alt="milestone 2"
                width={134}
                height={32}
                src={"/images/milestone2_title.svg"}
                className="w-[134px] h-[32px] h-full absolute top-[10px] left-[130px] z-50"
              />
              {hovered[2] && <CompletionBox />}
            </div>
          </div>
        </div>
        {/* Milestone 3 */}
        <div className="absolute top-[810px] left-[220px]">
          <div
            className="z-0 relative before:absolute before:content-[url('/images/milestone3_before.svg')] before:rotate-2 before:-top-[559px] before:left-[217px] before:w-full before:h-full before:object-cover before:object-center
          after:absolute after:content-[url('/images/milestone3_after.svg')] after:-top-[85px] after:-right-[255px] after:w-full after:h-full after:object-cover after:object-center
          "
          >
            <div
            onMouseEnter={() => handleMouseAction(3, true)}
            onMouseLeave={() => handleMouseAction(3, false)}
            onClick={handleModal}
            className="group relative"
            >
              <Image
                alt="milestone 3"
                width={240.638}
                height={245.156}
                src={"/images/milestone3.svg"}
                className="w-full h-full group-hover:opacity-50 z-40"
              />
              <Image
                alt="milestone 3"
                width={134}
                height={32}
                src={"/images/milestone3_title.svg"}
                className="w-[134px] h-[32px] h-full absolute -top-[20px] left-[70px] z-50"
              />
              {hovered[3] && <CompletionBox />}
            </div>
          </div>
        </div>
        {/* Milestone 4 */}
        <div className="absolute top-[400px] left-[580px]">
          <div
            className="z-10 relative
            after:absolute after:content-[url('/images/milestone4_after.svg')] after:top-[120px] after:-right-[340px] after:w-full after:h-full after:object-cover after:object-center"
          >
            <div
            onMouseEnter={() => handleMouseAction(4, true)}
            onMouseLeave={() => handleMouseAction(4, false)}
            onClick={handleModal}
            className="group"
            >
              <Image
                alt="milestone 4"
                width={240.638}
                height={245.156}
                src={"/images/milestone4.svg"}
                className="w-full h-full group-hover:opacity-50 z-40"
              />
              {hovered[4] && <CompletionBox />}
            </div>
          </div>
        </div>
        {/* Milestone 5 */}
        <div className="absolute -top-[50px] left-[1000px] z-40">
          <div
            className=""
          >
            <div
            onMouseEnter={() => handleMouseAction(5, true)}
            onMouseLeave={() => handleMouseAction(5, false)}
            onClick={handleModal}
            className="group relative"
            >
              <Image
                alt="milestone 5"
                width={240.638}
                height={245.156}
                src={"/images/milestone5.svg"}
                className="w-full h-full group-hover:opacity-50"
              />
              <Image
                alt="milestone 5"
                width={134}
                height={32}
                src={"/images/milestone5_title.svg"}
                className="w-[134px] h-[32px] h-full absolute -bottom-[10px] left-[30px] z-50"
              />
              {hovered[5] && <CompletionBox />}
            </div>
          </div>
        </div>
        {/* Milestone 6 */}
        <div className="absolute top-[735px] left-[1165px] z-40">
          <div
            className="z-0 relative before:absolute before:content-[url('/images/milestone6_before.svg')] before:rotate-2 before:-top-[40px] before:-left-[240px] before:w-full before:h-full before:object-cover before:object-center
            after:absolute after:content-[url('/images/milestone6_after.svg')] after:-top-[115px] after:-right-[125px] after:w-full after:h-full after:object-cover after:object-center"
          >
            <div
            onMouseEnter={() => handleMouseAction(6, true)}
            onMouseLeave={() => handleMouseAction(6, false)}
            onClick={handleModal}
            className="group relative"
            >
              <Image
                alt="milestone 6"
                width={240.638}
                height={245.156}
                src={"/images/milestone6.svg"}
                className="w-full h-full group-hover:opacity-50"
              />
              <Image
                alt="milestone 6"
                width={134}
                height={32}
                src={"/images/milestone6_title.svg"}
                className="w-[134px] h-[32px] h-full absolute -bottom-[10px] left-[30px] z-50"
              />
              {hovered[6] && <CompletionBox />}
            </div>
          </div>
        </div>
        {/* Milestone 7 */}
        <div className="absolute top-[420px] left-[1290px] z-30">
          <div
            className="relative before:absolute before:content-[url('/images/milestone7_before.svg')] before:rotate-2 before:-top-[340px] before:-left-[115px] before:w-full before:h-full before:object-cover before:object-center
            "
          >
            <div
            onMouseEnter={() => handleMouseAction(7, true)}
            onMouseLeave={() => handleMouseAction(7, false)}
            onClick={handleModal}
            className="group relative"
            >
              <Image
                alt="milestone 7"
                width={240.638}
                height={245.156}
                src={"/images/milestone7.svg"}
                className="min-w-[240.638px] min-h-[245.156px] group-hover:opacity-50"
              />
              <Image
                alt="milestone 7"
                width={134}
                height={32}
                src={"/images/milestone7_title.svg"}
                className="w-[134px] h-[32px] h-full absolute top-[50px] left-[50px] z-50"
              />
              {hovered[7] && <CompletionBox />}
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
