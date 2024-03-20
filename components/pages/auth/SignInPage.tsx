import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useTransition } from "react";
import { signIn } from "next-auth/react";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";

import * as z from "zod";
import { motion } from "framer-motion";

type LoginProps = {};

const LoginSchema = z.object({
  email: z
    .string()
    .email("Invalid email address")
    .nonempty("Email is required"),
  password: z.string().nonempty("Password is required"),
});

export default function SignInPage({}: LoginProps) {
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
  });

  const {
    handleSubmit,
    formState: { errors },
    register,
  } = form;

  const onSubmit = (values: z.infer<typeof LoginSchema>) => {
    startTransition(() => {
      signIn("credentials", {
        email: values.email,
        password: values.password,
        redirect: false,
      }).then(() => {
        window.location.href = DEFAULT_LOGIN_REDIRECT;
      });
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
      className="w-full max-w-md"
    >
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
          <Input
            type="password"
            placeholder="******"
            {...register("password")}
            disabled={isPending}
            required
            className="w-full"
          />
          {errors.password && (
            <div className="p-4 py-3 bg-red-500/10 text-red-500 rounded-md w-full">
              {errors.password.message}
            </div>
          )}
          <Button type="submit" variant={"violate"} disabled={isPending}>
            Log In
          </Button>
        </form>
      </section>
    </motion.div>
  );
}
