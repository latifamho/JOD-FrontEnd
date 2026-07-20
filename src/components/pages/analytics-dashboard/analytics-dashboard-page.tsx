"use client";

import { AppIcons } from "@/constant/icons";
import { displayOrDash } from "@/lib/text";
import {
  useAdminAnalyticsKpis,
  useAdminAnalyticsWeekly,
} from "@/features/admin/analytics/admin.analytics.query";

const ANALYTICS_RANGE = { range: "30d" } as const;

export function AnalyticsDashboardPage() {
  const {
    data: kpisData,
    isLoading: isKpisLoading,
    error: kpisError,
  } = useAdminAnalyticsKpis(ANALYTICS_RANGE);
  const {
    data: weeklyData,
    isLoading: isWeeklyLoading,
    error: weeklyError,
  } = useAdminAnalyticsWeekly(ANALYTICS_RANGE);

  const kpis = kpisData?.data.kpis ?? [];
  const weeklyRows = weeklyData?.data.rows ?? [];

  return (
    <section className="flex flex-col flex-1 gap-6">
      <div>
        <h2 className="text-lg font-semibold text-foreground">
          التحليلات والإحصائيات
        </h2>
        <p className="mt-0.5 text-sm text-muted-foreground">
          مؤشرات ورسوم أداء المنصة خلال آخر 30 يوماً
        </p>
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
          زيارات وتسجيلات وتبرعات لكل أسبوع
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
                  <th className="pb-2 font-medium">زيارات</th>
                  <th className="pb-2 font-medium">مستخدمون جدد</th>
                  <th className="pb-2 font-medium">تبرعات مسجّلة</th>
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
