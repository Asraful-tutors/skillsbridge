// @ts-nocheck

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
import { modifyPdf } from "@/actions/pdfDownloader";
import { useAppSelector } from "@/lib/store/hooks";

export default function PdfDownloader({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: any;
}) {
  const [error, setError] = useState(false);
  const [code, setCode] = useState("");
  const user = useAppSelector((state) => state.user.userData);
  const handlePasswordAccept = async (e: any) => {
    e.preventDefault();

    if ("aX76fQ93z" === code) {
      const modifiedPdfBytes = await modifyPdf(user?.name);
      downloadPdf(modifiedPdfBytes, "certificate.pdf");
      setOpen(false);
    } else {
      console.error("Invalid code");
      setError(true);
      setTimeout(() => {
        setError(false);
      }, 1500);
    }
  };

  const downloadPdf = (pdfBytes: Uint8Array, filename: string) => {
    const blob = new Blob([pdfBytes], { type: "application/pdf" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
  };

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader className="flex flex-col gap-2">
            <DialogTitle>Download your Certificate of Completion! </DialogTitle>
            <DialogDescription className="flex flex-col gap-1.5">
              Follow these simple steps to download your certificate:
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
                  Come back here and enter your passcode below to download your
                  certificate!
                </li>
              </ol>
              [Submit & Download]
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
