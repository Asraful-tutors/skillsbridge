import { auth } from "@/auth";
import prisma from "@/lib/backend/prisma";
import { redirect } from "next/navigation";

export default async function AuthWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  const user = await prisma.user.findUnique({
    // @ts-ignore
    where: { email: session.user.email },
  });

  if (user) {
    redirect("/start");
  }

  return <div>{children}</div>;
}
