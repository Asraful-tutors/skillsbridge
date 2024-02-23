"use client";

import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SignUpSchema } from "@/schemas";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTransition } from "react";
import { register } from "@/lib/backend/user";

type SignUpProps = {
  // onRequestAccess: () => void;
};

export default function SignUp({}: SignUpProps) {
  const [isPending, startTransition] = useTransition();
  const form = useForm<z.infer<typeof SignUpSchema>>({
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
    },
    resolver: zodResolver(SignUpSchema),
  });

  const onSubmit = (values: z.infer<typeof SignUpSchema>) => {
    startTransition(() => {
      register(values)
        .then((res) => {
          localStorage.setItem("userData", JSON.stringify(values));
        })
        .catch((err) => console.log(err));
    });
  };

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
      <section className="grid grid-cols-1 lg:grid-cols-2 w-screen h-screen overflow-hidden py-14 p-4 lg:p-10 xl:px-12 absolute inset-0 bg-[#F9F9F7]">
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
            Elevate your potential in the games industry! Here, you'll find the
            right resources and advice to make your journey rewarding and
            laser-focused. Let's turn your passion into a career, together.
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
            <p className="desc">
              Ready to level up? Let's navigate the journey to your dream job
              together.
            </p>
          </div>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="flex items-center gap-8">
              <Input
                type="text"
                placeholder="First Name"
                className="input "
                {...form.register("firstName")}
                disabled={isPending}
              />
              <Input
                type="text"
                placeholder="Last Name"
                className="input"
                {...form.register("lastName")}
                disabled={isPending}
              />
            </div>
            <Input
              type="email"
              placeholder="Email Address"
              {...form.register("email")}
              disabled={isPending}
            />
            <Input
              type="password"
              placeholder="******"
              {...form.register("password")}
              disabled={isPending}
            />
            <p className="desc text-left">
              By creating an account, you agreeing to our{" "}
              <span className="font-semibold">Privacy Policy</span>, and{" "}
              <span className="font-semibold">
                Electronic Communication Policy
              </span>
            </p>
            <Button type="submit" variant={"violate"} disabled={isPending}>
              {/* <Link href="/start">Request Access</Link> */}
              Request Access
            </Button>
          </form>
        </div>
      </section>
    </motion.div>
  );
}
