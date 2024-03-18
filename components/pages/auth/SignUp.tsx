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
import { useState, useTransition } from "react";
import { register } from "@/lib/backend/user";
import { FaGoogle } from "react-icons/fa";
import { signIn } from "next-auth/react";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import PrivacyPolicy from "@/components/shared/PrivacyPolicy";
import ElectronicPolicyModal from "@/components/shared/ElectronicPolicyModal";

type SignUpProps = {
  // onRequestAccess: () => void;
};

export default function SignUp({}: SignUpProps) {
  const [isPending, startTransition] = useTransition();

  const [openPrivacyModal, setOpenPrivacyModal] = useState(false);
  const [openElectronicPolicyModal, setOpenElectronicPolicyModal] =
    useState(false);

  const form = useForm<z.infer<typeof SignUpSchema>>({
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
    },
    resolver: zodResolver(SignUpSchema),
  });

  const {
    formState: { errors },
  } = form;

  const onSubmit = (values: z.infer<typeof SignUpSchema>) => {
    startTransition(() => {
      register(values)
        .then((res) => {
          localStorage.setItem("userData", JSON.stringify(values));
        })
        .catch((err) => console.log(err));
    });
  };

  const socialLogin = (provider: "google" | "github") => {
    signIn(provider, {
      callbackUrl: DEFAULT_LOGIN_REDIRECT,
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
      <section className="grid grid-cols-1 lg:grid-cols-2 w-screen min-h-screen lg:h-screen overflow-hidden py-14 p-4 lg:p-10 xl:px-12 absolute inset-0 bg-[#F9F9F7]">
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
          <h1 className="header">Welcome to Skillsbridge</h1>
          <p className="text-sm lg:desc max-w-[449px] mx-auto -mt-1">
            Elevate your potential in the games industry! Here, you&apos;ll find
            the right resources and advice to make your journey rewarding and
            laser-focused. Let&apos;s turn your passion into a career, together.
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
        <div className="p-4 lg:p-10 max-lg:bg-white_background xl:p-20 flex flex-col items-center justify-center gap-6 lg:gap-10">
          <div>
            <h2 className="max-lg:text-2xl max-lg:mb-4 header">
              Sign up for an account
            </h2>
            <p className="max-lg:text-sm desc">
              Ready to level up? Let&apos;s navigate the journey to your dream
              job together.
              <br />
              <span className="font-medium ">
                NOTE: You won&apos;t be able to change your name later, so use
                the one you want to appear on your Completion Certificate!
              </span>
            </p>
          </div>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 lg:space-y-8"
          >
            <div className="flex items-center gap-4 lg:gap-8">
              <Input
                type="text"
                placeholder="First Name"
                className="input "
                {...form.register("firstName")}
                disabled={isPending}
                required
              />

              <Input
                type="text"
                placeholder="Last Name"
                className="input"
                {...form.register("lastName")}
                disabled={isPending}
                required
              />
            </div>
            <div className="flex flex-col gap-4">
              <Input
                type="email"
                placeholder="Email Address"
                {...form.register("email")}
                disabled={isPending}
                required
              />
              {/* {errors.email && (
                <div className="p-4 py-3 bg-red-500/10 text-red-500 rounded-md w-full">
                  Email is required
                </div>
              )} */}
            </div>
            <Input
              type="password"
              placeholder="******"
              {...form.register("password")}
              disabled={isPending}
              required
            />
            <p className="max-lg:text-sm desc text-center">
              By creating an account, you are agreeing to our{" "}
              <span
                onClick={() => setOpenPrivacyModal(true)}
                className="font-semibold cursor-pointer "
              >
                Privacy Policy
              </span>
              {/* , and{" "} */}
              {/* <span
                className="font-semibold cursor-pointer sr-only"
                onClick={() => setOpenElectronicPolicyModal(true)}
              >
                Electronic Communication Policy
              </span> */}
            </p>
            <Button type="submit" variant={"violate"} disabled={isPending}>
              {/* <Link href="/start">Request Access</Link> */}
              Request Access
            </Button>
          </form>

          <div className="flex items-center justify-center gap-4 flex-col -mt-4">
            <p>or</p>
            <div className="flex items-center gap-5">
              {/* google */}
              <Button
                onClick={() => socialLogin("google")}
                variant={"ghost"}
                className="rounded-full p-0 hover:scale-[1.04] transi"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  x="0px"
                  y="0px"
                  width="100"
                  height="100"
                  viewBox="0 0 48 48"
                  className="w-10 h-10"
                >
                  <path
                    fill="#fbc02d"
                    d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12	s5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24s8.955,20,20,20	s20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
                  ></path>
                  <path
                    fill="#e53935"
                    d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039	l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
                  ></path>
                  <path
                    fill="#4caf50"
                    d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36	c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
                  ></path>
                  <path
                    fill="#1565c0"
                    d="M43.611,20.083L43.595,20L42,20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571	c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"
                  ></path>
                </svg>
              </Button>
              {/* github */}
              <Button
                onClick={() => socialLogin("github")}
                variant={"ghost"}
                className="rounded-full p-0"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  x="0px"
                  y="0px"
                  width="100"
                  height="100"
                  viewBox="0 0 50 50"
                  className="w-10 h-10"
                >
                  <path d="M17.791,46.836C18.502,46.53,19,45.823,19,45v-5.4c0-0.197,0.016-0.402,0.041-0.61C19.027,38.994,19.014,38.997,19,39 c0,0-3,0-3.6,0c-1.5,0-2.8-0.6-3.4-1.8c-0.7-1.3-1-3.5-2.8-4.7C8.9,32.3,9.1,32,9.7,32c0.6,0.1,1.9,0.9,2.7,2c0.9,1.1,1.8,2,3.4,2 c2.487,0,3.82-0.125,4.622-0.555C21.356,34.056,22.649,33,24,33v-0.025c-5.668-0.182-9.289-2.066-10.975-4.975 c-3.665,0.042-6.856,0.405-8.677,0.707c-0.058-0.327-0.108-0.656-0.151-0.987c1.797-0.296,4.843-0.647,8.345-0.714 c-0.112-0.276-0.209-0.559-0.291-0.849c-3.511-0.178-6.541-0.039-8.187,0.097c-0.02-0.332-0.047-0.663-0.051-0.999 c1.649-0.135,4.597-0.27,8.018-0.111c-0.079-0.5-0.13-1.011-0.13-1.543c0-1.7,0.6-3.5,1.7-5c-0.5-1.7-1.2-5.3,0.2-6.6 c2.7,0,4.6,1.3,5.5,2.1C21,13.4,22.9,13,25,13s4,0.4,5.6,1.1c0.9-0.8,2.8-2.1,5.5-2.1c1.5,1.4,0.7,5,0.2,6.6c1.1,1.5,1.7,3.2,1.6,5 c0,0.484-0.045,0.951-0.11,1.409c3.499-0.172,6.527-0.034,8.204,0.102c-0.002,0.337-0.033,0.666-0.051,0.999 c-1.671-0.138-4.775-0.28-8.359-0.089c-0.089,0.336-0.197,0.663-0.325,0.98c3.546,0.046,6.665,0.389,8.548,0.689 c-0.043,0.332-0.093,0.661-0.151,0.987c-1.912-0.306-5.171-0.664-8.879-0.682C35.112,30.873,31.557,32.75,26,32.969V33 c2.6,0,5,3.9,5,6.6V45c0,0.823,0.498,1.53,1.209,1.836C41.37,43.804,48,35.164,48,25C48,12.318,37.683,2,25,2S2,12.318,2,25 C2,35.164,8.63,43.804,17.791,46.836z"></path>
                </svg>
              </Button>
            </div>
          </div>
        </div>
      </section>
      <PrivacyPolicy open={openPrivacyModal} setOpen={setOpenPrivacyModal} />
      <ElectronicPolicyModal
        open={openElectronicPolicyModal}
        setOpen={setOpenElectronicPolicyModal}
      />
    </motion.div>
  );
}
