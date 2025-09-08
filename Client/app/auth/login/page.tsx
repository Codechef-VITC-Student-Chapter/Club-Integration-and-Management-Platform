"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState, Suspense } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn, useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { User, Lock } from "lucide-react";
import { LoadingScreen, LoadingSpinner } from "@/components/fallbacks";
import { Button, Input, Label } from "@/components/ui";
import { loginSchema, type LoginFormData } from "@/lib/schemas";

function LoginPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(false);
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  useEffect(() => {
    if (status === "loading") return;
    if (session) router.push(callbackUrl);
  }, [session, status, router, callbackUrl]);

  if (status === "loading") return <LoadingScreen />;
  if (session) return null;

  const onSubmit = async (data: LoginFormData) => {
    setLoading(true);
    try {
      const result = await signIn("credentials", {
        reg_number: data.reg_number,
        password: data.password,
        redirect: false,
      });

      if (result?.error) {
        toast.error("Invalid credentials. Please try again.");
      } else if (result?.ok) {
        toast.success("Login successful!");
        router.push(callbackUrl);
      }
    } catch (err) {
      console.error("Login error:", err);
      toast.error("An error occurred during login. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-background relative h-screen overflow-hidden">
      {/* Background Images */}
      <div className="absolute inset-0 md:hidden">
        <Image
          src="/mobile_login.png"
          alt="Mobile Login Background"
          fill
          className="object-cover"
          priority
        />
      </div>
      <div className="absolute inset-0 hidden md:block">
        <Image
          src="/desktop_login.png"
          alt="Desktop Login Background"
          fill
          className="object-contain"
          priority
        />
      </div>

      {/* Login Form Container */}
      <div className="min-h-screen flex items-center justify-center md:justify-end">
        <div className="bg-card rounded-[40px] md:rounded-[67px] w-[90%] shadow-lg p-6 md:p-12 md:max-w-md md:w-[561px] md:h-[555px] mx-4 md:relative absolute md:bottom-auto flex flex-col justify-center border md:mr-16 px-8">
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

            <h2 className="text-[16px] md:text-2xl text-primary text-center mb-6 font-semibold">
              LOGIN
            </h2>

            {/* Login Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* Registration Number */}
              <div className="space-y-1">
                <Label className="text-sm text-foreground font-medium">
                  REGISTRATION NUMBER
                </Label>
                <div
                  className={`flex items-center border-[1px] md:border-2 ${
                    errors.reg_number
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
                    {...register("reg_number", {
                      required: "Registration number is required",
                    })}
                    className="border-0 shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 placeholder-muted-foreground text-sm"
                  />
                </div>
                {errors.reg_number && (
                  <p className="text-destructive text-xs">
                    {errors.reg_number.message}
                  </p>
                )}
              </div>

              {/* Password */}
              <div className="space-y-1">
                <Label className="text-sm text-foreground font-medium">
                  PASSWORD
                </Label>
                <div
                  className={`flex items-center border-[1px] md:border-2 ${
                    errors.password ? "border-destructive" : "border-foreground"
                  } rounded-md shadow-sm bg-card`}
                >
                  <div className="p-2">
                    <Lock className="h-5 w-5 text-foreground" />
                  </div>
                  <Input
                    type="password"
                    placeholder="********"
                    {...register("password", {
                      required: "Password is required",
                    })}
                    className="border-0 shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 placeholder-muted-foreground text-sm"
                  />
                </div>
                {errors.password && (
                  <p className="text-destructive text-xs">
                    {errors.password.message}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-primary hover:bg-primary/80 text-primary-foreground py-1 md:py-2 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ring transition-colors"
              >
                {loading ? (
                  <div className="flex items-center space-x-2">
                    <LoadingSpinner size="sm" />
                    <span>Logging in...</span>
                  </div>
                ) : (
                  "Log in"
                )}
              </Button>
            </form>

            {/* Forgot Password & Sign-Up */}
            <div className="flex items-center justify-between mt-4">
              <Link
                href="/auth/forgot-password"
                className="text-[10px] md:text-sm text-primary font-semibold hover:text-primary/80 transition-colors"
              >
                Forgot Password?
              </Link>
              <p className="text-[12px] md:text-sm text-foreground font-semibold">
                Don&apos;t have an account?
                <Link
                  href="/auth/signup"
                  className="ml-1 text-primary hover:text-primary/80 transition-colors"
                >
                  Sign Up
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <LoginPageContent />
    </Suspense>
  );
}
