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
import { formatUtcDate } from "@/lib/date";
import { displayOrDash } from "@/lib/text";
import { AppIcons } from "@/constant/icons";
import type { StaffMemberItem } from "@/features/org/staff/org.staff.types";

type StaffTableProps = {
  rows: StaffMemberItem[];
  currentUserId: string | null;
  currentUserEmail: string | null;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
};

export function StaffTable({
  rows,
  currentUserId,
  currentUserEmail,
  onEdit,
  onDelete,
}: StaffTableProps) {
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
            <TableHead className="w-14 text-center font-semibold text-muted-foreground">
              إجراءات
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row) => {
            const canDelete =
              !!onDelete &&
              row.id !== currentUserId &&
              row.email.trim().toLowerCase() !==
                currentUserEmail?.trim().toLowerCase();

            return (
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
                  <Badge variant="outline">{row.role}</Badge>
                </TableCell>
                <TableCell className="text-right text-xs text-muted-foreground">
                  {row.invitedAt ? formatUtcDate(row.invitedAt) : "-"}
                </TableCell>
                <TableCell className="text-center">
                  <TableRowActions
                    actions={[
                      {
                        id: "edit",
                        label: "تعديل دور الموظف",
                        icon: <AppIcons.PencilLine className="size-4" />,
                        onSelect: () => onEdit?.(row.id),
                        hidden: !onEdit,
                      },
                      {
                        id: "delete",
                        label: "حذف الموظف",
                        icon: <AppIcons.Trash className="size-4" />,
                        onSelect: () => onDelete?.(row.id),
                        destructive: true,
                        separatorBefore: true,
                        hidden: !canDelete,
                      },
                    ]}
                  />
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
