import type { BadgeItem } from "@/components/pages/rewards-management/static-data";

export function createNextBadgeId(badges: BadgeItem[]): string {
  const maxId = badges.reduce((currentMax, badge) => {
    const numericPart = Number.parseInt(badge.id.replace(/\D/g, ""), 10);
    if (Number.isNaN(numericPart)) {
      return currentMax;
    }
    return Math.max(currentMax, numericPart);
  }, 0);

  return `BDG-${String(maxId + 1).padStart(3, "0")}`;
}

export function getRewardStatusBadgeClass(isActive: boolean): string {
  if (isActive) {
    return "border-emerald-200/70 bg-emerald-100 text-emerald-800 dark:border-emerald-500/40 dark:bg-emerald-500/20 dark:text-emerald-100";
  }

  return "border-slate-200/70 bg-slate-100 text-slate-800 dark:border-slate-500/40 dark:bg-slate-500/20 dark:text-slate-100";
}
