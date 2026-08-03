"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";

import {
  getFirstAllowedRoute,
  getOrganizationPermissionForPath,
  isOrganizationRouteEnabled,
  type DashboardRole,
} from "@/constant/routes";
import {
  isOrganizationApprovalPending,
  PENDING_APPROVAL_ROUTE,
} from "@/features/shared/auth.services/auth.utils";
import { useAuth } from "@/providers/AuthProvider";

function toRouteRole(role: "admin" | "org_owner" | "org_staff"): DashboardRole {
  if (role === "admin") return "admin";
  return role === "org_owner" ? "organization_owner" : "organization_staff";
}

export function DashboardGuard({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const {
    dashboardRole,
    dashboardContext,
    isAuthenticated,
    isLoading,
    can,
  } = useAuth();

  useEffect(() => {
    if (isLoading) return;

    if (!isAuthenticated || !dashboardRole) {
      router.replace("/login");
      return;
    }

    if (isOrganizationApprovalPending(dashboardContext)) {
      router.replace(PENDING_APPROVAL_ROUTE);
      return;
    }

    const routeRole = toRouteRole(dashboardRole);
    const fallback = getFirstAllowedRoute(routeRole, can);

    if (!isOrganizationRouteEnabled(pathname)) {
      router.replace(fallback);
      return;
    }

    if (dashboardRole === "org_staff") {
      const permission = getOrganizationPermissionForPath(pathname);
      if (permission && !can(permission)) router.replace(fallback);
    }
  }, [
    can,
    dashboardContext,
    dashboardRole,
    isAuthenticated,
    isLoading,
    pathname,
    router,
  ]);

  if (isLoading || isOrganizationApprovalPending(dashboardContext)) return null;
  return <>{children}</>;
}
