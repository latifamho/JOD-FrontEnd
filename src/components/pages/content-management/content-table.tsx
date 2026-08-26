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
import { getArticleStatusBadgeClass } from "@/components/pages/content-management/helpers";
import {
  articleStatusLabels,
  type ArticleItem,
} from "@/components/pages/content-management/content-management.types";

const SKELETON_ROW_COUNT = 5;

function SkeletonPulse({ className }: { className: string }) {
  return <div className={`animate-pulse rounded bg-muted ${className}`} />;
}

type ContentTableProps = {
  rows: ArticleItem[];
  isLoading?: boolean;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
};

export function ContentTable({
  rows,
  isLoading = false,
  onEdit,
  onDelete,
}: ContentTableProps) {
  return (
    <div className="rounded-md border border-border bg-card shadow-sm">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead className="text-right font-semibold text-muted-foreground">
              العنوان
            </TableHead>
            <TableHead className="text-right font-semibold text-muted-foreground">
              الملخص
            </TableHead>
            <TableHead className="text-right font-semibold text-muted-foreground">
              الحالة
            </TableHead>
            <TableHead className="text-right font-semibold text-muted-foreground">
              التاريخ
            </TableHead>
            <TableHead className="w-14 text-center font-semibold text-muted-foreground">
              إجراءات
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            Array.from({ length: SKELETON_ROW_COUNT }).map((_, i) => (
              <TableRow key={i}>
                <TableCell>
                  <SkeletonPulse className="mb-1.5 h-3.5 w-40" />
                  <SkeletonPulse className="h-3 w-24" />
                </TableCell>
                <TableCell>
                  <SkeletonPulse className="h-3 w-56" />
                </TableCell>
                <TableCell>
                  <SkeletonPulse className="h-5 w-16 rounded-full" />
                </TableCell>
                <TableCell>
                  <SkeletonPulse className="h-3 w-24" />
                </TableCell>
                <TableCell>
                  <div className="flex justify-center">
                    <SkeletonPulse className="h-8 w-8 rounded-md" />
                  </div>
                </TableCell>
              </TableRow>
            ))
          ) : (
            rows.map((row) => (
              <TableRow key={row.id}>
                <TableCell className="text-right">
                  <p className="font-medium text-foreground">
                    {displayOrDash(row.title)}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    /{displayOrDash(row.slug)}
                  </p>
                </TableCell>
                <TableCell className="max-w-[240px] text-right text-sm text-muted-foreground line-clamp-2">
                  {displayOrDash(row.excerpt)}
                </TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className={getArticleStatusBadgeClass(row.status)}
                  >
                    {articleStatusLabels[row.status]}
                  </Badge>
                </TableCell>
                <TableCell className="text-right text-xs text-muted-foreground">
                  {row.publishedAt
                    ? formatUtcDateOrDash(row.publishedAt)
                    : formatUtcDateOrDash(row.createdAt)}
                </TableCell>
                <TableCell className="text-center">
                  <TableRowActions
                    actions={[
                      {
                        id: "edit",
                        label: "تعديل",
                        icon: <AppIcons.PencilLine className="size-4" />,
                        onSelect: () => onEdit(row.id),
                      },
                      {
                        id: "delete",
                        label: "حذف",
                        icon: <AppIcons.Trash className="size-4" />,
                        onSelect: () => onDelete(row.id),
                        destructive: true,
                        separatorBefore: true,
                      },
                    ]}
                  />
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
