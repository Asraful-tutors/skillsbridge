"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import Image from "next/image";

type Props = {};

export default function SignUp({}: Props) {
  return (
    <motion.div
      initial={{
        opacity: 0,
      }}
      animate={{
        opacity: 1,
      }}
      transition={{
        duration: 0.5,
        ease: "easeInOut",
      }}
    >
      <section className="grid grid-cols-1 lg:grid-cols-2 w-screen h-screen overflow-hidden py-14 p-4 lg:p-10 xl:px-12">
        <div className="hidden lg:flex bg-white_background flex-col items-center justify-center gap-3.5 py-24">
          <Image
            src="/logo/logo.svg"
            alt="logo"
            width={130}
            decoding="async"
            loading="lazy"
            height={48}
            className="w-[130px] object-cover object-center"
          />
          <h1 className="header">Welcome to Skillbridge</h1>
          <p className="desc max-w-[449px] mx-auto -mt-1">
            Lorem Ipsum is simply dummy text of the printing and typesetting
            industry. Lorem Ipsum has been the industry&apos;s standard dummy
            text ever.
          </p>
          <Image
            src={"/images/step1.svg"}
            alt="onboarding"
            decoding="async"
            loading="lazy"
            width={600}
            height={600}
            className="max-w-[449px] aspect-square object-cover object-center"
          />
        </div>
        <div className="p-4 lg:p-10 max-lg:bg-white_background xl:p-20 flex flex-col items-center justify-center gap-10">
          <div>
            <h2 className="header">Sign up for an account</h2>
            <p className="desc">Lorem Ipsum is simply dummy text</p>
          </div>
          <div className="space-y-8">
            <div className="flex items-center gap-8">
              <Input type="text" placeholder="First Name" className="input " />
              <Input type="text" placeholder="Last Name" className="input" />
            </div>
            <Input type="email" placeholder="Email Address" />
            <p className="desc text-left">
              By creating an account, you agreeing to our{" "}
              <span className="font-semibold">Privacy Policy</span>, and{" "}
              <span className="font-semibold">
                Electronic Communication Policy
              </span>
            </p>
            <Button variant={"violate"} className="">
              Request Access
            </Button>
          </div>
        </div>
      </section>
    </motion.div>
  );
}
