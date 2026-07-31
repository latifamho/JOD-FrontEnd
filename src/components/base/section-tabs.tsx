"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { AppIcons } from "@/constant/icons";
import {
  getRoleFromPath,
  getTabsForPath,
  isRouteActive,
  type DashboardRole,
} from "@/constant/routes";
import { cn } from "@/lib/utils";
import { useAuth } from "@/providers/AuthProvider";

function normalizePathname(pathname: string): string {
  const normalized = pathname.trim().replace(/\/+$/, "");
  return normalized === "" ? "/" : normalized;
}

function toRouteRole(
  dashboardRole: "admin" | "org_owner" | "org_staff" | null,
  pathname: string,
): DashboardRole {
  if (dashboardRole === "admin") return "admin";
  if (dashboardRole === "org_owner") return "organization_owner";
  if (dashboardRole === "org_staff") return "organization_staff";
  return getRoleFromPath(pathname);
}

export function SectionTabs() {
  const pathname = usePathname();
  const { dashboardRole, can } = useAuth();
  const role = toRouteRole(dashboardRole, pathname);
  const tabs = getTabsForPath(role, pathname, can);
  const normalizedPath = normalizePathname(pathname);

  const activeTabHref =
    tabs.find((tab) => normalizePathname(tab.href) === normalizedPath)?.href ??
    tabs
      .filter((tab) => isRouteActive(pathname, tab.href))
      .sort(
        (firstTab, secondTab) =>
          normalizePathname(secondTab.href).length -
          normalizePathname(firstTab.href).length,
      )[0]?.href;

  if (tabs.length === 0) return null;

  return (
    <div className="border-b border-border bg-background/95 px-4">
      <div className="flex min-h-12 flex-wrap items-end gap-2">
        {tabs.map((tab) => {
          const Icon = AppIcons[tab.icon];
          const active = normalizePathname(tab.href) === normalizePathname(activeTabHref ?? "");

          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={cn(
                "inline-flex h-11 items-center gap-2 rounded-t-xl border-b-2 px-3 text-sm font-semibold transition-colors",
                active
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:border-primary/50 hover:text-primary",
              )}
            >
              <Icon className="size-4" />
              {tab.label}
            </Link>
          );
        })}
      </div>
    </div>
  );
}