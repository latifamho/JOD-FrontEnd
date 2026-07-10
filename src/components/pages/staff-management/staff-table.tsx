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
import { displayOrDash } from "@/lib/text";
import { AppIcons } from "@/constant/icons";
import {
  staffRoleLabels,
  type StaffMemberItem,
} from "@/components/pages/staff-management/static-data";

type StaffTableProps = {
  rows: StaffMemberItem[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
};

export function StaffTable({ rows, onEdit, onDelete }: StaffTableProps) {
  return (
    <div className="rounded-md border border-border bg-card shadow-sm">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead className="text-right font-semibold text-muted-foreground">
              الموظف
            </TableHead>
            <TableHead className="text-right font-semibold text-muted-foreground">
              الدور
            </TableHead>
            <TableHead className="text-right font-semibold text-muted-foreground">
              تاريخ الدعوة
            </TableHead>
            <TableHead className="w-[120px] text-center font-semibold text-muted-foreground">
              إجراءات
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.id}>
              <TableCell className="text-right">
                <p className="font-medium text-foreground">
                  {displayOrDash(row.name)}
                </p>
                <p className="text-xs text-muted-foreground">
                  {displayOrDash(row.email)}
                </p>
              </TableCell>
              <TableCell>
                <Badge variant="outline">{staffRoleLabels[row.role]}</Badge>
              </TableCell>
              <TableCell className="text-right text-xs text-muted-foreground">
                {formatUtcDate(row.invitedAt)}
              </TableCell>
              <TableCell className="text-center">
                <div className="flex items-center justify-center gap-1">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="size-8"
                    title="تعديل دور الموظف"
                    onClick={() => onEdit(row.id)}
                  >
                    <AppIcons.PencilLine className="size-4 text-warning" />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="size-8"
                    title="حذف الموظف"
                    onClick={() => onDelete(row.id)}
                  >
                    <AppIcons.Trash className="size-4 text-destructive" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
