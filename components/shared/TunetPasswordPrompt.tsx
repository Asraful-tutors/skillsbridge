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

export default function TunetPasswordPrompt({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: any;
}) {
  const [error, setError] = useState(false);
  const [code, setCode] = useState("");
  const handlePasswordAccept = (e: any) => {
    e.preventDefault();
    if (process.env.NEXT_PUBLIC_ACCESS_PASSWORD === code) {
      localStorage.setItem("code", process.env.NEXT_PUBLIC_ACCESS_PASSWORD);

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
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Access</DialogTitle>
            <DialogDescription>
              Tuner Registration link:{" "}
              <a
                href="https://net.tutors.fi/reg/3j6k335y"
                target="_blank"
                className="underline cursor-pointer text-sky-700"
              >
                https://net.tutors.fi/reg/3j6k335y
              </a>
            </DialogDescription>
            <DialogDescription>
              Please enter your tunet course code.
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
