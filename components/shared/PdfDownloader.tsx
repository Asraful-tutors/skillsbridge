// @ts-nocheck
"use client";

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
import addUserNameToPdf, { modifyPdf } from "@/actions/pdfDownloader";
import { useAppSelector } from "@/lib/store/hooks";
import {
  Document,
  Page,
  View,
  Text,
  StyleSheet,
  BlobProvider,
} from "@react-pdf/renderer";
import PdfView from "./PdfView";

const styles = StyleSheet.create({
  page: {
    padding: 50, // Adjust padding for user name placement
  },
  userName: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
    position: "absolute",
    top: 20, // Adjust top position as needed
  },
});

export default function PdfDownloader({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: any;
}) {
  const [error, setError] = useState(false);
  const [code, setCode] = useState("");
  const [openPdf, setOpenPdf] = useState(false);

  const user = useAppSelector((state) => state.user.userData);
  const handlePasswordAccept = async (e: any) => {
    e.preventDefault();

    if ("aX76fQ93z" === code) {
      // setOpenPdf(true);
      localStorage.setItem("hasCompletedMilestones", "aX76fQ93z");
      setOpen(false);
    } else {
      console.error("Invalid code");
      setError(true);
      setTimeout(() => {
        setError(false);
      }, 1500);
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[425px] rounded-[16px] z-50">
          <DialogHeader className="flex flex-col gap-2">
            <DialogTitle className="text-left">
              Download your Certificate of Completion!{" "}
            </DialogTitle>
            <DialogDescription className="flex flex-col gap-1.5 text-left">
              Follow these simple steps to download your certificate once
              you&apos;re done studying the Soft Skill milestones!
              <ol className="list-decimal space-y-1">
                <li className="ml-4">
                  Complete the Evaluation Survey by clicking this link:
                  <a
                    href="https://forms.gle/2mjdsvTPYV3D64kBA"
                    target="_blank"
                    className="underline cursor-pointer text-sky-700"
                  >
                    https://forms.gle/2mjdsvTPYV3D64kBA
                  </a>
                </li>
                <li className="ml-4">
                  Find your passcode at the end of the survey
                </li>
                <li className="ml-4">
                  Come back here and enter your passcode below: once you&apos;ll
                  complete all the Soft Skill milestones, the <b>Certificate</b>{" "}
                  will be automatically unlocked!
                </li>
              </ol>
            </DialogDescription>
          </DialogHeader>
          <form
            onSubmit={(e) => handlePasswordAccept(e)}
            className={cn("grid items-start gap-4")}
          >
            <div className="grid gap-2">
              <Label htmlFor="Code">Code</Label>
              <Input
                value={code}
                onChange={(e) => setCode(e.target.value)}
                id="Code"
                placeholder="Enter your code here"
                className="py-3"
              />
            </div>
            {error && (
              <div className="px-4 py-3 bg-red-500/25 text-red-700 font-semibold rounded-md">
                Invalid Code!
              </div>
            )}
            <Button
              onClick={handlePasswordAccept}
              type="submit"
              className="bg-Moderate_violet"
            >
              Submit
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
