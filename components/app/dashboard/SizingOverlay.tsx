"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronUpIcon } from "@radix-ui/react-icons";
import { ChevronLeftIcon } from "@radix-ui/react-icons";
import { ChevronRightIcon } from "@radix-ui/react-icons";
import { ChevronDownIcon } from "@radix-ui/react-icons";
import { PlusIcon } from "@radix-ui/react-icons";
import { MinusIcon } from "@radix-ui/react-icons";

export default function SizingOverlay({ props }: any) {
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const minZoom = 0.5;
  const maxZoom = 2;

  const handleScaleChange = (factor: number) => {
    const newScale = Math.round((scale + factor) * 10) / 10;
    const updatedScale = Math.min(Math.max(newScale, minZoom), maxZoom);

    setScale(updatedScale);

    props({
      scale: updatedScale,
      position,
    });
  };

  const handleMove = (direction: string) => {
    const moveAmount = 100;

    const newPosition = {
      top:
        position.top +
        (direction === "down" ? -1 : direction === "up" ? 1 : 0) * moveAmount,
      left:
        position.left +
        (direction === "left" ? 1 : direction === "right" ? -1 : 0) *
          moveAmount,
    };

    setPosition(newPosition);

    props({
      scale,
      position: newPosition,
    });
  };

  return (
    <div className="fixed bottom-5 right-5 z-[45]">
      <div className="flex flex-col justify-center items-center mb-1">
        <Button
          onClick={() => handleMove("up")}
          className="p-0 rounded-2xl bg-[#9849FF] hover:bg-[#0E67B9]"
        >
          <ChevronUpIcon className="w-12 h-12 bg-transparent rounded-2xl" />
        </Button>
        <div className="flex flex-row justify-between items-center gap-12">
          <Button
            onClick={() => handleMove("left")}
            className="p-0 rounded-2xl bg-[#9849FF] hover:bg-[#0E67B9]"
          >
            <ChevronLeftIcon className="w-12 h-12 bg-transparent rounded-2xl" />
          </Button>
          <Button
            onClick={() => handleMove("right")}
            className="p-0 rounded-2xl bg-[#9849FF] hover:bg-[#0E67B9]"
          >
            <ChevronRightIcon className="w-12 h-12 bg-transparent rounded-2xl" />
          </Button>
        </div>
        <Button
          onClick={() => handleMove("down")}
          className="p-0 rounded-2xl bg-[#9849FF] hover:bg-[#0E67B9]"
        >
          <ChevronDownIcon className="w-12 h-12 bg-transparent rounded-2xl" />
        </Button>
      </div>
      <div className="flex flex-row justify-center items-center gap-6">
        <Button
          onClick={() => handleScaleChange(0.2)}
          className="p-0 rounded-2xl bg-[#9849FF] hover:bg-[#0E67B9] w-12 h-12"
        >
          <PlusIcon className="w-8 h-8 bg-transparent rounded-2xl" />
        </Button>
        <Button
          onClick={() => handleScaleChange(-0.2)}
          className="p-0 rounded-2xl bg-[#9849FF] hover:bg-[#0E67B9] w-12 h-12"
        >
          <MinusIcon className="w-8 h-8 bg-transparent rounded-2xl" />
        </Button>
      </div>
    </div>
  );
}
