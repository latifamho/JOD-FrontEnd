"use client";

import * as React from "react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { auditLogStaticData } from "@/components/pages/audit-log/audit-log.data";
import { formatUtcDateTime } from "@/lib/date";

export function AuditLogPage() {
  return (
    <section className="flex flex-col flex-1 gap-4">
      <div>
        <h2 className="text-base font-semibold text-foreground">سجل النشاط</h2>
        <p className="mt-0.5 text-xs text-muted-foreground">
          آخر إجراءات تمت على المنصة
        </p>
      </div>
      <div className="rounded-xl border border-border bg-card shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="text-right font-semibold text-muted-foreground">الإجراء</TableHead>
              <TableHead className="text-right font-semibold text-muted-foreground">المستخدم</TableHead>
              <TableHead className="text-right font-semibold text-muted-foreground">التاريخ</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {auditLogStaticData.map((row) => (
              <TableRow key={row.id}>
                <TableCell className="text-right">{row.action}</TableCell>
                <TableCell className="text-right text-sm text-muted-foreground">{row.user}</TableCell>
                <TableCell className="text-right text-xs text-muted-foreground">
                  {formatUtcDateTime(row.at)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </section>
  );
}
