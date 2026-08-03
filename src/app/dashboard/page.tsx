"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { getAuthenticatedLanding } from "@/features/shared/auth.services/auth.utils";
import { useAuth } from "@/providers/AuthProvider";

export default function DashboardPage() {
  const router = useRouter();
  const { dashboardContext, isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (isLoading) return;

    if (!isAuthenticated || !dashboardContext) {
      router.replace("/login");
      return;
    }

    router.replace(getAuthenticatedLanding(dashboardContext));
  }, [dashboardContext, isAuthenticated, isLoading, router]);

  return (
    <div
      className="flex flex-1 items-center justify-center"
      role="status"
      aria-live="polite"
    >
      <div className="space-y-3 text-center">
        <div className="mx-auto size-10 animate-pulse rounded-full bg-primary/15" />
        <p className="text-sm text-muted-foreground">جارٍ تجهيز وجهتك...</p>
      </div>
    </div>
  );
}
