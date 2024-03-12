import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { usePDF } from "react-to-pdf";
import { useAppSelector } from "@/lib/store/hooks";
import Image from "next/image";
const certificateStyles = {
  width: "1027px", // Adjust width as needed
  padding: "40px",
  background: "#fff", // Certificate background color
  border: "2px solid #000", // Certificate border color
  borderRadius: "10px",
  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
};

export default function PdfView({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: any;
}) {
  const user = useAppSelector((state) => state.user.userData);
  const { toPDF, targetRef } = usePDF({ filename: "page.pdf" });

  // Get the current date
  const currentDate = new Date();
  const day = currentDate.getDate();
  const month = currentDate.getMonth() + 1; // Month is 0-indexed
  const year = currentDate.getFullYear();
  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-7xl max-h-[80vh] overflow-y-scroll w-full m-4">
          <Button
            variant={"violate"}
            onClick={() => toPDF()}
            className="w-fit mx-auto"
          >
            Download
          </Button>

          <div ref={targetRef} className="p-10 ">
            <DialogHeader className="flex flex-col gap-2 bg-[#dbe7e7] w-full mt-6 border-8 border-[#669999]">
              <DialogDescription className="flex flex-col gap-1.5  ">
                <p className="italic text-base font-medium text-black text-center mb-16 mt-10">
                  {" "}
                  This is to certify that
                </p>
                <p className="text-6xl font-extrabold text-center mb-16 text-black">
                  {user?.name}
                </p>
                <p className="text-center font-bold text-xl text-black mb-10 flex flex-col gap-3">
                  Has successfully levelled up in the Skillsbridge challenge
                  <span className="mt-2">
                    {" "}
                    Date:{`${day}/${month}/${year}`}
                  </span>
                </p>
                <p className="text-center font-medium italic text-lg text-black mb-5">
                  Skillsbridge is an Erasmus+ Programme designed to enhance
                  employability of individuals interested in a career in the
                  games industry. The program does this by offering targeted
                  training on critical skills of value to the games industry
                  across various roles.
                </p>
                <p className="italic text-base font-medium text-black text-center">
                  For more information refer to https://www.skillsbridge.eu.
                  Project code: 2022-2-FI01-KA210-VET-000094752
                </p>

                <div className="flex items-end justify-between gap-4">
                  <Image
                    src={"/images/arrowUp.png"}
                    alt="arrowup"
                    width={400}
                    height={400}
                    className="w-[250px] h-[250px] "
                  />
                  <Image
                    src={"/images/skillsbridge.png"}
                    alt="arrowup"
                    width={400}
                    height={400}
                    className="w-[400px] h-auto mb-2"
                  />
                  <Image
                    src={"/images/erasmus.png"}
                    alt="arrowup"
                    width={400}
                    height={400}
                    className="w-[400px] h-auto mb-2"
                  />
                </div>
              </DialogDescription>
            </DialogHeader>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
