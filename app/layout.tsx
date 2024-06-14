import type { Metadata } from "next";

import MotionLayout from "@/components/layout/MotionLayout";

import "./globals.css";
import StoreProvider from "./StoreProvider";
import { Toaster } from "sonner";
import prisma from "@/lib/backend/prisma";

export const metadata: Metadata = {
  title: "SkillsBridge",
  description:
    "The project’s open approach may also attract professional representatives, such as game studios or industry companies, to promote and develop collaboration with students in the assessment pilot for developing industry skills.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <StoreProvider>
      <html lang="en">
        <MotionLayout>
          <body>            
            <script type="text/javascript" async src="https://bot.leadoo.com/bot/dynamic.js?company=LVbtMuTt"></script> 
            {children}</body>
          <Toaster />
        </MotionLayout>
      </html>
    </StoreProvider>
  );
}
