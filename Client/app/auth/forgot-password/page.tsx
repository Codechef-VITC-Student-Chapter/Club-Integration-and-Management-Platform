"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { hashPassword } from "@/lib/auth";
import { User, Lock } from "lucide-react";
import { useLazySendOTPQuery, useSetNewPasswordMutation } from "@/lib/redux";
import {
  RegNumberFormData,
  regNumberSchema,
  ResetPasswordFormData,
  resetPasswordSchema,
} from "@/lib/schemas";
import { Button, Input, Label } from "@/components/ui";
import { LoadingSpinner } from "@/components/fallbacks";

// Validation schemas
function RegNumberStep({ onSuccess }: { onSuccess: (reg: string) => void }) {
  // RTK Query lazy query hook
  const [sendOTP, { isLoading }] = useLazySendOTPQuery();

  // React Hook Form setup
  const form = useForm<RegNumberFormData>({
    resolver: zodResolver(regNumberSchema),
    defaultValues: {
      reg_number: "",
    },
  });

  const handleSubmit = async (data: RegNumberFormData) => {
    try {
      const result = await sendOTP(data.reg_number.trim()).unwrap();

      toast.success(result.message || "OTP sent to your registered email!");
      onSuccess(data.reg_number.trim());
    } catch (error) {
      console.error("Send OTP error:", error);
      // Handle different types of errors
      if (error && typeof error === "object" && "status" in error) {
        const errorWithStatus = error as {
          status: number;
          data?: { message?: string };
        };
        const message = errorWithStatus.data?.message || "Error sending OTP.";
        toast.error(message);
      } else {
        toast.error("Network error. Try again.");
      }
    }
  };

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
      <div className="space-y-1">
        <Label className="text-sm text-foreground font-medium">
          REGISTRATION NUMBER
        </Label>
        <div
          className={`flex items-center border-[1px] md:border-2 ${
            form.formState.errors.reg_number
              ? "border-destructive"
              : "border-foreground"
          } rounded-md shadow-sm bg-card`}
        >
          <div className="p-2">
            <User className="h-5 w-5 text-foreground" />
          </div>
          <Input
            type="text"
            placeholder="23ABC1234"
            className="border-0 shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 text-sm"
            {...form.register("reg_number")}
          />
        </div>
        {form.formState.errors.reg_number && (
          <p className="text-destructive text-xs">
            {form.formState.errors.reg_number.message}
          </p>
        )}
      </div>
      <Button
        type="submit"
        disabled={isLoading}
        className="w-full bg-primary hover:bg-primary/80 text-primary-foreground py-1 md:py-2 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ring transition-colors"
      >
        {isLoading ? (
          <div className="flex items-center space-x-2">
            <LoadingSpinner size="sm" />
            <span>Sending...</span>
          </div>
        ) : (
          "Send OTP"
        )}
      </Button>
    </form>
  );
}

