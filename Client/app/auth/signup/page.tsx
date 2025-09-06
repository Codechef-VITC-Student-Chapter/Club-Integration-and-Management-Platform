"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, Lock, Mail } from "lucide-react";
import { LoadingSpinner } from "@/components/fallbacks";
import { useSignupMutation } from "@/lib/redux/api";
import { hashPassword } from "@/lib/auth";

// Signup form validation schema
const signupSchema = z
  .object({
    first_name: z
      .string()
      .min(1, "First name is required")
      .max(50, "First name too long"),
    last_name: z
      .string()
      .min(1, "Last name is required")
      .max(50, "Last name too long"),
    email: z.string().email("Invalid email address"),
    reg_number: z.string().min(1, "Registration number is required"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type SignupFormData = z.infer<typeof signupSchema>;
export default function SignUpPage() {
  const router = useRouter();

  // RTK Query mutation hook
  const [signup, { isLoading }] = useSignupMutation();

  // React Hook Form setup
  const form = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      email: "",
      reg_number: "",
      password: "",
      confirmPassword: "",
    },
  });

  const handleSubmit = async (data: SignupFormData) => {
    try {
      // Hash the password before sending to API
      const hashedPassword = hashPassword(data.password);

      // Prepare data for API call (excluding confirmPassword)
      const signupData = {
        first_name: data.first_name,
        last_name: data.last_name,
        email: data.email,
        reg_number: data.reg_number,
        password: hashedPassword,
      };

      // Call the signup mutation
      await signup(signupData).unwrap();

      toast.success("Account created successfully!");
      router.push("/auth/login");
    } catch (error) {
      console.error("Signup error:", error);
      // Handle different types of errors
      if (error && typeof error === "object" && "status" in error) {
        const errorWithStatus = error as { status: number };
        if (errorWithStatus.status === 409) {
          toast.error("User already exists. Please try logging in.");
        } else if (errorWithStatus.status >= 500) {
          toast.error("Server error. Please try again later.");
        } else {
          toast.error("Signup failed. Please try again.");
        }
      } else {
        toast.error("An unexpected error occurred. Please try again.");
      }
    }
  };

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

      {/* Sign Up Form Container */}
      <div className="min-h-screen flex items-center justify-center md:justify-end">
        <div className="bg-card rounded-[40px] md:rounded-[67px] w-[90%] shadow-lg p-6 md:p-12 md:max-w-md md:w-[561px] md:h-[670px] mx-4 md:relative absolute md:bottom-auto flex flex-col justify-center border md:mr-16 px-8">
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
              SIGN UP
            </h2>

            {/* Sign Up Form */}
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="space-y-4"
            >
              {/* First & Last Name */}
              <div className="flex space-x-2">
                <div className="w-1/2 space-y-1">
                  <Label className="text-sm text-foreground font-medium">
                    FIRST NAME
                  </Label>
                  <div
                    className={`flex items-center border-[1px] md:border-2 ${
                      form.formState.errors.first_name
                        ? "border-destructive"
                        : "border-foreground"
                    } rounded-md shadow-sm bg-card`}
                  >
                    <div className="p-2">
                      <User className="h-5 w-5 text-foreground" />
                    </div>
                    <Input
                      type="text"
                      placeholder="Code"
                      className="border-0 shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 text-sm"
                      {...form.register("first_name")}
                    />
                  </div>
                  {form.formState.errors.first_name && (
                    <p className="text-destructive text-xs">
                      {form.formState.errors.first_name.message}
                    </p>
                  )}
                </div>
                <div className="w-1/2 space-y-1">
                  <Label className="text-sm text-foreground font-medium">
                    LAST NAME
                  </Label>
                  <div
                    className={`flex items-center border-[1px] md:border-2 ${
                      form.formState.errors.last_name
                        ? "border-destructive"
                        : "border-foreground"
                    } rounded-md shadow-sm bg-card`}
                  >
                    <div className="p-2">
                      <User className="h-5 w-5 text-foreground" />
                    </div>
                    <Input
                      type="text"
                      placeholder="Chef"
                      className="border-0 shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 text-sm"
                      {...form.register("last_name")}
                    />
                  </div>
                  {form.formState.errors.last_name && (
                    <p className="text-destructive text-xs">
                      {form.formState.errors.last_name.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Email */}
              <div className="space-y-1">
                <Label className="text-sm text-foreground font-medium">
                  EMAIL
                </Label>
                <div
                  className={`flex items-center border-[1px] md:border-2 ${
                    form.formState.errors.email
                      ? "border-destructive"
                      : "border-foreground"
                  } rounded-md shadow-sm bg-card`}
                >
                  <div className="p-2">
                    <Mail className="h-5 w-5 text-foreground" />
                  </div>
                  <Input
                    type="email"
                    placeholder="example@email.com"
                    className="border-0 shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 text-sm"
                    {...form.register("email")}
                  />
                </div>
                {form.formState.errors.email && (
                  <p className="text-destructive text-xs">
                    {form.formState.errors.email.message}
                  </p>
                )}
              </div>

              {/* Registration Number */}
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

              {/* Password */}
              <div className="space-y-1">
                <Label className="text-sm text-foreground font-medium">
                  PASSWORD
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
                    placeholder="********"
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

              {/* Confirm Password */}
              <div className="space-y-1">
                <Label className="text-sm text-foreground font-medium">
                  CONFIRM PASSWORD
                </Label>
                <div
                  className={`flex items-center border-[1px] md:border-2 ${
                    form.formState.errors.confirmPassword
                      ? "border-destructive"
                      : "border-foreground"
                  } rounded-md shadow-sm bg-card`}
                >
                  <div className="p-2">
                    <Lock className="h-5 w-5 text-foreground" />
                  </div>
                  <Input
                    type="password"
                    placeholder="********"
                    className="border-0 shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 text-sm"
                    {...form.register("confirmPassword")}
                  />
                </div>
                {form.formState.errors.confirmPassword && (
                  <p className="text-destructive text-xs">
                    {form.formState.errors.confirmPassword.message}
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-primary hover:bg-primary/80 text-primary-foreground py-1 md:py-2 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ring transition-colors"
              >
                {isLoading ? (
                  <div className="flex items-center space-x-2">
                    <LoadingSpinner size="sm" />
                    <span>Signing Up...</span>
                  </div>
                ) : (
                  "Sign Up"
                )}
              </Button>
            </form>
          </div>

          {/* Login Redirect */}
          <div className="flex justify-center mt-2">
            <p className="text-[12px] md:text-sm text-foreground font-semibold">
              Already have an account?
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
