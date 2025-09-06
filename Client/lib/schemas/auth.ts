import z from "zod";

export const loginSchema = z.object({
  reg_number: z.string().min(1, "Registration number is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const regNumberSchema = z.object({
  reg_number: z.string().min(1, "Registration number is required"),
});

export const resetPasswordSchema = z.object({
  otp: z.string().min(1, "OTP is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export type LoginFormData = z.infer<typeof loginSchema>;
export type RegNumberFormData = z.infer<typeof regNumberSchema>;
export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;
