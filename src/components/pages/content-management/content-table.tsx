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
import { formatUtcDateOrDash } from "@/lib/date";
import { displayOrDash } from "@/lib/text";
import { AppIcons } from "@/constant/icons";
import { getArticleStatusBadgeClass } from "@/components/pages/content-management/helpers";
import {
  articleStatusLabels,
  type ArticleItem,
} from "@/components/pages/content-management/content-management.types";

type ContentTableProps = {
  rows: ArticleItem[];
  onEdit: (id: string) => void;
};

export function ContentTable({ rows, onEdit }: ContentTableProps) {
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
            <TableHead className="w-[100px] text-center font-semibold text-muted-foreground">
              إجراءات
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.id}>
              <TableCell className="text-right">
                <p className="font-medium text-foreground">{displayOrDash(row.title)}</p>
                <p className="text-xs text-muted-foreground">/{displayOrDash(row.slug)}</p>
              </TableCell>
              <TableCell className="max-w-[240px] text-right text-sm text-muted-foreground line-clamp-2">
                {displayOrDash(row.excerpt)}
              </TableCell>
              <TableCell>
                <Badge variant="outline" className={getArticleStatusBadgeClass(row.status)}>
                  {articleStatusLabels[row.status]}
                </Badge>
              </TableCell>
              <TableCell className="text-right text-xs text-muted-foreground">
                {row.publishedAt
                  ? formatUtcDateOrDash(row.publishedAt)
                  : formatUtcDateOrDash(row.createdAt)}
              </TableCell>
              <TableCell className="text-center">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="size-8"
                  onClick={() => onEdit(row.id)}
                >
                  <AppIcons.PencilLine className="size-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
