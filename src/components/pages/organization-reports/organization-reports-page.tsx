"use client";

import * as React from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatUtcDateTime } from "@/lib/date";
import {
  getOrgReportStatusBadgeClass,
  orgReportCategoryLabels,
  orgReportStatusLabels,
  organizationReportsStaticData,
  type OrgReportItem,
} from "@/components/pages/organization-reports/static-data";

export function OrganizationReportsPage() {
  const [rows] = React.useState<OrgReportItem[]>(organizationReportsStaticData);
  const [openId, setOpenId] = React.useState<string | null>(null);

  const selected = React.useMemo(
    () => rows.find((r) => r.id === openId) ?? null,
    [rows, openId],
  );

  return (
    <section className="flex flex-col flex-1 gap-4">
      <div>
        <h2 className="text-base font-semibold text-foreground">البلاغات</h2>
        <p className="mt-0.5 text-xs text-muted-foreground">
          بلاغات وردت عن المحتوى أو السلوك المرتبط بحساب منظمتكم. {rows.length}{" "}
          سجل
        </p>
      </div>

      <div className="overflow-auto flex flex-1 rounded-md border border-border shadow-xs">
        <Table className="min-w-[min(100%,880px)] bg-background">
          <TableHeader className="bg-muted/35">
            <TableRow>
              <TableHead>البلاغ</TableHead>
              <TableHead>التصنيف</TableHead>
              <TableHead>الحالة</TableHead>
              <TableHead>المرسل</TableHead>
              <TableHead>التاريخ</TableHead>
              <TableHead className="w-28">إجراء</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.id}>
                <TableCell>
                  <p className="font-semibold text-foreground">{row.subject}</p>
                  <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
                    {row.summary}
                  </p>
                  <p className="mt-1 text-[11px] text-muted-foreground">
                    {row.id}
                  </p>
                </TableCell>
                <TableCell>
                  <Badge variant="outline">
                    {orgReportCategoryLabels[row.category]}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className={getOrgReportStatusBadgeClass(row.status)}
                  >
                    {orgReportStatusLabels[row.status]}
                  </Badge>
                </TableCell>
                <TableCell className="text-xs text-foreground">
                  {row.reporterLabel}
                </TableCell>
                <TableCell className="whitespace-nowrap text-xs text-muted-foreground">
                  {formatUtcDateTime(row.submittedAt)}
                </TableCell>
                <TableCell>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="h-8 text-xs"
                    onClick={() => setOpenId(row.id)}
                  >
                    التفاصيل
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Sheet open={openId !== null} onOpenChange={(o) => !o && setOpenId(null)}>
        <SheetContent side="right" dir="rtl" className="sm:max-w-md">
          <SheetHeader>
            <SheetTitle>{selected?.subject}</SheetTitle>
            <SheetDescription asChild>
              <div className="space-y-3 pt-2 text-start">
                {selected ? (
                  <>
                    <p className="text-sm leading-relaxed text-foreground">
                      {selected.summary}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="outline">
                        {orgReportCategoryLabels[selected.category]}
                      </Badge>
                      <Badge
                        variant="outline"
                        className={getOrgReportStatusBadgeClass(selected.status)}
                      >
                        {orgReportStatusLabels[selected.status]}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      المرسل: {selected.reporterLabel}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatUtcDateTime(selected.submittedAt)}
                    </p>
                  </>
                ) : null}
              </div>
            </SheetDescription>
          </SheetHeader>
        </SheetContent>
      </Sheet>
    </section>
  );
}
