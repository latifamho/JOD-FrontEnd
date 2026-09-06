"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TableRowActions } from "@/components/shared";
import { Badge } from "@/components/ui/badge";
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
            <TableHead className="w-12 text-right font-semibold text-muted-foreground">#</TableHead>
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
          {rows.map((row, index) => (
            <TableRow key={row.id}>
              <TableCell className="text-right text-sm text-muted-foreground">{index + 1}</TableCell>
              <TableCell className="text-right">
                <div className="flex flex-wrap items-center gap-1.5">
                  <p className="font-medium text-foreground">{displayOrDash(row.name)}</p>
                  {row.isAnonymous ? (
                    <Badge variant="secondary" title="اختار المتبرع عدم إظهار هويته علنًا.">
                      مجهول علنًا
                    </Badge>
                  ) : null}
                </div>
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
                <TableRowActions
                  actions={[
                    {
                      id: "edit",
                      label: "تعديل",
                      icon: <AppIcons.PencilLine className="size-4" />,
                      onSelect: () => onEditRow?.(row),
                      hidden: !onEditRow,
                    },
                    {
                      id: "delete",
                      label: "حذف",
                      icon: <AppIcons.Trash className="size-4" />,
                      onSelect: () => onDeleteRow?.(row),
                      destructive: true,
                      separatorBefore: true,
                      hidden: !onDeleteRow,
                    },
                  ]}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
