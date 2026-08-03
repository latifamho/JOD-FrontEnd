"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import {
  getDashboardHomeByRole,
  type DashboardRole,
} from "@/constant/routes";
import { useAuth } from "@/providers/AuthProvider";

function toRouteRole(
  role: "admin" | "org_owner" | "org_staff",
): DashboardRole {
  if (role === "admin") return "admin";
  return role === "org_owner" ? "organization_owner" : "organization_staff";
}

export default function DashboardPage() {
  const router = useRouter();
  const { dashboardRole, isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (isLoading) return;

    if (!isAuthenticated || !dashboardRole) {
      router.replace("/login");
      return;
    }

    router.replace(getDashboardHomeByRole(toRouteRole(dashboardRole)));
  }, [dashboardRole, isAuthenticated, isLoading, router]);

  return (
    <div className="flex flex-1 items-center justify-center" role="status" aria-live="polite">
      <div className="space-y-3 text-center">
        <div className="mx-auto size-10 animate-pulse rounded-full bg-primary/15" />
        <p className="text-sm text-muted-foreground">جاري تحويلك إلى لوحة التحكم...</p>
      </div>
    </div>
  );
}
