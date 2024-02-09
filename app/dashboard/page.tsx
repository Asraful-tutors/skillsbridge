import Header from "@/components/app/dashboard/Header";
import SkillsBoard from "@/components/app/dashboard/SkillsBoard";
import Image from "next/image";

export default function DashboardPage() {
  return (
    <section className="bg-[url('/images/dashboard.svg')] bg-cover bg-center bg-repeat w-screen h-screen relative overflow-hidden">
      <div className="fixed top-0 left-0 right-0 z-50">
        <Header />
      </div>
      <SkillsBoard />
      <div className="w-full h-full overflow-auto">
        <div className="absolute top-64 -left-4">
          <div
            className="relative before:absolute before:content-[url('/images/milestone1_before.svg')] before:-top-8 before:-right-36 before:w-full before:h-full before:object-cover before:object-center
          after:absolute after:content-[url('/images/milestone1_after.svg')] after:-bottom-56 after:-right-28 after:w-full after:h-full after:object-cover after:object-center
          "
          >
            <Image
              alt="milestone1_light"
              width={240.638}
              height={245.156}
              src={"/images/milestone1_light.svg"}
              className="w-[240.638px] h-[245.156px]"
            />
            <p className="text-white font-medium text-xl absolute bottom-0 right-0">
              MileStone 1
            </p>
          </div>
        </div>
        <div className="absolute top-24 left-[23.5%] z-10 ">
          <div
            className="relative before:absolute before:content-[url('/images/milestone2_before.svg')] before:top-4 before:-right-56 before:w-full before:h-full before:object-cover before:object-center
          after:absolute after:content-[url('/images/milestone2_after.svg')] after:-bottom-36 after:-right-44 after:w-full after:h-full after:object-cover after:object-center
          "
          >
            <Image
              alt="milestone1_light"
              width={240.638}
              height={245.156}
              src={"/images/milestone2.svg"}
              className="w-[229.777px] h-[254.605px]"
            />
            <p className="text-white font-medium text-xl absolute bottom-0 right-0">
              MileStone 2
            </p>
          </div>
        </div>
        <div className="absolute -bottom-16 left-[12.5%] z-10 ">
          <div
            className="relative before:absolute before:content-[url('/images/milestone3_before.svg')] before:-top-[190%] before:scale-[0.78] before:-right-20 before:w-full before:h-full before:object-cover before:object-center
          after:absolute after:content-[url('/images/milestone3_after.svg')] after:bottom-8 after:-right-44 after:w-full after:h-full after:object-cover after:object-center
          "
          >
            <Image
              alt="milestone1_light"
              width={240.638}
              height={245.156}
              src={"/images/milestone3.svg"}
              className="w-[240.638px] h-[245.156px]"
            />
            <p className="text-white font-medium text-xl absolute bottom-0 right-0">
              MileStone 2
            </p>
          </div>
        </div>
        <div className="absolute bottom-5 left-[28%] z-10 ">
          <div
            className="relative before:absolute before:content-[url('/images/milestone3_before.svg')] before:-top-[190%] before:scale-[0.78] before:-right-20 before:w-full before:h-full before:object-cover before:object-center
          after:absolute after:content-[url('/images/milestone3_after.svg')] after:bottom-8 after:-right-44 after:w-full after:h-full after:object-cover after:object-center
          "
          >
            <Image
              alt="milestone1_light"
              width={240.638}
              height={245.156}
              src={"/images/milestone4.svg"}
              className="w-[430.895px] h-[430.895px] scale-[1]"
            />
            <p className="text-white font-medium text-xl absolute bottom-0 right-0">
              MileStone 2
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
