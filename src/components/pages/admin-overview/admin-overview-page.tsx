"use client";

import * as React from "react";

import { AppIcons, type AppIconName } from "@/constant/icons";
import { type StatCardItem } from "@/components/pages/admin-overview/static-data";
import { formatUtcDateTime } from "@/lib/date";
import { cn } from "@/lib/utils";
import { useAdminOverview } from "@/features/admin/dashboard/admin.dash.query";
import type { AdminOverviewStatIcon } from "@/features/admin/dashboard/admin.dash.types";

const iconMap: Record<AdminOverviewStatIcon, AppIconName> = {
  users: "users",
  building: "organizations",
  document: "posts",
  flag: "campaigns",
  alert: "reports",
};

export function AdminOverviewPage() {
  const { data, isLoading, error } = useAdminOverview();

  const stats: StatCardItem[] =
    data?.data.stats.map((stat) => ({
      id: stat.id,
      label: stat.label,
      value: stat.value,
      subLabel: stat.subLabel,
      icon: iconMap[stat.icon] ?? "posts",
    })) ?? [];

  const activity = data?.data.activity ?? [];

  return (
    <section className="flex flex-col flex-1 gap-6">
      <div>
        <h2 className="text-lg font-semibold text-foreground">نظرة عامة</h2>
        <p className="mt-0.5 text-sm text-muted-foreground">
          إحصائيات سريعة عن المنصة
        </p>
      </div>

      {error && (
        <p className="text-sm text-destructive">
          تعذّر تحميل البيانات. حاول مرة أخرى.
        </p>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {isLoading
          ? Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="h-24 rounded-xl border border-border bg-card animate-pulse"
              />
            ))
          : stats.map((stat) => <StatCard key={stat.id} stat={stat} />)}
      </div>

      <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
        <h3 className="text-sm font-semibold text-foreground">نشاط حديث</h3>
        <p className="mt-0.5 text-xs text-muted-foreground">
          ملخص أحداث من إدارة المنصة
        </p>
        {isLoading ? (
          <div className="mt-3 space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-10 rounded bg-muted animate-pulse" />
            ))}
          </div>
        ) : (
          <ul className="mt-3 divide-y divide-border">
            {activity.map((row) => (
              <li
                key={row.id}
                className="flex flex-col gap-0.5 py-3 first:pt-0 last:pb-0 sm:flex-row sm:items-start sm:justify-between sm:gap-4"
              >
                <div>
                  <p className="text-sm font-medium text-foreground">
                    {row.title}
                  </p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {row.detail}
                  </p>
                </div>
                <p className="shrink-0 text-[11px] text-muted-foreground sm:text-end">
                  {formatUtcDateTime(row.at)}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}

function StatCard({ stat }: { stat: StatCardItem }) {
  const Icon = AppIcons[stat.icon];
  return (
    <div
      className={cn(
        "rounded-xl border border-border bg-card p-4 shadow-sm transition-shadow hover:shadow-md",
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-sm font-medium text-muted-foreground">
            {stat.label}
          </p>
          <p className="mt-1 text-2xl font-bold text-foreground">
            {stat.value}
          </p>
          {stat.subLabel && (
            <p className="mt-0.5 text-xs text-muted-foreground">
              {stat.subLabel}
            </p>
          )}
        </div>
        <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <Icon className="size-5" />
        </div>
      </div>
    </div>
  );
}
