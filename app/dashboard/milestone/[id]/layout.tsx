import { auth } from "@/auth";
import Header from "@/components/shared/Header";
import prisma from "@/lib/prisma";

export default async function DashboardLayout({
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
