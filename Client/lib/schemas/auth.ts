import z from "zod";

export const loginSchema = z.object({
  reg_number: z
    .string()
    .transform((val) => val.trim())
    .pipe(z.string().min(1, "Registration number is required")),
  password: z
    .string()
    .transform((val) => val.trim())
    .pipe(z.string().min(6, "Password must be at least 6 characters")),
});

export const regNumberSchema = z.object({
  reg_number: z
    .string()
    .transform((val) => val.trim())
    .pipe(z.string().min(1, "Registration number is required")),
});

export const resetPasswordSchema = z.object({
  otp: z
    .string()
    .transform((val) => val.trim())
    .pipe(z.string().min(1, "OTP is required")),
  password: z
    .string()
    .transform((val) => val.trim())
    .pipe(z.string().min(6, "Password must be at least 6 characters")),
});

// Signup form validation schema
export const signupSchema = z
  .object({
    first_name: z
      .string()
      .transform((val) => val.trim())
      .pipe(
        z
          .string()
          .min(1, "First name is required")
          .max(50, "First name too long")
      ),
    last_name: z
      .string()
      .transform((val) => val.trim())
      .pipe(
        z.string().min(1, "Last name is required").max(50, "Last name too long")
      ),
    email: z
      .string()
      .transform((val) => val.trim().toLowerCase())
      .pipe(z.string().email("Invalid email address")),
    reg_number: z
      .string()
      .transform((val) => val.trim())
      .pipe(z.string().min(1, "Registration number is required")),
    password: z
      .string()
      .transform((val) => val.trim())
      .pipe(z.string().min(6, "Password must be at least 6 characters")),
    confirmPassword: z
      .string()
      .transform((val) => val.trim())
      .pipe(z.string().min(1, "Please confirm your password")),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type SignupFormData = z.infer<typeof signupSchema>;
export type LoginFormData = z.infer<typeof loginSchema>;
export type RegNumberFormData = z.infer<typeof regNumberSchema>;
export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;
