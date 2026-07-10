"use client";

import * as React from "react";

import { EmptyState } from "@/components/shared";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AppIcons } from "@/constant/icons";
import {
  orgStaffOverviewActivityData,
  orgStaffOverviewStatsData,
} from "@/components/pages/org-staff-overview/org-staff-overview.data";
import { formatUtcDateTime, formatUtcDateTimeOrDash, toUtcTimestamp } from "@/lib/date";
import { normalizeText } from "@/lib/text";

const statIcons = {
  campaigns: AppIcons.campaigns,
  posts: AppIcons.posts,
  donors: AppIcons.donors,
  notifications: AppIcons.notifications,
} as const;

const activityCategoryLabels = {
  campaigns: "الحملات",
  posts: "المنشورات",
  donors: "المتبرعون",
  reports: "البلاغات",
  tasks: "المهام",
  general: "عام",
} as const;

const priorityLabels = {
  high: "عالية",
  medium: "متوسطة",
  low: "منخفضة",
} as const;

const priorityBadgeClassNames = {
  high: "bg-rose-100 text-rose-700 dark:bg-rose-500/20 dark:text-rose-100",
  medium:
    "bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-100",
  low: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-100",
} as const;

export function OrgStaffOverviewPage() {
  const [query, setQuery] = React.useState("");
  const [categoryFilter, setCategoryFilter] = React.useState<
    keyof typeof activityCategoryLabels | "all"
  >("all");
  const [priorityFilter, setPriorityFilter] = React.useState<
    keyof typeof priorityLabels | "all"
  >("all");

  const filteredActivities = React.useMemo(() => {
    const normalizedQuery = normalizeText(query);
    const activities = orgStaffOverviewActivityData.filter((item) => {
      if (categoryFilter !== "all" && item.category !== categoryFilter) {
        return false;
      }

      if (priorityFilter !== "all" && item.priority !== priorityFilter) {
        return false;
      }

      if (!normalizedQuery) {
        return true;
      }

      return normalizeText(`${item.title} ${item.detail}`).includes(
        normalizedQuery,
      );
    });

    return activities.sort((firstItem, secondItem) => {
      return toUtcTimestamp(secondItem.at) - toUtcTimestamp(firstItem.at);
    });
  }, [categoryFilter, priorityFilter, query]);

  const topTaskActivities = React.useMemo(() => {
    return filteredActivities
      .filter((item) => item.category === "tasks" || item.priority === "high")
      .slice(0, 3);
  }, [filteredActivities]);

  const highPriorityCount = React.useMemo(() => {
    return filteredActivities.filter((item) => item.priority === "high").length;
  }, [filteredActivities]);

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

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
          <p className="text-xs text-muted-foreground">المهام المعروضة</p>
          <p className="mt-1 text-xl font-semibold text-foreground">
            {filteredActivities.length}
          </p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
          <p className="text-xs text-muted-foreground">أولوية عالية</p>
          <p className="mt-1 text-xl font-semibold text-foreground">
            {highPriorityCount}
          </p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
          <p className="text-xs text-muted-foreground">آخر تحديث</p>
          <p className="mt-1 text-sm font-medium text-foreground">
            {formatUtcDateTimeOrDash(filteredActivities[0]?.at)}
          </p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
          <p className="text-xs text-muted-foreground">فئات النشاط</p>
          <p className="mt-1 text-xl font-semibold text-foreground">
            {new Set(filteredActivities.map((item) => item.category)).size}
          </p>
        </div>
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

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="rounded-xl border border-border bg-card p-4 shadow-sm lg:col-span-2">
          <h3 className="text-sm font-semibold text-foreground">
            نشاطك اليومي مع فلاتر
          </h3>
          <p className="mt-0.5 text-xs text-muted-foreground">
            راقب مهامك بسرعة بحسب الفئة والأولوية
          </p>

          <div className="mt-3 grid gap-3 md:grid-cols-3">
            <Input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="ابحث داخل المهام والنشاط..."
              className="text-right"
            />

            <Select
              dir="rtl"
              value={categoryFilter}
              onValueChange={(value) =>
                setCategoryFilter(
                  value as keyof typeof activityCategoryLabels | "all",
                )
              }
            >
              <SelectTrigger className="w-full text-right">
                <SelectValue placeholder="كل الفئات" />
              </SelectTrigger>
              <SelectContent align="start" position="popper" className="text-right">
                <SelectItem value="all">كل الفئات</SelectItem>
                {Object.entries(activityCategoryLabels).map(([value, label]) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              dir="rtl"
              value={priorityFilter}
              onValueChange={(value) =>
                setPriorityFilter(value as keyof typeof priorityLabels | "all")
              }
            >
              <SelectTrigger className="w-full text-right">
                <SelectValue placeholder="كل الأولويات" />
              </SelectTrigger>
              <SelectContent align="start" position="popper" className="text-right">
                <SelectItem value="all">كل الأولويات</SelectItem>
                {Object.entries(priorityLabels).map(([value, label]) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
          <h3 className="text-sm font-semibold text-foreground">مهام تحتاج متابعة</h3>
          <p className="mt-0.5 text-xs text-muted-foreground">
            أولويات مركزة ضمن عملك اليومي
          </p>

          {topTaskActivities.length === 0 ? (
            <p className="mt-4 text-xs text-muted-foreground">
              لا توجد مهام متابعة ضمن الفلاتر الحالية.
            </p>
          ) : (
            <ul className="mt-3 space-y-3">
              {topTaskActivities.map((item) => (
                <li key={item.id} className="rounded-lg border border-border/70 p-3">
                  <p className="text-sm font-medium text-foreground">{item.title}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{item.detail}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
        <h3 className="text-sm font-semibold text-foreground">نشاط حديث</h3>
        <p className="mt-0.5 text-xs text-muted-foreground">
          ما يخص مهامك ضمن المنظمة (بيانات تجريبية)
        </p>

        {filteredActivities.length === 0 ? (
          <div className="mt-3">
            <EmptyState
              icon="search"
              title="لا توجد نتائج"
              description="قم بتعديل كلمات البحث أو الفلاتر لإظهار نشاط مناسب."
            />
          </div>
        ) : (
          <ul className="mt-3 divide-y divide-border">
            {filteredActivities.map((row) => (
              <li
                key={row.id}
                className="flex flex-col gap-2 py-3 first:pt-0 last:pb-0 sm:flex-row sm:items-start sm:justify-between sm:gap-4"
              >
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-sm font-medium text-foreground">{row.title}</p>
                    <Badge
                      variant="secondary"
                      className={priorityBadgeClassNames[row.priority]}
                    >
                      أولوية {priorityLabels[row.priority]}
                    </Badge>
                    <Badge variant="outline">
                      {activityCategoryLabels[row.category]}
                    </Badge>
                  </div>
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
