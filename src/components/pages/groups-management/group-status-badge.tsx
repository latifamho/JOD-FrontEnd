import { Badge } from "@/components/ui/badge";
import { AppIcons } from "@/constant/icons";
import { cn } from "@/lib/utils";
import {
  groupStatusLabels,
  type AdminGroupStatus,
} from "@/components/pages/groups-management/groups-management.types";

const statusConfig: Record<
  AdminGroupStatus,
  { icon: keyof typeof AppIcons; className: string }
> = {
  pending: {
    icon: "verification",
    className:
      "border-amber-200/70 bg-amber-100 text-amber-800 dark:border-amber-500/40 dark:bg-amber-500/20 dark:text-amber-100",
  },
  active: {
    icon: "ShieldCheck",
    className:
      "border-emerald-200/70 bg-emerald-100 text-emerald-800 dark:border-emerald-500/40 dark:bg-emerald-500/20 dark:text-emerald-100",
  },
  rejected: {
    icon: "reports",
    className:
      "border-rose-200/70 bg-rose-100 text-rose-800 dark:border-rose-500/40 dark:bg-rose-500/20 dark:text-rose-100",
  },
};

export function GroupStatusBadge({ status }: { status: AdminGroupStatus }) {
  const config = statusConfig[status];
  const Icon = AppIcons[config.icon];

  return (
    <Badge variant="outline" className={cn("gap-1.5 text-[11px]", config.className)}>
      <Icon className="size-3.5" />
      {groupStatusLabels[status]}
    </Badge>
  );
}
