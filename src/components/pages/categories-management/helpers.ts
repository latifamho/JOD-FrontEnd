import type { CategoryStatus } from "@/components/pages/categories-management/static-data";

export function createNextCategoryId(existingIds: string[]): string {
  const maxId = existingIds.reduce((maxValue, id) => {
    const match = id.match(/cat-(\d+)/);
    if (!match) {
      return maxValue;
    }

    const value = Number.parseInt(match[1] ?? "0", 10);
    return Number.isFinite(value) ? Math.max(maxValue, value) : maxValue;
  }, 1000);

  return `cat-${String(maxId + 1)}`;
}

export function getCategoryStatusBadgeClass(status: CategoryStatus): string {
  return status === "active"
    ? "border-success/40 bg-success/10 text-success"
    : "border-muted-foreground/40 bg-muted/40 text-muted-foreground";
}
