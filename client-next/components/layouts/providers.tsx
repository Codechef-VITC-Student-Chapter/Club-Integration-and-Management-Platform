"use client";

import React from "react";
import { SessionProvider } from "next-auth/react";
import { StoreProvider } from "@/lib/redux";
import { Toaster } from "@/components/ui/sonner";

interface ProvidersProps {
  children: React.ReactNode;
}

export const Providers = ({ children }: ProvidersProps) => {
  return (
    <SessionProvider>
      <StoreProvider>
        {children}
        <Toaster />
      </StoreProvider>
    </SessionProvider>
  );
};
