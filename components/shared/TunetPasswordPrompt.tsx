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
import { useRouter } from "next/navigation";
import { redirectUser } from "@/lib/backend/user";

export default function TunetPasswordPrompt({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: any;
}) {
  const [error, setError] = useState(false);
  const [code, setCode] = useState("");
  const router = useRouter();
  const handlePasswordAccept = (e: any) => {
    e.preventDefault();
    if (process.env.NEXT_PUBLIC_ACCESS_PASSWORD === code) {
      localStorage.setItem("code", process.env.NEXT_PUBLIC_ACCESS_PASSWORD);

      setOpen(false);
      redirectUser();
      router.push("/dashboard");
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
        <DialogContent className="sm:max-w-[425px] rounded-[16px]">
          <DialogHeader className="flex flex-col gap-2">
            <DialogTitle>Let&apos;s Get Started! </DialogTitle>
            <DialogDescription className="flex flex-col gap-1.5">
              Follow these simple steps to access our learning resources:
              <ol className="list-decimal space-y-1">
                <li className="ml-4">
                  Register on TuNet by clicking the link below. It&apos;s where
                  all our content is hosted.
                </li>
                <li className="ml-4">
                  Find your passcode in the first section of the course
                  materials on TuNet.
                </li>
                <li className="ml-4">
                  Come back here and enter your passcode below to unlock your
                  resources.
                </li>
              </ol>
              Easy, right? If you need help, we&apos;re here for you. Happy
              learning!
            </DialogDescription>
            <DialogDescription>
              <a
                href="https://net.tutors.fi/reg/3j6k335y"
                target="_blank"
                className="underline cursor-pointer text-sky-700"
              >
                https://net.tutors.fi/reg/3j6k335y
              </a>
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
