"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User } from "lucide-react";
import { LoadingSpinner } from "@/components/fallbacks";
import { PiLockLight } from "react-icons/pi";
import { hashPassword } from "@/lib/auth"; 
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";

function RegNumberStep({ onSuccess }: { onSuccess: (reg: string) => void }) {
  const [regNumber, setRegNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!regNumber.trim()) {
      setError("Registration number is required");
      return;
    }
    setLoading(true);
    setError("");
    try {
     const res = await fetch(`${API_URL}/auth/send/otp/${regNumber.trim()}`, {
  method: "GET",
});
      
      const data = await res.json();
      if (res.ok) {
        toast.success(data.Message || "OTP sent to your registered email!");
        onSuccess(regNumber.trim());
      } else {
        setError(data.Message || "Error sending OTP.");
        toast.error(data.Message || "Error sending OTP.");
      }
    } catch {
      setError("Network error. Try again.");
      toast.error("Network error. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-1">
        <Label className="text-sm text-foreground font-medium">
          REGISTRATION NUMBER
        </Label>
        <div
          className={`flex items-center border-[1px] md:border-2 ${
            error ? "border-destructive" : "border-foreground"
          } rounded-md shadow-sm bg-card`}
        >
          <div className="p-2">
            <User className="h-5 w-5 text-foreground" />
          </div>
          <Input
            type="text"
            placeholder="23ABC1234"
            className="border-0 shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 text-sm"
            value={regNumber}
            onChange={(e) => {
              setRegNumber(e.target.value);
              setError("");
            }}
          />
        </div>
        {error && <p className="text-destructive text-xs">{error}</p>}
      </div>
      <Button
        type="submit"
        disabled={loading}
        className="w-full bg-primary hover:bg-primary/80 text-primary-foreground py-1 md:py-2 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ring transition-colors"
      >
        {loading ? (
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
  const [otp, setOTP] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp.trim() || !password.trim()) {
      setError("OTP and new password are required");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const hashedPassword = hashPassword(password.trim());

      const res = await fetch(`${API_URL}/auth/set/pass`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          reg_no: regNumber,
          otp: otp.trim(),
          password: hashedPassword,
        }),
      });
      const data = await res.json();
      const message =
      data.Message || data.message || data.error || data.Error || "";
      if (res.ok) {
        toast.success(message || "Password reset successful!");
        router.push("/auth/login");
      } else {
      
      if (message.toLowerCase().includes("otp")) {
        setError("Incorrect OTP. Please try again.");
        toast.error("Incorrect OTP. Please try again.");
      } else {
        setError(message || "Error resetting password.");
        toast.error(message || "Error resetting password.");
      }
    }
    } catch {
      setError("Network error. Try again.");
      toast.error("Network error. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-1">
        <Label className="text-sm text-foreground font-medium">
          OTP (Check your email)
        </Label>
        <div
          className={`flex items-center border-[1px] md:border-2 ${
            error ? "border-destructive" : "border-foreground"
          } rounded-md shadow-sm bg-card`}
        >
          <div className="p-2">
            <PiLockLight size={20} color="currentColor" />
          </div>
          <Input
            type="text"
            placeholder="Enter OTP"
            className="border-0 shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 text-sm"
            value={otp}
            onChange={(e) => {
              setOTP(e.target.value);
              setError("");
            }}
          />
        </div>
      </div>
      <div className="space-y-1">
        <Label className="text-sm text-foreground font-medium">
          NEW PASSWORD
        </Label>
        <Input
          type="password"
          placeholder="Enter new password"
          className="border-foreground rounded-md shadow-sm text-sm"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            setError("");
          }}
        />
      </div>
      {error && <p className="text-destructive text-xs">{error}</p>}
      <Button
        type="submit"
        disabled={loading}
        className="w-full bg-primary hover:bg-primary/80 text-primary-foreground py-1 md:py-2 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ring transition-colors"
      >
        {loading ? (
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
        <div className="bg-card rounded-[40px] md:rounded-[67px] w-[90%] shadow-lg p-6 md:p-12 md:max-w-md md:w-[561px] md:h-[400px] mx-4 md:relative absolute md:bottom-auto flex flex-col justify-center border md:mr-16 px-8">
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
