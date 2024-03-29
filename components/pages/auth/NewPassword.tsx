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
import { useSearchParams } from "next/navigation";
import { newPassword } from "@/lib/backend/newPassword";

type LoginProps = {};

export const NewPasswordSchema = z.object({
  password: z.string().min(4, {
    message: "Minimum of 4 charecters required",
  }),
});

export default function NewPassword() {
  const searchParam = useSearchParams();
  const token = searchParam.get("token");
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState(false);
  const form = useForm<z.infer<typeof NewPasswordSchema>>({
    resolver: zodResolver(NewPasswordSchema),
  });

  const {
    handleSubmit,
    formState: { errors },
    register,
  } = form;

  const onSubmit = (values: z.infer<typeof NewPasswordSchema>) => {
    startTransition(() => {
      toast.loading("Loading...");
      newPassword(values, token)
        .then((res) => {
          if (res?.error) {
            // setError(true);
            toast.error("Invalid token!");
            toast.dismiss();
          } else {
            toast.success("Password reset successfull");
            toast.dismiss();

            window.location.href = DEFAULT_LOGIN_REDIRECT;
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
        Enter a new password
      </div>
      <section className=" flex flex-col items-center justify-center gap-6 lg:gap-10 !w-full ">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4 lg:space-y-4 w-full"
        >
          <div className="flex flex-col gap-4 w-full">
            <Input
              type="password"
              placeholder="******"
              {...register("password")}
              disabled={isPending}
              required
              className="w-full"
            />
            {errors.password && (
              <div className="p-4 py-3 bg-red-500/10 text-red-500 rounded-md w-full ">
                {errors.password.message}
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
              Reset password
            </Button>
          </div>
        </form>
      </section>
    </motion.div>
  );
}
