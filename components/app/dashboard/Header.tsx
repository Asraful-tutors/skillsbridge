import Image from "next/image";

export default function Header() {
  return (
    <nav className="flex items-center justify-between w-full gap-4">
      {/* left */}
      <section className="clip-left bg-white_background max-w-[502px] px-10 py-5 flex items-center gap-10 w-full -mt-2">
        <Image
          src={"/logo/logo.svg"}
          width={129}
          height={48}
          alt="logo"
          decoding="async"
          loading="lazy"
          className="w-[129.984px] h-12 object-center object-cover"
        />
        <div className="flex flex-col gap-1">
          <h2 className="header text-2xl text-start font-semibold">
            Milestone Journey
          </h2>
          <p className="desc text-start">Milestone 01</p>
        </div>
      </section>

      {/* right */}
      <section className="clip-right bg-white_background max-w-[502px] px-10 py-5 flex items-center justify-end gap-10 w-full ">
        <div className="w-10 h-10 bg-[#E1E1E1] p-2 rounded-sm">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
          >
            <path
              d="M21.5303 14.4697L19.5 12.4395V9.75C19.4977 7.89138 18.8063 6.09964 17.5595 4.72124C16.3127 3.34284 14.5991 2.4757 12.75 2.2875V0.75H11.25V2.2875C9.40093 2.4757 7.68732 3.34284 6.44053 4.72124C5.19373 6.09964 4.50233 7.89138 4.5 9.75V12.4395L2.46975 14.4697C2.32909 14.6104 2.25004 14.8011 2.25 15V17.25C2.25 17.4489 2.32902 17.6397 2.46967 17.7803C2.61032 17.921 2.80109 18 3 18H8.25V18.75C8.25 19.7446 8.64509 20.6984 9.34835 21.4016C10.0516 22.1049 11.0054 22.5 12 22.5C12.9946 22.5 13.9484 22.1049 14.6517 21.4016C15.3549 20.6984 15.75 19.7446 15.75 18.75V18H21C21.1989 18 21.3897 17.921 21.5303 17.7803C21.671 17.6397 21.75 17.4489 21.75 17.25V15C21.75 14.8011 21.6709 14.6104 21.5303 14.4697ZM14.25 18.75C14.25 19.3467 14.0129 19.919 13.591 20.341C13.169 20.7629 12.5967 21 12 21C11.4033 21 10.831 20.7629 10.409 20.341C9.98705 19.919 9.75 19.3467 9.75 18.75V18H14.25V18.75Z"
              fill="#6767D2"
            />
          </svg>
        </div>
        <div className="flex items-center gap-3 bg-[#13A098] px-[18px] py-2 rounded-full">
          <Image
            src={"/images/user.png"}
            width={40}
            height={40}
            alt="logo"
            decoding="async"
            loading="lazy"
            className="w-10 h-10 object-center object-cover rounded-full aspect-auto"
          />
          <div className="flex flex-col gap-1">
            <h2 className="text-white text-xl font-semibold ">Sam Thomas</h2>
            <p className="text-sm font-normal text-white">
              Learning Path - <span className="font-semibold">Game design</span>
            </p>
          </div>
        </div>
      </section>
    </nav>
  );
}
