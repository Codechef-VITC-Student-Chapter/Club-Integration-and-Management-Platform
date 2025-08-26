"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import LoadingScreen from "@/components/fallbacks/loading-screen";

export default function HomePage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") {
      return;
    }

    if (session) {
      router.push("/dashboard");
    } else {
      router.push("/auth/login");
    }
  }, [session, status, router]);

  // Show loading while checking session or redirecting
  return <LoadingScreen />;
}
