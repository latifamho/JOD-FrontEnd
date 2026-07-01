import type { CategoryStatus } from "@/components/pages/categories-management/static-data";

export function getCategoryStatusBadgeClass(status: CategoryStatus): string {
  return status === "active"
    ? "border-success/40 bg-success/10 text-success"
    : "border-muted-foreground/40 bg-muted/40 text-muted-foreground";
}
