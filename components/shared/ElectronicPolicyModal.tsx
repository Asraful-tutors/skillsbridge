import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import React from "react";

export default function ElectronicPolicyModal({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
}) {
  return (
    <div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[648]">
          <DialogHeader>
            <DialogTitle className="uppercase">
              Electronic Communication Policy
            </DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete your
              INTRODUCTION Demos is committed to protecting your privacy and
              security. This policy explains how and why we use your personal
              data, to ensure you remain informed and in control of your
              information.
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}
