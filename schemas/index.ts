import * as z from "zod";

export const SignUpSchema = z.object({
  firstName: z.string().min(1, {
    message: "First Name is required",
  }),
  lastName: z.string().min(1, {
    message: "Last Name is required",
  }),
  email: z.string().email({
    message: "Valid Email is required",
  }),
  password: z.string().min(6, {
    message: "Minimum of 6 characters required",
  }),
});
