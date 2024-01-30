"use client";

import { AnimatePresence } from "framer-motion";

export default function MotionLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AnimatePresence mode="popLayout" initial={false}>
      {children}
    </AnimatePresence>
  );
}
