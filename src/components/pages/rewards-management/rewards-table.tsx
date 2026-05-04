"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatUtcDate } from "@/lib/date";
import { AppIcons } from "@/constant/icons";
import { getRewardStatusBadgeClass } from "@/components/pages/rewards-management/helpers";
import { rewardStatusLabels } from "@/components/pages/rewards-management/static-data";
import type { BadgeItem } from "@/components/pages/rewards-management/static-data";

type RewardsTableProps = {
  rows: BadgeItem[];
  onEditReward: (rewardId: string) => void;
  onToggleRewardStatus: (rewardId: string) => void;
};

export function RewardsTable({
  rows,
  onEditReward,
  onToggleRewardStatus,
}: RewardsTableProps) {
  return (
    <div className="overflow-auto flex flex-1 rounded-md border border-border shadow-xs">
      <Table className="min-w-255 bg-background">
        <TableHeader className="bg-muted/35">
          <TableRow>
            <TableHead className="font-semibold text-muted-foreground">
              الشارة
            </TableHead>
            <TableHead className="font-semibold text-muted-foreground">
              الأيقونة
            </TableHead>
            <TableHead className="font-semibold text-muted-foreground">
              الوصف
            </TableHead>
            <TableHead className="font-semibold text-muted-foreground">
              المعايير
            </TableHead>
            <TableHead className="font-semibold text-muted-foreground">
              الحالة
            </TableHead>
            <TableHead className="font-semibold text-muted-foreground">
              التاريخ
            </TableHead>
            <TableHead className="w-[120px] font-semibold text-muted-foreground">
              إجراءات
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row) => {
            const RewardIcon = AppIcons[row.iconName];

            return (
              <TableRow key={row.id} className="align-middle">
                <TableCell>
                  <p className="font-medium text-foreground">{row.name}</p>
                  <p className="text-xs text-muted-foreground">{row.id}</p>
                </TableCell>
                <TableCell>
                  <div className="inline-flex size-9 items-center justify-center rounded-md border border-border bg-muted/30 text-muted-foreground">
                    <RewardIcon className="size-4" />
                  </div>
                </TableCell>
                <TableCell className="max-w-[260px] text-sm text-muted-foreground">
                  {row.description}
                </TableCell>
                <TableCell className="text-sm">{row.criteria}</TableCell>
                <TableCell>
                  <Badge variant="outline" className={getRewardStatusBadgeClass(row.isActive)}>
                    {rewardStatusLabels[row.isActive ? "active" : "inactive"]}
                  </Badge>
                </TableCell>
                <TableCell className="text-xs text-muted-foreground">
                  {formatUtcDate(row.createdAt)}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      title="تعديل الشارة"
                      className="size-8 shadow-sm"
                      onClick={() => onEditReward(row.id)}
                    >
                      <AppIcons.PencilLine className="size-4 text-info" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="size-8 shadow-sm"
                      title={row.isActive ? "تعطيل الشارة" : "تفعيل الشارة"}
                      onClick={() => onToggleRewardStatus(row.id)}
                    >
                      {row.isActive ? (
                        <AppIcons.ShieldOff className="size-4 text-warning" />
                      ) : (
                        <AppIcons.ShieldCheck className="size-4 text-success" />
                      )}
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
