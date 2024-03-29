"use client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useTransition } from "react";
import { signIn } from "next-auth/react";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";

import * as z from "zod";
import { motion } from "framer-motion";
import { toast } from "sonner";
import Link from "next/link";
import { resetForm } from "@/lib/backend/reset";

type LoginProps = {};

export const ResetSchema = z.object({
  email: z
    .string()
    .email("Invalid email address")
    .nonempty("Email is required"),
});

export default function ResetForm({}: LoginProps) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState(false);
  const form = useForm<z.infer<typeof ResetSchema>>({
    resolver: zodResolver(ResetSchema),
  });

  const {
    handleSubmit,
    formState: { errors },
    register,
  } = form;

  const onSubmit = (values: z.infer<typeof ResetSchema>) => {
    startTransition(() => {
      toast.loading("Loading...");
      resetForm(values)
        .then((res) => {
          if (res?.error) {
            // setError(true);
            toast.error("No account found with the given credentials");
            toast.dismiss();
          } else {
            toast.success("Reset password sent successfully");
            toast.dismiss();

            // window.location.href = DEFAULT_LOGIN_REDIRECT;
          }
        })
        .catch((error) => console.log(error));
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
      className="!w-full min-[312px]:min-w-[346px] max-[415px]:min-w-[412px]"
    >
      <div className="text-2xl font-medium text-center py-6">
        Forgot your password ?
      </div>
      <section className=" flex flex-col items-center justify-center gap-6 lg:gap-10 !w-full ">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4 lg:space-y-4 w-full"
        >
          <div className="flex flex-col gap-4 w-full">
            <Input
              type="email"
              placeholder="Email Address"
              {...register("email")}
              disabled={isPending}
              required
              className="w-full"
            />
            {errors.email && (
              <div className="p-4 py-3 bg-red-500/10 text-red-500 rounded-md w-full ">
                {errors.email.message}
              </div>
            )}
          </div>

          <div className="flex items-center justify-between gap-2 w-full">
            <Button
              asChild
              variant={"secondary"}
              disabled={isPending}
              className="w-full"
            >
              <Link href={"/"}>Back</Link>
            </Button>
            <Button type="submit" variant={"violate"} disabled={isPending}>
              Send reset email
            </Button>
          </div>
        </form>
      </section>
    </motion.div>
  );
}
