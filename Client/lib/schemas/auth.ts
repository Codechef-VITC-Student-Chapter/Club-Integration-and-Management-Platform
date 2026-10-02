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

export const loginOTPSchema = z.object({
  otp: z
    .string()
    .transform((val) => val.trim())
    .pipe(z.string().min(1, "OTP is required")),
});

export type LoginFormData = z.infer<typeof loginSchema>;
export type RegNumberFormData = z.infer<typeof regNumberSchema>;
export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;
export type LoginOTPFormData = z.infer<typeof loginOTPSchema>;
