import React from "react";
import Image from "next/image";

interface LoadingScreenProps {
  message?: string;
  showLogo?: boolean;
}

export const LoadingScreen = ({
  message = "Loading...",
  showLogo = true,
}: LoadingScreenProps) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background">
      <div className="text-center space-y-6">
        {/* Logo */}
        {showLogo && (
          <div className="flex justify-center mb-8">
            <Image
              src="/logo.png"
              alt="CodeChef VIT Chennai Chapter"
              width={120}
              height={90}
              className="h-20 md:h-24 w-auto"
              priority
            />
          </div>
        )}

        {/* Spinner */}
        <div className="relative">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary/20 border-t-primary mx-auto"></div>
          <div className="absolute inset-0 rounded-full h-16 w-16 border-4 border-transparent border-r-primary/40 animate-pulse mx-auto"></div>
        </div>

        {/* Loading Message */}
        <div className="space-y-2">
          <p className="text-foreground text-lg font-medium">{message}</p>
          <div className="flex justify-center space-x-1">
            <div className="w-2 h-2 bg-primary rounded-full animate-bounce bounce-delay-0"></div>
            <div className="w-2 h-2 bg-primary rounded-full animate-bounce bounce-delay-150"></div>
            <div className="w-2 h-2 bg-primary rounded-full animate-bounce bounce-delay-300"></div>
          </div>
        </div>
      </div>
    </div>
  );
};
