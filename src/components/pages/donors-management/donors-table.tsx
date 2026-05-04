"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { AppIcons } from "@/constant/icons";
import { formatUtcDate } from "@/lib/date";
import type { DonorEntryItem } from "@/components/pages/donors-management/static-data";

type DonorsTableProps = {
  rows: DonorEntryItem[];
  view?: "donors" | "applicants";
  onEditRow?: (row: DonorEntryItem) => void;
  onDeleteRow?: (row: DonorEntryItem) => void;
};

export function DonorsTable({
  rows,
  view = "donors",
  onEditRow,
  onDeleteRow,
}: DonorsTableProps) {
  const isApplicants = view === "applicants";
  const colPerson = isApplicants ? "المتقدم" : "المتبرع";
  const colAmountOrStatus = isApplicants ? "الحالة" : "المبلغ / النوع";
  const colDate = isApplicants ? "تاريخ التقديم" : "تاريخ التبرع";

  return (
    <div className="flex-1 rounded-md border border-border bg-card shadow-sm">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead className="text-right font-semibold text-muted-foreground">
              {colPerson}
            </TableHead>
            <TableHead className="text-right font-semibold text-muted-foreground">
              الحملة
            </TableHead>
            <TableHead className="text-right font-semibold text-muted-foreground">
              {colAmountOrStatus}
            </TableHead>
            <TableHead className="text-right font-semibold text-muted-foreground">
              {colDate}
            </TableHead>
            <TableHead className="w-14 text-right font-semibold text-muted-foreground">
              إجراءات
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.id}>
              <TableCell className="text-right">
                <p className="font-medium text-foreground">{row.name}</p>
                <p className="text-xs text-muted-foreground">{row.email}</p>
              </TableCell>
              <TableCell className="text-right text-sm">
                {row.campaignTitle}
              </TableCell>
              <TableCell className="text-right text-sm">
                {row.amountOrType}
              </TableCell>
              <TableCell className="text-right text-xs text-muted-foreground">
                {formatUtcDate(row.donatedAt)}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-1">
                  {onEditRow ? (
                    <Button
                      type="button"
                      size="icon"
                      variant="ghost"
                      title="تعديل"
                      className="shadow-sm"
                      onClick={() => onEditRow(row)}
                    >
                      <AppIcons.PencilLine className="size-4 text-warning" />
                    </Button>
                  ) : null}
                  {onDeleteRow ? (
                    <Button
                      type="button"
                      size="icon"
                      variant="ghost"
                      title="حذف"
                      className="shadow-sm"
                      onClick={() => onDeleteRow(row)}
                    >
                      <AppIcons.Trash className="size-4 text-destructive" />
                    </Button>
                  ) : null}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
