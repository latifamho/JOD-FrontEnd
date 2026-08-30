"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { AppIcons } from "@/constant/icons";
import { formatUtcDateTimeOrDash } from "@/lib/date";
import { displayOrDash } from "@/lib/text";
import { useAdminGroupDetail } from "@/features/admin/groups/admin.groups.query";
import { GroupStatusBadge } from "@/components/pages/groups-management/group-status-badge";
import {
  groupRoleLabels,
  groupVisibilityLabels,
  type AdminGroupItem,
  type AdminGroupPerson,
} from "@/components/pages/groups-management/groups-management.types";

type GroupDetailsSheetProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  group: AdminGroupItem;
  isDeciding: boolean;
  onApprove: (groupId: string) => void;
  onReject: (group: AdminGroupItem) => void;
};

function PersonRow({ person }: { person: AdminGroupPerson }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-md border border-border px-3 py-2">
      <div className="min-w-0">
        <p className="truncate text-sm font-medium text-foreground">{person.name}</p>
        <p className="truncate text-xs text-muted-foreground">@{person.username}</p>
      </div>
      <Badge variant="outline" className="shrink-0 text-[11px]">
        {groupRoleLabels[person.role ?? "admin"]}
      </Badge>
    </div>
  );
}

function DetailsSkeleton() {
  return (
    <div className="space-y-4" aria-label="جاري تحميل تفاصيل المجموعة">
      <div className="flex gap-2">
        <div className="h-6 w-20 animate-pulse rounded-full bg-muted" />
        <div className="h-6 w-24 animate-pulse rounded-full bg-muted" />
      </div>
      <div className="grid gap-3 rounded-lg border border-border bg-muted/20 p-4 sm:grid-cols-2">
        {["category", "location", "visibility", "owner", "submitted", "reviewed"].map((key) => (
          <div key={key} className="space-y-2">
            <div className="h-3 w-20 animate-pulse rounded bg-muted" />
            <div className="h-4 w-32 animate-pulse rounded bg-muted" />
          </div>
        ))}
      </div>
      <div className="h-24 animate-pulse rounded-lg bg-muted" />
      <div className="h-32 animate-pulse rounded-lg bg-muted" />
    </div>
  );
}

function StatCard({ value, label }: { value: number; label: string }) {
  return (
    <div className="rounded-lg border border-border bg-muted/30 p-3">
      <p className="text-lg font-bold text-foreground">{value}</p>
      <p className="mt-0.5 text-xs text-muted-foreground">{label}</p>
    </div>
  );
}

