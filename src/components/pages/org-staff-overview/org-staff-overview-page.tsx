"use client";

import * as React from "react";

import { AppIcons } from "@/constant/icons";
import {
  orgStaffOverviewActivityData,
  orgStaffOverviewStatsData,
} from "@/components/pages/org-staff-overview/org-staff-overview.data";
import { formatUtcDateTime } from "@/lib/date";

const statIcons = {
  campaigns: AppIcons.campaigns,
  posts: AppIcons.posts,
  donors: AppIcons.donors,
  notifications: AppIcons.notifications,
} as const;

export function OrgStaffOverviewPage() {
  return (
    <section className="flex flex-col flex-1 gap-6">
      <div>
        <h2 className="text-lg font-semibold text-foreground">
          لوحة موظف المنظمة
        </h2>
        <p className="mt-0.5 text-sm text-muted-foreground">
          نظرة عامة على الحملات والمنشورات التي لديك صلاحية الوصول إليها
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {orgStaffOverviewStatsData.map((stat) => {
          const Icon = statIcons[stat.id as keyof typeof statIcons];
          return (
            <div
              key={stat.id}
              className="rounded-xl border border-border bg-card p-4 shadow-sm"
            >
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Icon className="size-5" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    {stat.label}
                  </p>
                  <p className="text-xl font-bold text-foreground">{stat.value}</p>
                  <p className="text-[11px] text-muted-foreground">{stat.hint}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
        <h3 className="text-sm font-semibold text-foreground">نشاط حديث</h3>
        <p className="mt-0.5 text-xs text-muted-foreground">
          ما يخص مهامك ضمن المنظمة (بيانات تجريبية)
        </p>
        <ul className="mt-3 divide-y divide-border">
          {orgStaffOverviewActivityData.map((row) => (
            <li
              key={row.id}
              className="flex flex-col gap-0.5 py-3 first:pt-0 last:pb-0 sm:flex-row sm:items-start sm:justify-between sm:gap-4"
            >
              <div>
                <p className="text-sm font-medium text-foreground">{row.title}</p>
                <p className="mt-0.5 text-xs text-muted-foreground">{row.detail}</p>
              </div>
              <p className="shrink-0 text-[11px] text-muted-foreground sm:text-end">
                {formatUtcDateTime(row.at)}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
