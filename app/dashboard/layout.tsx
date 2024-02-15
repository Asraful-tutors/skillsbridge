import { auth } from "@/auth";
import Header from "@/components/shared/Header";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();
  const user = await prisma.user.findUnique({
    // @ts-ignore
    where: { email: session.user.email },
  });

  if (!user) {
    redirect("/");
  }

  return <>{children}</>;
}
