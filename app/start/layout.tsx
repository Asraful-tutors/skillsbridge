import Header from "@/components/shared/Header";
import { auth } from "@/auth";
import prisma from "@/lib/backend/prisma";
import { log } from "console";

export default async function StartLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  const user = await prisma.user.findUnique({
    // @ts-ignore
    where: { email: session.user.email },
  });

  return (
    <div className="flex flex-col min-h-screen ">
      <Header user={user} />
      <main className="flex-1 h-full bg-[#F0F1F5]">{children}</main>
    </div>
  );
}
