"use client";

import { LoadingScreen } from "@/components/fallbacks";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

interface LeadLayoutProps {
  children: React.ReactNode;
}

export default function LeadLayout({ children }: LeadLayoutProps) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated" && session?.user && !session.user.is_lead) {
      router.replace("/dashboard");
    }
  }, [session, status, router]);

  if (
    status === "loading" ||
    status === "unauthenticated" ||
    (session?.user && !session.user.is_lead)
  ) {
    return <LoadingScreen />;
  }

  return <>{children}</>;
}
