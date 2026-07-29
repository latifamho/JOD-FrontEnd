"use client";

import * as React from "react";

import { AppIcons } from "@/constant/icons";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { displayOrDash } from "@/lib/text";
import {
  useAdminAnalyticsKpis,
  useAdminAnalyticsWeekly,
} from "@/features/admin/analytics/admin.analytics.query";

type AnalyticsRange = "7d" | "30d" | "90d" | "12m";

const rangeLabels: Record<AnalyticsRange, string> = {
  "7d": "آخر 7 أيام",
  "30d": "آخر 30 يومًا",
  "90d": "آخر 90 يومًا",
  "12m": "آخر 12 شهرًا",
};

export function AnalyticsDashboardPage() {
  const [range, setRange] = React.useState<AnalyticsRange>("30d");
  const analyticsRange = React.useMemo(() => ({ range }), [range]);
  const {
    data: kpisData,
    isLoading: isKpisLoading,
    error: kpisError,
  } = useAdminAnalyticsKpis(analyticsRange);
  const {
    data: weeklyData,
    isLoading: isWeeklyLoading,
    error: weeklyError,
  } = useAdminAnalyticsWeekly(analyticsRange);

  const kpis = kpisData?.data.kpis ?? [];
  const weeklyRows = weeklyData?.data.rows ?? [];
  const weeklyMaximum = React.useMemo(
    () =>
      Math.max(
        1,
        ...weeklyRows.flatMap((row) => [row.visits, row.newUsers, row.donations]),
      ),
    [weeklyRows],
  );

  return (
    <section className="flex flex-col flex-1 gap-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
        <h2 className="text-lg font-semibold text-foreground">
          التحليلات والإحصائيات
        </h2>
        <p className="mt-0.5 text-sm text-muted-foreground">
          مؤشرات ورسوم أداء المنصة حسب الفترة المحددة
        </p>
        </div>
        <Select value={range} onValueChange={(value) => setRange(value as AnalyticsRange)}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {(Object.keys(rangeLabels) as AnalyticsRange[]).map((value) => (
              <SelectItem key={value} value={value}>{rangeLabels[value]}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {kpisError && (
        <p className="text-sm text-destructive">
          تعذّر تحميل المؤشرات. حاول مرة أخرى.
        </p>
      )}

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {isKpisLoading
          ? Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="h-24 rounded-xl border border-border bg-card animate-pulse"
              />
            ))
          : kpis.map((kpi) => (
              <div
                key={kpi.id}
                className="rounded-xl border border-border bg-card p-4 shadow-sm"
              >
                <p className="text-xs text-muted-foreground">
                  {displayOrDash(kpi.label)}
                </p>
                <p className="mt-1 text-2xl font-bold text-foreground">
                  {displayOrDash(kpi.value)}
                </p>
                <p className="mt-0.5 text-[11px] text-muted-foreground">
                  مقارنة بالشهر الماضي: {displayOrDash(kpi.changeVsLastMonth)}
                </p>
              </div>
            ))}
      </div>

      <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
        <h3 className="text-sm font-semibold text-foreground">ملخص أسبوعي</h3>
        <p className="mt-0.5 text-xs text-muted-foreground">
          منشورات ومستخدمون وحملات جديدة لكل أسبوع
        </p>

        {weeklyError && (
          <p className="mt-3 text-sm text-destructive">
            تعذّر تحميل الملخص الأسبوعي. حاول مرة أخرى.
          </p>
        )}

        <div className="mt-3 overflow-auto">
          {isWeeklyLoading ? (
            <div className="space-y-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-9 rounded bg-muted animate-pulse" />
              ))}
            </div>
          ) : (
            <table className="w-full min-w-[min(100%,480px)] text-sm">
              <thead>
                <tr className="border-b border-border text-start text-xs text-muted-foreground">
                  <th className="pb-2 font-medium">الأسبوع</th>
                  <th className="pb-2 font-medium">منشورات</th>
                  <th className="pb-2 font-medium">مستخدمون جدد</th>
                  <th className="pb-2 font-medium">حملات جديدة</th>
                </tr>
              </thead>
              <tbody>
                {weeklyRows.map((row) => (
                  <tr
                    key={row.weekLabel}
                    className="border-b border-border/50 last:border-0"
                  >
                    <td className="py-2.5 font-medium text-foreground">
                      {displayOrDash(row.weekLabel)}
                    </td>
                    <td className="py-2.5 text-muted-foreground">
                      {displayOrDash(row.visits)}
                    </td>
                    <td className="py-2.5 text-muted-foreground">
                      {displayOrDash(row.newUsers)}
                    </td>
                    <td className="py-2.5 text-muted-foreground">
                      {displayOrDash(row.donations)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-semibold text-foreground">اتجاه النشاط</h3>
            <p className="mt-0.5 text-xs text-muted-foreground">
              مقارنة أسبوعية بين المنشورات والمستخدمين والحملات الجديدة
            </p>
          </div>
          <AppIcons.analytics className="size-5 text-primary" />
        </div>
        <div className="mt-5 space-y-4">
          {weeklyRows.map((row) => (
            <div key={`chart-${row.weekLabel}`} className="space-y-2">
              <p className="text-xs font-medium text-foreground">{row.weekLabel}</p>
              <div className="grid gap-2 sm:grid-cols-3">
                {[
                  { label: "منشورات", value: row.visits },
                  { label: "مستخدمون", value: row.newUsers },
                  { label: "حملات", value: row.donations },
                ].map((metric) => (
                  <div key={metric.label} className="space-y-1">
                    <div className="flex justify-between text-[11px] text-muted-foreground">
                      <span>{metric.label}</span>
                      <span>{metric.value}</span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-muted">
                      <div
                        className="h-full rounded-full bg-primary"
                        style={{ width: `${Math.max(4, (metric.value / weeklyMaximum) * 100)}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
          {!isWeeklyLoading && weeklyRows.length === 0 ? (
            <p className="py-6 text-center text-xs text-muted-foreground">
              لا توجد بيانات كافية للفترة المحددة.
            </p>
          ) : null}
        </div>
      </div>
    </section>
  );
}
