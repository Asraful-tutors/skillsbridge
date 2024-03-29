import * as z from "zod";

export const CredentialsSchema = z.object({
  email: z.string().email({
    message: "Valid email is required",
  }),
  password: z.string().min(6, {
    message: "Password must be at least 6 characters long",
  }),
});

export const SignUpSchema = z.object({
  firstName: z.string().min(1, {
    message: "First name is required",
  }),
  lastName: z.string().min(1, {
    message: "Last name is required",
  }),
  email: z.string().email({
    message: "Valid email is required",
  }),
  password: z.string().min(6, {
    message: "Password must be at least 6 characters long",
  }),
});
