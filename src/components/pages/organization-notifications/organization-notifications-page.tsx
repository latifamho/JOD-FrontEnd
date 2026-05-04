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
  orgNotificationCategoryLabels,
  organizationNotificationsStaticData,
  type OrgNotificationItem,
} from "@/components/pages/organization-notifications/static-data";

type Filter = "all" | "unread" | "read";

const filterLabels: Record<Filter, string> = {
  all: "الكل",
  unread: "غير مقروء",
  read: "مقروء",
};

export function OrganizationNotificationsPage() {
  const [items, setItems] = React.useState<OrgNotificationItem[]>(
    organizationNotificationsStaticData,
  );
  const [filter, setFilter] = React.useState<Filter>("all");
  const [openId, setOpenId] = React.useState<string | null>(null);

  const filtered = React.useMemo(() => {
    return items.filter((n) => {
      if (filter === "unread") return !n.read;
      if (filter === "read") return n.read;
      return true;
    });
  }, [items, filter]);

  const selected = React.useMemo(
    () => items.find((n) => n.id === openId) ?? null,
    [items, openId],
  );

  function toggleRead(id: string) {
    setItems((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: !n.read } : n)),
    );
  }

  const unreadCount = items.filter((n) => !n.read).length;

  return (
    <section className="flex flex-col flex-1 gap-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold text-foreground">
            الإشعارات
          </h2>
          <p className="mt-0.5 text-xs text-muted-foreground">
            تنبيهات الحملات والتبرعات والموظفين والمنشورات.{" "}
            {unreadCount > 0 ? (
              <span className="text-sky-600 dark:text-sky-400">
                {unreadCount} غير مقروء
              </span>
            ) : (
              <span>لا توجد إشعارات غير مقروءة</span>
            )}
          </p>
        </div>

        <div className="flex flex-wrap gap-1 rounded-lg border border-border bg-muted/25 p-1">
          {(Object.keys(filterLabels) as Filter[]).map((key) => (
            <Button
              key={key}
              type="button"
              variant={filter === key ? "secondary" : "ghost"}
              size="sm"
              className="h-8 text-xs"
              onClick={() => setFilter(key)}
            >
              {filterLabels[key]}
            </Button>
          ))}
        </div>
      </div>

      <div className="overflow-auto flex flex-1 rounded-md border border-border shadow-xs">
        <Table className="min-w-[min(100%,720px)] bg-background">
          <TableHeader className="bg-muted/35">
            <TableRow>
              <TableHead className="w-10" />
              <TableHead>الإشعار</TableHead>
              <TableHead>النوع</TableHead>
              <TableHead>التاريخ</TableHead>
              <TableHead className="w-40">إجراءات</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((row) => (
              <TableRow
                key={row.id}
                className={row.read ? "" : "bg-sky-500/5"}
              >
                <TableCell className="align-top">
                  {!row.read ? (
                    <span
                      className="inline-block size-2 rounded-full bg-sky-500"
                      title="غير مقروء"
                    />
                  ) : (
                    <span className="inline-block size-2 rounded-full bg-muted-foreground/25" />
                  )}
                </TableCell>
                <TableCell>
                  <p className="font-semibold text-foreground">{row.title}</p>
                  <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
                    {row.body}
                  </p>
                  {row.referenceLabel ? (
                    <p className="mt-1 text-[11px] text-muted-foreground">
                      {row.referenceLabel}
                    </p>
                  ) : null}
                </TableCell>
                <TableCell>
                  <Badge variant="outline">
                    {orgNotificationCategoryLabels[row.category]}
                  </Badge>
                </TableCell>
                <TableCell className="whitespace-nowrap text-xs text-muted-foreground">
                  {formatUtcDateTime(row.createdAt)}
                </TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="h-8 text-xs"
                      onClick={() => setOpenId(row.id)}
                    >
                      التفاصيل
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-8 px-2 text-xs"
                      onClick={() => toggleRead(row.id)}
                    >
                      {row.read ? "تعيين غير مقروء" : "تعيين مقروء"}
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Sheet open={openId !== null} onOpenChange={(o) => !o && setOpenId(null)}>
        <SheetContent side="right" dir="rtl" className="sm:max-w-md">
          <SheetHeader>
            <SheetTitle>{selected?.title}</SheetTitle>
            <SheetDescription asChild>
              <div className="space-y-3 pt-2 text-start">
                {selected ? (
                  <>
                    <p className="text-sm text-foreground">{selected.body}</p>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="outline">
                        {orgNotificationCategoryLabels[selected.category]}
                      </Badge>
                      <Badge variant="secondary">
                        {selected.read ? "مقروء" : "غير مقروء"}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {formatUtcDateTime(selected.createdAt)}
                    </p>
                    {selected.referenceLabel ? (
                      <p className="text-xs text-muted-foreground">
                        مرجع: {selected.referenceLabel}
                      </p>
                    ) : null}
                    <Button
                      type="button"
                      className="mt-2"
                      onClick={() => {
                        if (selected) toggleRead(selected.id);
                        setOpenId(null);
                      }}
                    >
                      {selected?.read
                        ? "إعادة كغير مقروء"
                        : "تعيين كمقروء وإغلاق"}
                    </Button>
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
