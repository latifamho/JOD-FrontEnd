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
import { formatUtcDate } from "@/lib/date";
import { AppIcons } from "@/constant/icons";
import {
  categoryStatusLabels,
  categoryTargetLabels,
  type AdminCategoryItem,
} from "@/components/pages/categories-management/static-data";
import { getCategoryStatusBadgeClass } from "@/components/pages/categories-management/helpers";

const SKELETON_ROW_COUNT = 5;

function SkeletonPulse({ className }: { className: string }) {
  return <div className={`animate-pulse rounded bg-muted ${className}`} />;
}

type CategoriesTableProps = {
  rows: AdminCategoryItem[];
  isLoading: boolean;
  loadingRowIds: Set<string>;
  onEditCategory: (categoryId: string) => void;
  onToggleCategoryStatus: (categoryId: string) => void;
  onDeleteCategory: (categoryId: string) => void;
};

export function CategoriesTable({
  rows,
  isLoading,
  loadingRowIds,
  onEditCategory,
  onToggleCategoryStatus,
  onDeleteCategory,
}: CategoriesTableProps) {
  return (
    <div className="overflow-auto flex flex-1 rounded-md border border-border shadow-xs">
      <Table className="min-w-210 bg-background">
        <TableHeader className="bg-muted/35">
          <TableRow>
            <TableHead className="font-semibold text-muted-foreground">التصنيف</TableHead>
            <TableHead className="font-semibold text-muted-foreground">النوع</TableHead>
            <TableHead className="font-semibold text-muted-foreground">الوصف</TableHead>
            <TableHead className="font-semibold text-muted-foreground">الاستخدام</TableHead>
            <TableHead className="font-semibold text-muted-foreground">الحالة</TableHead>
            <TableHead className="font-semibold text-muted-foreground">آخر تحديث</TableHead>
            <TableHead className="w-[120px] font-semibold text-muted-foreground">إجراءات</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {isLoading ? (
            Array.from({ length: SKELETON_ROW_COUNT }).map((_, i) => (
              <TableRow key={i}>
                <TableCell>
                  <SkeletonPulse className="h-3.5 w-28 mb-1.5" />
                  <SkeletonPulse className="h-3 w-16" />
                </TableCell>
                <TableCell><SkeletonPulse className="h-5 w-20 rounded-full" /></TableCell>
                <TableCell><SkeletonPulse className="h-3 w-48" /></TableCell>
                <TableCell><SkeletonPulse className="h-3 w-12" /></TableCell>
                <TableCell><SkeletonPulse className="h-5 w-16 rounded-full" /></TableCell>
                <TableCell><SkeletonPulse className="h-3 w-24" /></TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: 3 }).map((_, j) => (
                      <SkeletonPulse key={j} className="h-8 w-8 rounded-md" />
                    ))}
                  </div>
                </TableCell>
              </TableRow>
            ))
          ) : rows.length > 0 ? (
            rows.map((row) => {
              const isRowLoading = loadingRowIds.has(row.id);
              return (
                <TableRow key={row.id} className="align-middle">
                  <TableCell>
                    <p className="font-medium text-foreground">{row.name}</p>
                    <p className="text-xs text-muted-foreground">{row.id}</p>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{categoryTargetLabels[row.target]}</Badge>
                  </TableCell>
                  <TableCell className="max-w-[280px] text-sm text-muted-foreground">
                    {row.description}
                  </TableCell>
                  <TableCell className="text-sm">{row.usageCount} عنصر</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={getCategoryStatusBadgeClass(row.status)}>
                      {categoryStatusLabels[row.status]}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {formatUtcDate(row.updatedAt)}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        title="تعديل التصنيف"
                        className="size-8 shadow-sm"
                        disabled={isRowLoading}
                        onClick={() => onEditCategory(row.id)}
                      >
                        {isRowLoading ? (
                          <Loader2 className="size-4 animate-spin text-muted-foreground" />
                        ) : (
                          <AppIcons.PencilLine className="size-4 text-info" />
                        )}
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="size-8 shadow-sm"
                        title={row.status === "active" ? "إيقاف التصنيف" : "تفعيل التصنيف"}
                        disabled={isRowLoading}
                        onClick={() => onToggleCategoryStatus(row.id)}
                      >
                        {row.status === "active" ? (
                          <AppIcons.ShieldOff className="size-4 text-warning" />
                        ) : (
                          <AppIcons.ShieldCheck className="size-4 text-success" />
                        )}
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        title="حذف التصنيف"
                        className="size-8 shadow-sm"
                        disabled={isRowLoading}
                        onClick={() => onDeleteCategory(row.id)}
                      >
                        <AppIcons.Trash className="size-4 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })
          ) : (
            <TableRow>
              <TableCell
                colSpan={7}
                className="py-10 text-center text-sm text-muted-foreground"
              >
                لا توجد تصنيفات للعرض.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