function OTPPasswordStep({ regNumber }: { regNumber: string }) {
  const router = useRouter();

  // RTK Query mutation hook
  const [setNewPassword, { isLoading }] = useSetNewPasswordMutation();

  // React Hook Form setup
  const form = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      otp: "",
      password: "",
    },
  });

  const handleSubmit = async (data: ResetPasswordFormData) => {
    try {
      // Hash the password before sending to API
      const hashedPassword = hashPassword(data.password.trim());

      // Prepare data for API call
      const resetData = {
        reg_no: regNumber,
        otp: data.otp.trim(),
        password: hashedPassword,
      };

      // Call the setNewPassword mutation
      const result = await setNewPassword(resetData).unwrap();

      toast.success(result.message || "Password reset successful!");
      router.push("/auth/login");
    } catch (error) {
      console.error("Reset password error:", error);
      // Handle different types of errors
      if (error && typeof error === "object" && "status" in error) {
        const errorWithStatus = error as {
          status: number;
          data?: { message?: string };
        };
        const message =
          errorWithStatus.data?.message || "Error resetting password.";

        if (message.toLowerCase().includes("otp")) {
          toast.error("Incorrect OTP. Please try again.");
        } else {
          toast.error(message);
        }
      } else {
        toast.error("Network error. Try again.");
      }
    }
  };

  return (
    <form
      onSubmit={form.handleSubmit(handleSubmit)}
      className="space-y-4 h-full"
    >
      <div className="space-y-1">
        <Label className="text-sm text-foreground font-medium">
          OTP (Check your email)
        </Label>
        <div
          className={`flex items-center border-[1px] md:border-2 ${
            form.formState.errors.otp
              ? "border-destructive"
              : "border-foreground"
          } rounded-md shadow-sm bg-card`}
        >
          <div className="p-2">
            <Lock className="h-5 w-5 text-foreground" />
          </div>
          <Input
            type="text"
            placeholder="Enter OTP"
            className="border-0 shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 text-sm"
            {...form.register("otp")}
          />
        </div>
        {form.formState.errors.otp && (
          <p className="text-destructive text-xs">
            {form.formState.errors.otp.message}
          </p>
        )}
      </div>
      <div className="space-y-1">
        <Label className="text-sm text-foreground font-medium">
          NEW PASSWORD
        </Label>
        <div
          className={`flex items-center border-[1px] md:border-2 ${
            form.formState.errors.password
              ? "border-destructive"
              : "border-foreground"
          } rounded-md shadow-sm bg-card`}
        >
          <div className="p-2">
            <Lock className="h-5 w-5 text-foreground" />
          </div>
          <Input
            type="password"
            placeholder="Enter new password"
            className="border-0 shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 text-sm"
            {...form.register("password")}
          />
        </div>
        {form.formState.errors.password && (
          <p className="text-destructive text-xs">
            {form.formState.errors.password.message}
          </p>
        )}
      </div>
      <Button
        type="submit"
        disabled={isLoading}
        className="w-full bg-primary hover:bg-primary/80 text-primary-foreground py-1 md:py-2 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ring transition-colors"
      >
        {isLoading ? (
          <div className="flex items-center space-x-2">
            <LoadingSpinner size="sm" />
            <span>Resetting...</span>
          </div>
        ) : (
          "Reset Password"
        )}
      </Button>
    </form>
  );
}

export default function ForgotPasswordPage() {
  const [step, setStep] = useState<"reg" | "otp">("reg");
  const [regNumber, setRegNumber] = useState("");

  return (
    <div className="bg-background relative h-screen overflow-hidden">
      {/* Mobile background */}
      <div className="absolute inset-0 md:hidden">
        <Image
          src="/mobile_login.png"
          alt="Mobile Background"
          fill
          className="object-cover"
          priority
        />
      </div>
      {/* Desktop background */}
      <div className="absolute inset-0 hidden md:block">
        <Image
          src="/desktop_login.png"
          alt="Desktop Background"
          fill
          className="object-contain"
          priority
        />
      </div>
      {/* Forgot Password Form Container */}
      <div className="min-h-screen flex items-center justify-center md:justify-end">
        <div className="bg-card rounded-[40px] md:rounded-[67px] w-[90%] shadow-lg p-6 md:p-12 md:max-w-md md:w-[561px] md:h-fit mx-4 md:relative absolute md:bottom-auto flex flex-col justify-center border md:mr-16 px-8">
          <div className="w-full md:max-w-96 m-auto">
            {/* Logo */}
            <div className="flex justify-center mb-1 md:mb-2">
              <Image
                src="/logo.png"
                alt="CodeChef VIT Chennai Chapter"
                width={128}
                height={96}
                className="h-24 md:h-32 w-auto"
                priority
              />
            </div>
            {/* Title */}
            <h2 className="text-[16px] md:text-2xl text-primary text-center mb-6 font-semibold">
              FORGOT PASSWORD
            </h2>
            {/* Step Components */}
            {step === "reg" ? (
              <RegNumberStep
                onSuccess={(reg) => {
                  setRegNumber(reg);
                  setStep("otp");
                }}
              />
            ) : (
              <OTPPasswordStep regNumber={regNumber} />
            )}
          </div>
          {/* Back to Login */}
          <div className="flex justify-center mt-2">
            <p className="text-[12px] md:text-sm text-foreground font-semibold">
              Remember your password?
              <Link
                href="/auth/login"
                className="ml-1 text-primary hover:text-primary/80 transition-colors"
              >
                Log In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