export function GroupDetailsSheet({
  open,
  onOpenChange,
  group,
  isDeciding,
  onApprove,
  onReject,
}: GroupDetailsSheetProps) {
  const { data, isLoading } = useAdminGroupDetail(open ? group.id : null);
  const detail = data?.data;
  const isPending = group.status === "pending";

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" dir="rtl" className="w-[95vw] border-border p-0 sm:max-w-2xl">
        <SheetHeader className="border-b border-border pe-12 text-right">
          <SheetTitle className="text-right text-xl">{group.name}</SheetTitle>
        </SheetHeader>

        <div className="flex-1 space-y-4 overflow-y-auto p-4">
          {isLoading ? <DetailsSkeleton /> : null}

          <div className={isLoading ? "hidden" : "contents"}>
            <div className="mb-4 flex flex-wrap items-center gap-2">
              <GroupStatusBadge status={group.status} />
              <Badge variant="outline">{group.category}</Badge>
              <Badge variant="outline">{groupVisibilityLabels[group.visibility]}</Badge>
              {group.isVerifiedOrganization ? (
                <Badge variant="outline" className="gap-1.5">
                  <AppIcons.verification className="size-3.5" />
                  منظمة موثّقة
                </Badge>
              ) : null}
            </div>

            <div className="grid gap-3 rounded-lg border border-border bg-muted/40 p-4 sm:grid-cols-2">
              <div>
                <p className="text-xs text-muted-foreground">المالك</p>
                <p className="text-sm font-medium">
                  {displayOrDash(detail?.owner.name ?? group.ownerName)}
                </p>
                {detail ? (
                  <p className="mt-0.5 text-xs text-muted-foreground">@{detail.owner.username}</p>
                ) : null}
              </div>
              <div>
                <p className="text-xs text-muted-foreground">المنظمة</p>
                <p className="text-sm font-medium">{displayOrDash(group.organizationName)}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">المحافظة</p>
                <p className="text-sm font-medium">{displayOrDash(group.location)}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">عدد الأعضاء</p>
                <p className="text-sm font-medium">{group.membersCount}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">تاريخ الإرسال للمراجعة</p>
                <p className="text-sm font-medium">
                  {formatUtcDateTimeOrDash(group.submittedAt)}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">تاريخ آخر قرار</p>
                <p className="text-sm font-medium">{formatUtcDateTimeOrDash(group.reviewedAt)}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">راجعها</p>
                <p className="text-sm font-medium">{displayOrDash(group.reviewedBy)}</p>
              </div>
              {detail?.createdAt ? (
                <div>
                  <p className="text-xs text-muted-foreground">تاريخ التفعيل</p>
                  <p className="text-sm font-medium">
                    {formatUtcDateTimeOrDash(detail.createdAt)}
                  </p>
                </div>
              ) : null}
            </div>

            <div className="rounded-lg border border-border p-4">
              <p className="mb-2 text-xs text-muted-foreground">وصف المجموعة</p>
              <p className="text-sm leading-7 text-foreground">
                {displayOrDash(detail?.description)}
              </p>
            </div>

            {detail?.purpose ? (
              <div className="rounded-lg border border-info/40 bg-info/5 p-4">
                <p className="mb-2 text-xs font-semibold text-info">
                  مبرر الإنشاء — يظهر للمراجع فقط
                </p>
                <p className="text-sm leading-7 text-foreground">{detail.purpose}</p>
              </div>
            ) : null}

            <div className="rounded-lg border border-border p-4">
              <p className="mb-3 text-xs text-muted-foreground">
                قوانين المجموعة — يوافق عليها العضو قبل الانضمام
              </p>
              {detail && detail.rules.length > 0 ? (
                <ol className="list-inside list-decimal space-y-2 text-sm leading-7 text-foreground">
                  {detail.rules.map((rule) => (
                    <li key={rule}>{rule}</li>
                  ))}
                </ol>
              ) : (
                <p className="text-sm text-muted-foreground">
                  لم يضف المنشئ أي قوانين — هذا سبب كافٍ لطلب التعديل قبل القبول.
                </p>
              )}
            </div>

            {detail && detail.proposedAdmins.length > 0 ? (
              <div className="rounded-lg border border-border p-4">
                <p className="mb-3 text-xs text-muted-foreground">
                  المشرفون المقترحون — يحصلون على الصلاحية بعد القبول فقط
                </p>
                <div className="space-y-2">
                  {detail.proposedAdmins.map((admin) => (
                    <PersonRow key={admin.id} person={admin} />
                  ))}
                </div>
              </div>
            ) : null}

            {detail && group.status !== "pending" ? (
              <div className="grid grid-cols-3 gap-3 text-center">
                <StatCard value={group.membersCount} label="الأعضاء" />
                <StatCard value={detail.postsCount} label="المنشورات" />
                <StatCard value={group.postsThisWeek} label="منشورات هذا الأسبوع" />
              </div>
            ) : null}

            {group.rejectionReason ? (
              <div className="rounded-lg border border-rose-200/70 bg-rose-50/80 p-4 dark:border-rose-500/40 dark:bg-rose-500/10">
                <p className="mb-1 text-xs font-semibold text-rose-700 dark:text-rose-200">
                  سبب الرفض
                </p>
                <p className="text-sm text-rose-700 dark:text-rose-100">
                  {group.rejectionReason}
                </p>
              </div>
            ) : null}
          </div>
        </div>

        {isPending ? (
          <SheetFooter className="justify-start border-t border-border">
            <Button type="button" disabled={isDeciding} onClick={() => onApprove(group.id)}>
              <AppIcons.ShieldCheck className="size-4" />
              قبول ونشر
            </Button>
            <Button
              type="button"
              variant="destructive"
              disabled={isDeciding}
              onClick={() => onReject(group)}
            >
              <AppIcons.reports className="size-4" />
              رفض
            </Button>
          </SheetFooter>
        ) : null}
      </SheetContent>
    </Sheet>
  );
}
