"use client";

import * as React from "react";

import { AppIcons } from "@/constant/icons";
import { displayOrDash } from "@/lib/text";
import {
  analyticsKpiPreviewData,
  analyticsWeeklyPreviewData,
} from "@/components/pages/analytics-dashboard/analytics.data";

export function AnalyticsDashboardPage() {
  return (
    <section className="flex flex-col flex-1 gap-6">
      <div>
        <h2 className="text-lg font-semibold text-foreground">
          التحليلات والإحصائيات
        </h2>
        <p className="mt-0.5 text-sm text-muted-foreground">
          مؤشرات تجريبية — الرسوم البيانية قيد الإعداد
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {analyticsKpiPreviewData.map((kpi) => (
          <div
            key={kpi.id}
            className="rounded-xl border border-border bg-card p-4 shadow-sm"
          >
            <p className="text-xs text-muted-foreground">{displayOrDash(kpi.label)}</p>
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
        <h3 className="text-sm font-semibold text-foreground">
          ملخص أسبوعي (تجريبي)
        </h3>
        <p className="mt-0.5 text-xs text-muted-foreground">
          زيارات وتسجيلات وتبرعات — بيانات وهمية للعرض
        </p>
        <div className="mt-3 overflow-auto">
          <table className="w-full min-w-[min(100%,480px)] text-sm">
            <thead>
              <tr className="border-b border-border text-start text-xs text-muted-foreground">
                <th className="pb-2 font-medium">الأسبوع</th>
                <th className="pb-2 font-medium">زيارات (تقريباً)</th>
                <th className="pb-2 font-medium">مستخدمون جدد</th>
                <th className="pb-2 font-medium">تبرعات مسجّلة</th>
              </tr>
            </thead>
            <tbody>
              {analyticsWeeklyPreviewData.map((row) => (
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
        </div>
      </div>

      <div className="flex min-h-40 flex-col items-center justify-center rounded-xl border border-dashed border-border bg-muted/20 px-6 text-center">
        <div className="flex size-14 items-center justify-center rounded-full bg-primary/10 text-primary">
          <AppIcons.analytics className="size-7" />
        </div>
        <p className="mt-4 text-sm font-medium text-foreground">
          الرسوم البيانية التفاعلية قيد الإعداد
        </p>
        <p className="mt-1 max-w-sm text-xs text-muted-foreground">
          ستضاف لاحقاً رسوم زمنية للمنشورات والحملات والبلاغات حسب الفترة.
        </p>
      </div>
    </section>
  );
}
