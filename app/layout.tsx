import type { Metadata } from "next";

import MotionLayout from "@/components/layout/MotionLayout";

import "./globals.css";
import StoreProvider from "./StoreProvider";

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
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
          <body>{children}</body>
        </MotionLayout>
      </html>
    </StoreProvider>
  );
}
