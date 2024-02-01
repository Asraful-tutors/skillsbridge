import Image from "next/image";

import WhiteWrapper from "@/components/layout/WhiteWrapper";
import { Button } from "@/components/ui/button";

export default function StartAssessment({
  onNextButtonClick,
}: {
  onNextButtonClick: () => void;
}) {
  return (
    <WhiteWrapper>
      <section className="flex items-center justify-center px-4 md:px-10 lg:px-36 py-8 lg:py-16 max-w-[842px] mx-auto flex-col gap-5">
        <div className="">
          <Image
            src={"/images/startAssessmentIllustration.svg"}
            alt="start_assessment"
            width={349.226}
            height={300}
            decoding="async"
            loading="lazy"
            className="w-[349.226px] aspect-auto object-cover object-center"
          />
        </div>
        <div className="flex flex-col gap-2.5">
          <h1 className="header text-xl">
            Hello there! Get ready to learn more about yourself
          </h1>
          <p className="desc max-w-[404px] mx-auto text-sm">
            Take this test to discover your skills level and plan for your
            personal and professional growth.
          </p>
        </div>
        <Button
          onClick={onNextButtonClick}
          variant={"violate"}
          className="max-w-[284px] mx-auto"
        >
          Next
        </Button>
      </section>
    </WhiteWrapper>
  );
}
