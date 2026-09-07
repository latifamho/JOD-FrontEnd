"use client";

import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { TableRowActions } from "@/components/shared";
import { AppIcons } from "@/constant/icons";
import { formatUtcDateOrDash } from "@/lib/date";
import type { AdminCapabilityItem } from "@/features/admin/capabilities/admin.capabilities.types";

function Skeleton({ className }: { className: string }) { return <div className={`animate-pulse rounded bg-muted ${className}`} />; }
function statusClass(status: AdminCapabilityItem["status"]) { return status === "active" ? "border-success/40 bg-success/10 text-success" : "border-muted-foreground/30 bg-muted/70 text-muted-foreground"; }

type Props = { rows: AdminCapabilityItem[]; isLoading: boolean; togglingId?: string; onEdit: (row: AdminCapabilityItem) => void; onToggle: (row: AdminCapabilityItem) => void; onDelete: (row: AdminCapabilityItem) => void };

export function CapabilitiesTable({ rows, isLoading, togglingId, onEdit, onToggle, onDelete }: Props) {
  return <div className="flex flex-1 overflow-auto rounded-md border border-border shadow-xs"><Table className="min-w-210 bg-background"><TableHeader className="bg-muted/35"><TableRow><TableHead className="w-12 font-semibold text-muted-foreground">#</TableHead><TableHead className="font-semibold text-muted-foreground">طريقة المساعدة</TableHead><TableHead className="font-semibold text-muted-foreground">المعرّف</TableHead><TableHead className="font-semibold text-muted-foreground">الحالة</TableHead><TableHead className="font-semibold text-muted-foreground">المستخدمون</TableHead><TableHead className="font-semibold text-muted-foreground">الترتيب</TableHead><TableHead className="font-semibold text-muted-foreground">آخر تحديث</TableHead><TableHead className="w-14 font-semibold text-muted-foreground">إجراءات</TableHead></TableRow></TableHeader><TableBody>
    {isLoading ? Array.from({ length: 5 }).map((_, index) => <TableRow key={index}>{Array.from({ length: 8 }).map((__, cell) => <TableCell key={cell}><Skeleton className="h-4 w-16" /></TableCell>)}</TableRow>) : rows.length ? rows.map((row, index) => <TableRow key={row.id}><TableCell className="text-muted-foreground">{index + 1}</TableCell><TableCell className="font-medium">{row.name}</TableCell><TableCell className="font-mono text-xs text-muted-foreground" dir="ltr">{row.slug}</TableCell><TableCell><Badge variant="outline" className={statusClass(row.status)}>{row.status === "active" ? "نشط" : "غير نشط"}</Badge></TableCell><TableCell>{row.usersCount} مستخدم</TableCell><TableCell>{row.sortOrder}</TableCell><TableCell className="text-xs text-muted-foreground">{formatUtcDateOrDash(row.updatedAt)}</TableCell><TableCell><TableRowActions loading={togglingId === row.id} actions={[{ id: "edit", label: "تعديل طريقة المساعدة", icon: <AppIcons.PencilLine className="size-4" />, onSelect: () => onEdit(row) }, { id: "toggle", label: row.status === "active" ? "تعطيل طريقة المساعدة" : "تفعيل طريقة المساعدة", icon: row.status === "active" ? <AppIcons.ShieldOff className="size-4" /> : <AppIcons.ShieldCheck className="size-4" />, onSelect: () => onToggle(row) }, { id: "delete", label: row.usersCount > 0 ? "تعطيل وحفظ البيانات" : "حذف طريقة المساعدة", icon: <AppIcons.Trash className="size-4" />, onSelect: () => onDelete(row), destructive: row.usersCount === 0, separatorBefore: true }]} /></TableCell></TableRow>) : <TableRow><TableCell colSpan={8} className="py-10 text-center text-sm text-muted-foreground">لا توجد طرق مساعدة مطابقة للفلاتر الحالية.</TableCell></TableRow>}
  </TableBody></Table></div>;
}
