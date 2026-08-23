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
import { formatUtcDateOrDash } from "@/lib/date";
import { displayOrDash } from "@/lib/text";
import {
  applicantStatusLabels,
  type DonorEntryItem,
} from "@/components/pages/donors-management/static-data";

type DonorsTableProps = {
  rows: DonorEntryItem[];
  view?: "donors" | "applicants";
  onEditRow?: (row: DonorEntryItem) => void;
  onDeleteRow?: (row: DonorEntryItem) => void;
};

export function DonorsTable({ rows, view = "donors", onEditRow, onDeleteRow }: DonorsTableProps) {
  const isApplicants = view === "applicants";

  return (
    <div className="flex-1 rounded-md border border-border bg-card shadow-sm">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead className="text-right font-semibold text-muted-foreground">{isApplicants ? "المتقدم" : "المتبرع"}</TableHead>
            {isApplicants ? (
              <>
                <TableHead className="text-right font-semibold text-muted-foreground">اسم الحملة</TableHead>
                <TableHead className="text-right font-semibold text-muted-foreground">الحالة</TableHead>
                <TableHead className="text-right font-semibold text-muted-foreground">تاريخ التقديم</TableHead>
              </>
            ) : (
              <>
                <TableHead className="text-right font-semibold text-muted-foreground">رقم الهاتف</TableHead>
                <TableHead className="text-right font-semibold text-muted-foreground">المحافظة</TableHead>
              </>
            )}
            <TableHead className="w-14 text-right font-semibold text-muted-foreground">إجراءات</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.id}>
              <TableCell className="text-right">
                <p className="font-medium text-foreground">{displayOrDash(row.name)}</p>
                <p className="text-xs text-muted-foreground" dir="ltr">
                  {isApplicants ? displayOrDash(row.phone) : displayOrDash(row.email)}
                </p>
              </TableCell>
              {isApplicants ? (
                <>
                  <TableCell className="text-right text-sm">{displayOrDash(row.campaignTitle)}</TableCell>
                  <TableCell className="text-right text-sm">{row.applicantStatus ? applicantStatusLabels[row.applicantStatus] ?? row.applicantStatus : "—"}</TableCell>
                  <TableCell className="text-right text-xs text-muted-foreground">{formatUtcDateOrDash(row.appliedAt)}</TableCell>
                </>
              ) : (
                <>
                  <TableCell className="text-right text-sm" dir="ltr">{displayOrDash(row.phone)}</TableCell>
                  <TableCell className="text-right text-sm">{displayOrDash(row.city)}</TableCell>
                </>
              )}
              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-1">
                  {onEditRow ? (
                    <Button type="button" size="icon" variant="ghost" title="تعديل" className="shadow-sm" onClick={() => onEditRow(row)}>
                      <AppIcons.PencilLine className="size-4 text-warning" />
                    </Button>
                  ) : null}
                  {onDeleteRow ? (
                    <Button type="button" size="icon" variant="ghost" title="حذف" className="shadow-sm" onClick={() => onDeleteRow(row)}>
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
