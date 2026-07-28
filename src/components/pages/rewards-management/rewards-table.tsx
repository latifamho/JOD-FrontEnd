"use client";

import { Loader2 } from "lucide-react";

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
import { formatUtcDateOrDash } from "@/lib/date";
import { displayOrDash } from "@/lib/text";
import { AppIcons } from "@/constant/icons";
import { getRewardStatusBadgeClass } from "@/components/pages/rewards-management/helpers";
import { rewardStatusLabels } from "@/components/pages/rewards-management/rewards-management.types";
import type { BadgeItem } from "@/components/pages/rewards-management/rewards-management.types";
import { normalizeRewardIconName } from "@/components/pages/rewards-management/reward-form-sheet";

const SKELETON_ROW_COUNT = 5;

function SkeletonPulse({ className }: { className: string }) {
  return <div className={`animate-pulse rounded bg-muted ${className}`} />;
}

type RewardsTableProps = {
  rows: BadgeItem[];
  isLoading?: boolean;
  loadingRowIds?: Set<string>;
  onEditReward: (rewardId: string) => void;
  onToggleRewardStatus: (rewardId: string) => void;
  onDeleteReward: (rewardId: string) => void;
};

export function RewardsTable({
  rows,
  isLoading = false,
  loadingRowIds = new Set(),
  onEditReward,
  onToggleRewardStatus,
  onDeleteReward,
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
          {isLoading ? (
            Array.from({ length: SKELETON_ROW_COUNT }).map((_, i) => (
              <TableRow key={i}>
                <TableCell>
                  <SkeletonPulse className="mb-1.5 h-3.5 w-28" />
                  <SkeletonPulse className="h-3 w-16" />
                </TableCell>
                <TableCell>
                  <SkeletonPulse className="h-9 w-9 rounded-md" />
                </TableCell>
                <TableCell>
                  <SkeletonPulse className="h-3 w-48" />
                </TableCell>
                <TableCell>
                  <SkeletonPulse className="h-3 w-32" />
                </TableCell>
                <TableCell>
                  <SkeletonPulse className="h-5 w-16 rounded-full" />
                </TableCell>
                <TableCell>
                  <SkeletonPulse className="h-3 w-24" />
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <SkeletonPulse className="h-8 w-8 rounded-md" />
                    <SkeletonPulse className="h-8 w-8 rounded-md" />
                  </div>
                </TableCell>
              </TableRow>
            ))
          ) : (
            rows.map((row) => {
              const RewardIcon =
                AppIcons[normalizeRewardIconName(row.iconName)];
              const isRowLoading = loadingRowIds.has(row.id);

              return (
                <TableRow key={row.id} className="align-middle">
                  <TableCell>
                    <p className="font-medium text-foreground">
                      {displayOrDash(row.name)}
                    </p>
                    <p className="text-xs text-muted-foreground">{row.id}</p>
                  </TableCell>
                  <TableCell>
                    <div className="inline-flex size-9 items-center justify-center rounded-md border border-border bg-muted/30 text-muted-foreground">
                      <RewardIcon className="size-4" />
                    </div>
                  </TableCell>
                  <TableCell className="max-w-[260px] text-sm text-muted-foreground">
                    {displayOrDash(row.description)}
                  </TableCell>
                  <TableCell className="text-sm">
                    {displayOrDash(row.criteria)}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={getRewardStatusBadgeClass(row.isActive)}
                    >
                      {rewardStatusLabels[row.isActive ? "active" : "inactive"]}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {formatUtcDateOrDash(row.createdAt)}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        title="تعديل الشارة"
                        className="size-8 shadow-sm"
                        disabled={isRowLoading}
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
                        disabled={isRowLoading}
                        onClick={() => onToggleRewardStatus(row.id)}
                      >
                        {isRowLoading ? (
                          <Loader2 className="size-4 animate-spin text-muted-foreground" />
                        ) : row.isActive ? (
                          <AppIcons.ShieldOff className="size-4 text-warning" />
                        ) : (
                          <AppIcons.ShieldCheck className="size-4 text-success" />
                        )}
                      </Button>
                    </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="size-8 shadow-sm"
                        title="حذف الشارة"
                        disabled={isRowLoading}
                        onClick={() => onDeleteReward(row.id)}
                      >
                        <AppIcons.Trash className="size-4 text-destructive" />
                      </Button>
                  </TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
    </div>
  );
}
