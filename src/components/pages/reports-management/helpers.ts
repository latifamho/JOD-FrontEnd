import type {
  ReportSeverity,
  ReportStatus,
} from "@/components/pages/reports-management/static-data";

export function getSeverityBadgeClass(severity: ReportSeverity): string {
  if (severity === "critical") {
    return "border-rose-200/70 bg-rose-100 text-rose-800 dark:border-rose-500/40 dark:bg-rose-500/20 dark:text-rose-100";
  }

  if (severity === "high") {
    return "border-orange-200/70 bg-orange-100 text-orange-800 dark:border-orange-500/40 dark:bg-orange-500/20 dark:text-orange-100";
  }

  if (severity === "medium") {
    return "border-amber-200/70 bg-amber-100 text-amber-800 dark:border-amber-500/40 dark:bg-amber-500/20 dark:text-amber-100";
  }

  return "border-emerald-200/70 bg-emerald-100 text-emerald-800 dark:border-emerald-500/40 dark:bg-emerald-500/20 dark:text-emerald-100";
}

export function getStatusBadgeClass(status: ReportStatus): string {
  if (status === "new") {
    return "border-sky-200/70 bg-sky-100 text-sky-800 dark:border-sky-500/40 dark:bg-sky-500/20 dark:text-sky-100";
  }

  if (status === "in_progress") {
    return "border-violet-200/70 bg-violet-100 text-violet-800 dark:border-violet-500/40 dark:bg-violet-500/20 dark:text-violet-100";
  }

  if (status === "waiting_response") {
    return "border-amber-200/70 bg-amber-100 text-amber-800 dark:border-amber-500/40 dark:bg-amber-500/20 dark:text-amber-100";
  }

  return "border-emerald-200/70 bg-emerald-100 text-emerald-800 dark:border-emerald-500/40 dark:bg-emerald-500/20 dark:text-emerald-100";
}
