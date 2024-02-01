import Image from "next/image";

export default function Header() {
  return (
    <header className="flex items-center justify-between gap-24 px-[42px] py-6 lg:py-8 bg-white_background shadow-xl border-b-2 border-gray-200 shadow-gray-200">
      <div>
        <Image
          src="/logo/logo.svg"
          alt="logo"
          width={130}
          decoding="async"
          loading="lazy"
          height={48}
          className="w-[110px] lg:w-[130px] object-cover object-center aspect-auto"
        />
      </div>
      <div>
        <span></span>
        <span></span>
      </div>
    </header>
  );
}
