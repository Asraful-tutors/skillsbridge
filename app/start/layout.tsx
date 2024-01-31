import type { Metadata } from "next";

import Header from "@/components/shared/Header";

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function StartLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 h-full bg-[#F0F1F5] py-8 px-6">{children}</main>
    </div>
  );
}
