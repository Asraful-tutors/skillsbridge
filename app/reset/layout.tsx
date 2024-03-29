export default async function StartLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <div className="flex flex-col ">
        <main className="flex-1 bg-white px-4">{children}</main>
      </div>
    </>
  );
}
