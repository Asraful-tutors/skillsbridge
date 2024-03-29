import Header from "@/components/shared/Header";
import Breadcrumb from "@/components/shared/Breadcrumb";

export default function milestoneLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex flex-col min-h-screen ">
      <Header />
      <main className="flex-1 h-full bg-[#F0F1F5]">
        <Breadcrumb />
        {children}
      </main>
    </div>
  );
}