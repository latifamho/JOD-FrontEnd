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
import { AppIcons } from "@/constant/icons";
import { formatUtcDate } from "@/lib/date";
import { displayOrDash } from "@/lib/text";
import type { StaffRoleItem } from "@/features/org/staff/org.staff.types";

export type StaffRoleRow = StaffRoleItem & {
  membersCount: number;
};

type RolesTableProps = {
  rows: StaffRoleRow[];
  onEditRole: (id: string) => void;
  onDeleteRole: (id: string) => void;
};

const statusLabels = {
  active: "مفعّل",
  inactive: "موقّف",
} as const;

function statusVariant(isActive: boolean): "default" | "secondary" {
  return isActive ? "default" : "secondary";
}

export function RolesTable({
  rows,
  onEditRole,
  onDeleteRole,
}: RolesTableProps) {
  return (
    <div className="rounded-md border border-border bg-card shadow-sm">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead className="text-right font-semibold text-muted-foreground">
              الدور
            </TableHead>
            <TableHead className="text-right font-semibold text-muted-foreground">
              الوصف
            </TableHead>
            <TableHead className="text-right font-semibold text-muted-foreground">
              الصلاحيات
            </TableHead>
            <TableHead className="text-right font-semibold text-muted-foreground">
              الموظفون
            </TableHead>
            <TableHead className="text-right font-semibold text-muted-foreground">
              آخر تحديث
            </TableHead>
            <TableHead className="text-right font-semibold text-muted-foreground">
              الحالة
            </TableHead>
            <TableHead className="w-[170px] text-center font-semibold text-muted-foreground">
              إجراءات
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {rows.map((row) => {
            const canDelete = !row.isSystem;

            return (
              <TableRow key={row.id}>
                <TableCell className="text-right">
                  <Badge variant="outline">{row.role}</Badge>
                </TableCell>
                <TableCell className="max-w-[280px] text-right text-xs text-muted-foreground">
                  {displayOrDash(row.description)}
                </TableCell>
                <TableCell className="text-right text-sm">
                  {row.permissions.length} صلاحية
                </TableCell>
                <TableCell className="text-right text-sm">
                  {row.membersCount} موظف
                </TableCell>
                <TableCell className="text-right text-xs text-muted-foreground">
                  {row.updatedAt ? formatUtcDate(row.updatedAt) : "-"}
                </TableCell>
                <TableCell className="text-right">
                  <Badge variant={statusVariant(row.isActive)}>
                    {row.isActive ? statusLabels.active : statusLabels.inactive}
                  </Badge>
                </TableCell>
                <TableCell className="text-center">
                  <div className="flex items-center justify-center gap-1">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="size-8"
                      title="تعديل صلاحيات الدور"
                      onClick={() => onEditRole(row.id)}
                    >
                      <AppIcons.PencilLine className="size-4" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="size-8"
                      title={canDelete ? "حذف الدور" : "دور أساسي لا يمكن حذفه"}
                      disabled={!canDelete}
                      onClick={() => onDeleteRole(row.id)}
                    >
                      <AppIcons.Trash className="size-4 text-destructive" />
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

