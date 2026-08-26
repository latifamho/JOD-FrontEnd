"use client";

import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TableRowActions } from "@/components/shared";
import { formatUtcDateOrDash } from "@/lib/date";
import { displayOrDash } from "@/lib/text";
import { AppIcons } from "@/constant/icons";
import {
  categoryStatusLabels,
  type AdminCategoryItem,
} from "@/components/pages/categories-management/categories-management.types";
import { getCategoryStatusBadgeClass } from "@/components/pages/categories-management/helpers";

const SKELETON_ROW_COUNT = 5;

function SkeletonPulse({ className }: { className: string }) {
  return <div className={`animate-pulse rounded bg-muted ${className}`} />;
}

type CategoriesTableProps = {
  rows: AdminCategoryItem[];
  isLoading: boolean;
  togglingRowIds: Set<string>;
  onEditCategory: (categoryId: string) => void;
  onToggleCategoryStatus: (categoryId: string) => void;
  onDeleteCategory: (categoryId: string) => void;
};

export function CategoriesTable({
  rows,
  isLoading,
  togglingRowIds,
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
            <TableHead className="font-semibold text-muted-foreground">الوصف</TableHead>
            <TableHead className="font-semibold text-muted-foreground">الاستخدام</TableHead>
            <TableHead className="font-semibold text-muted-foreground">الحالة</TableHead>
            <TableHead className="font-semibold text-muted-foreground">آخر تحديث</TableHead>
            <TableHead className="w-14 font-semibold text-muted-foreground">إجراءات</TableHead>
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
                <TableCell><SkeletonPulse className="h-3 w-48" /></TableCell>
                <TableCell><SkeletonPulse className="h-3 w-12" /></TableCell>
                <TableCell><SkeletonPulse className="h-5 w-16 rounded-full" /></TableCell>
                <TableCell><SkeletonPulse className="h-3 w-24" /></TableCell>
                <TableCell>
                  <SkeletonPulse className="h-8 w-8 rounded-md" />
                </TableCell>
              </TableRow>
            ))
          ) : rows.length > 0 ? (
            rows.map((row) => {
              const isToggling = togglingRowIds.has(row.id);
              return (
                <TableRow key={row.id} className="align-middle">
                  <TableCell>
                    <p className="font-medium text-foreground">{displayOrDash(row.name)}</p>

                  </TableCell>
                  <TableCell className="max-w-[280px] text-sm text-muted-foreground">
                    {displayOrDash(row.description)}
                  </TableCell>
                  <TableCell className="text-sm">{row.usageCount} عنصر</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={getCategoryStatusBadgeClass(row.status)}>
                      {categoryStatusLabels[row.status]}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {formatUtcDateOrDash(row.updatedAt)}
                  </TableCell>
                  <TableCell>
                    <TableRowActions
                      loading={isToggling}
                      actions={[
                        {
                          id: "edit",
                          label: "تعديل التصنيف",
                          icon: <AppIcons.PencilLine className="size-4" />,
                          onSelect: () => onEditCategory(row.id),
                        },
                        {
                          id: "toggle",
                          label:
                            row.status === "active"
                              ? "إيقاف التصنيف"
                              : "تفعيل التصنيف",
                          icon:
                            row.status === "active" ? (
                              <AppIcons.ShieldOff className="size-4" />
                            ) : (
                              <AppIcons.ShieldCheck className="size-4" />
                            ),
                          onSelect: () => onToggleCategoryStatus(row.id),
                        },
                        {
                          id: "delete",
                          label: "حذف التصنيف",
                          icon: <AppIcons.Trash className="size-4" />,
                          onSelect: () => onDeleteCategory(row.id),
                          destructive: true,
                          separatorBefore: true,
                        },
                      ]}
                    />
                  </TableCell>
                </TableRow>
              );
            })
          ) : (
            <TableRow>
              <TableCell
                colSpan={6}
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
