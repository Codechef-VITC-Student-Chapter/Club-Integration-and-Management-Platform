"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, Lock, Mail } from "lucide-react";
import LoadingScreen from "@/components/fallbacks/loading-screen";
import { LoadingSpinner } from "@/components/fallbacks";
import { hashPassword } from "@/lib/auth";
export default function SignUpPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    reg_number: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({
    firstName: "",
    lastName: "",
    email: "",
    reg_number: "",
    password: "",
    confirmPassword: "",
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    if (field in errors) {
      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors: typeof errors = {
      firstName: "",
      lastName: "",
      email: "",
      reg_number: "",
      password: "",
      confirmPassword: "",
    };

    if (!formData.firstName.trim()) newErrors.firstName = "First name is required";
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    if (!formData.reg_number.trim()) newErrors.reg_number = "Registration number is required";
    if (!formData.password) newErrors.password = "Password is required";
    if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = "Passwords do not match";

    setErrors(newErrors);
    return Object.values(newErrors).every((err) => err === "");
  };

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!validateForm()) return;
  setLoading(true);

  try {
     const hashedPassword = hashPassword(formData.password);
    // Call backend API (Go server)
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/auth/signup`, // make sure Go server has this route
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          first_name: formData.firstName,
          last_name: formData.lastName,
          email: formData.email,
          reg_number: formData.reg_number,
          password: hashedPassword,
        }),
      }
    );

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || "Signup failed");
    }

    toast.success("Account created successfully!");
    router.push("/auth/login");
  } catch (error: any) {
    toast.error(error.message || "Error creating account. Please try again.");
  } finally {
    setLoading(false);
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
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* First & Last Name */}
              <div className="flex space-x-2">
                <div className="w-1/2 space-y-1">
                  <Label className="text-sm text-foreground font-medium">
                    FIRST NAME
                  </Label>
                  <div
                  className={`flex items-center border-[1px] md:border-2 ${
                    errors.email ? "border-destructive" : "border-foreground"
                  } rounded-md shadow-sm bg-card`}
                >
                  <div className="p-2">
                    <Mail className="h-5 w-5 text-foreground" />
                  </div>
                  <Input
                    type="text"
                    value={formData.firstName}
                    placeholder="Code"
                    onChange={(e) =>
                      handleInputChange("firstName", e.target.value)
                    }
                  />
                  </div>
                  {errors.firstName && (
                    <p className="text-destructive text-xs">{errors.firstName}</p>
                  )}
                </div>
                <div className="w-1/2 space-y-1">
                  <Label className="text-sm text-foreground font-medium">
                    LAST NAME
                  </Label>
                  <div
                  className={`flex items-center border-[1px] md:border-2 ${
                    errors.email ? "border-destructive" : "border-foreground"
                  } rounded-md shadow-sm bg-card`}
                >
                  <div className="p-2">
                    <Mail className="h-5 w-5 text-foreground" />
                  </div>
                  <Input
                    type="text"
                    value={formData.lastName}
                    placeholder="Chef"
                    onChange={(e) =>
                      handleInputChange("lastName", e.target.value)
                    }
                  />
                  </div>
                  {errors.lastName && (
                    <p className="text-destructive text-xs">{errors.lastName}</p>
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
                    errors.email ? "border-destructive" : "border-foreground"
                  } rounded-md shadow-sm bg-card`}
                >
                  <div className="p-2">
                    <Mail className="h-5 w-5 text-foreground" />
                  </div>
                  <Input
                    type="email"
                    placeholder="example@email.com"
                    className="border-0 shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 text-sm"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                  />
                </div>
                {errors.email && (
                  <p className="text-destructive text-xs">{errors.email}</p>
                )}
              </div>

              {/* Registration Number */}
              <div className="space-y-1">
                <Label className="text-sm text-foreground font-medium">
                  REGISTRATION NUMBER
                </Label>
                <div
                  className={`flex items-center border-[1px] md:border-2 ${
                    errors.email ? "border-destructive" : "border-foreground"
                  } rounded-md shadow-sm bg-card`}
                >
                  <div className="p-2">
                    <Mail className="h-5 w-5 text-foreground" />
                  </div>
                <Input
                  type="text"
                  placeholder="23ABC1234"
                  value={formData.reg_number}
                  onChange={(e) =>
                    handleInputChange("reg_number", e.target.value)
                  }
                />
                </div>
                {errors.reg_number && (
                  <p className="text-destructive text-xs">{errors.reg_number}</p>
                )}
              </div>

              {/* Password */}
              <div className="space-y-1">
                <Label className="text-sm text-foreground font-medium">
                  PASSWORD
                </Label>
                <div
                  className={`flex items-center border-[1px] md:border-2 ${
                    errors.email ? "border-destructive" : "border-foreground"
                  } rounded-md shadow-sm bg-card`}
                >
                  <div className="p-2">
                    <Mail className="h-5 w-5 text-foreground" />
                  </div>
                <Input
                  type="password"
                  placeholder="********"
                  value={formData.password}
                  onChange={(e) =>
                    handleInputChange("password", e.target.value)
                  }
                />
                </div>
                {errors.password && (
                  <p className="text-destructive text-xs">{errors.password}</p>
                )}
              </div>

              {/* Confirm Password */}
              <div className="space-y-1">
                <Label className="text-sm text-foreground font-medium">
                  CONFIRM PASSWORD
                </Label>
                <div
                  className={`flex items-center border-[1px] md:border-2 ${
                    errors.email ? "border-destructive" : "border-foreground"
                  } rounded-md shadow-sm bg-card`}
                >
                  <div className="p-2">
                    <Mail className="h-5 w-5 text-foreground" />
                  </div>
                <Input
                  type="password"
                  placeholder="********"
                  value={formData.confirmPassword}
                  onChange={(e) =>
                    handleInputChange("confirmPassword", e.target.value)
                  }
                />
                </div>
                {errors.confirmPassword && (
                  <p className="text-destructive text-xs">
                    {errors.confirmPassword}
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-primary hover:bg-primary/80 text-primary-foreground py-1 md:py-2 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ring transition-colors"
              >
                {loading ? (
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
