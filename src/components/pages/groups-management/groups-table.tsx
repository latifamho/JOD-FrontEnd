"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TableRowActions, type TableRowAction } from "@/components/shared";
import { AppIcons } from "@/constant/icons";
import { useQueryDisclosure } from "@/hooks/use-query-modal";
import { formatUtcDateOrDash } from "@/lib/date";
import { displayOrDash } from "@/lib/text";
import { DeleteGroupDialog } from "@/components/pages/groups-management/delete-group-dialog";
import { GroupReasonDialog } from "@/components/pages/groups-management/group-reason-dialog";
import { GroupStatusBadge } from "@/components/pages/groups-management/group-status-badge";
import {
  type AdminGroupItem,
  type AdminGroupStatus,
} from "@/components/pages/groups-management/groups-management.types";

export type GroupsTableHandlers = {
  onOpenDetails: (group: AdminGroupItem) => void;
  onApprove: (groupId: string) => void;
  onReject: (groupId: string, rejectionReason: string) => void;
  onDelete: (groupId: string) => void;
};

type GroupsTableProps = GroupsTableHandlers & {
  groups: AdminGroupItem[];
  /** The row currently waiting on a mutation — its actions menu is disabled. */
  busyGroupId?: string;
  deletingGroupId?: string;
};

/** Pending rows are dated by submission; everything else by the last decision. */
function getRowDate(group: AdminGroupItem): string | null {
  return group.status === "pending" ? group.submittedAt : group.reviewedAt;
}

function getDateColumnLabel(status: AdminGroupStatus): string {
  return status === "pending" ? "تاريخ الإرسال" : "تاريخ القرار";
}

function getRowReason(group: AdminGroupItem): { label: string; text: string } | null {
  if (group.rejectionReason) return { label: "سبب الرفض", text: group.rejectionReason };
  return null;
}

function buildRowActions({
  group,
  handlers,
  openRejectDialog,
  openDeleteDialog,
}: {
  group: AdminGroupItem;
  handlers: GroupsTableHandlers;
  openRejectDialog: () => void;
  openDeleteDialog: () => void;
}): TableRowAction[] {
  return [
    {
      id: "details",
      label: "عرض التفاصيل",
      icon: <AppIcons.eye className="size-4" />,
      onSelect: () => handlers.onOpenDetails(group),
    },
    {
      id: "approve",
      label: "قبول ونشر",
      icon: <AppIcons.ShieldCheck className="size-4" />,
      onSelect: () => handlers.onApprove(group.id),
      hidden: group.status !== "pending" && group.status !== "rejected",
      separatorBefore: true,
    },
    {
      id: "reject",
      label: "رفض",
      icon: <AppIcons.reports className="size-4" />,
      onSelect: openRejectDialog,
      hidden: group.status !== "pending",
      destructive: true,
    },
    {
      id: "delete",
      label: "حذف الفريق التطوعي",
      icon: <AppIcons.Trash className="size-4" />,
      onSelect: openDeleteDialog,
      hidden: group.status === "pending",
      destructive: true,
      separatorBefore: true,
    },
  ];
}

type GroupRowProps = GroupsTableHandlers & {
  group: AdminGroupItem;
  index: number;
  isBusy: boolean;
  isDeleting: boolean;
};

function GroupRow({ group, index, isBusy, isDeleting, ...handlers }: GroupRowProps) {
  const [rejectOpen, setRejectOpen] = useQueryDisclosure(`group-reject-${group.id}`);
  const [deleteOpen, setDeleteOpen] = useQueryDisclosure(`group-delete-${group.id}`);
  const reason = getRowReason(group);

  return (
    <>
      <TableRow>
        <TableCell className="text-sm text-muted-foreground">{index + 1}</TableCell>
        <TableCell>
          <GroupStatusBadge status={group.status} />
        </TableCell>

        <TableCell>
          <div className="flex flex-col gap-0.5">
            <span className="font-medium">{group.name}</span>
            {group.organizationName ? (
              <p className="line-clamp-1 text-xs text-muted-foreground">
                {group.organizationName}
                {group.isVerifiedOrganization ? " · موثّقة" : ""}
              </p>
            ) : null}
            {reason ? (
              <p className="line-clamp-1 text-xs text-rose-600">
                {reason.label}: {reason.text}
              </p>
            ) : null}
          </div>
        </TableCell>

        <TableCell>{displayOrDash(group.ownerName)}</TableCell>
        <TableCell className="hidden md:table-cell">{group.category}</TableCell>
        <TableCell className="hidden lg:table-cell">
          {displayOrDash(group.location)}
        </TableCell>
        <TableCell className="hidden md:table-cell">{group.membersCount}</TableCell>
        <TableCell>{formatUtcDateOrDash(getRowDate(group))}</TableCell>

        <TableCell>
          <TableRowActions
            loading={isBusy}
            actions={buildRowActions({
              group,
              handlers,
              openRejectDialog: () => setRejectOpen(true),
              openDeleteDialog: () => setDeleteOpen(true),
            })}
          />
        </TableCell>
      </TableRow>

      <GroupReasonDialog
        open={rejectOpen}
        onOpenChange={setRejectOpen}
        title="رفض الفريق التطوعي"
        description="أدخل سبب الرفض ليصل إلى منشئ الفريق ويظهر له مع إشعار المراجعة."
        groupName={group.name}
        fieldLabel="سبب الرفض"
        placeholder="مثال: الوصف والقوانين غير كافية لتحديد هدف المجموعة. يمكن إعادة الإرسال بعد التوضيح..."
        confirmLabel="تأكيد الرفض"
        onConfirm={(rejectionReason) => handlers.onReject(group.id, rejectionReason)}
      />

      <DeleteGroupDialog
        open={deleteOpen}
        groupName={group.name}
        membersCount={group.membersCount}
        isDeleting={isDeleting}
        onOpenChange={setDeleteOpen}
        onConfirm={() => handlers.onDelete(group.id)}
      />
    </>
  );
}

export function GroupsTable({
  groups,
  busyGroupId,
  deletingGroupId,
  ...handlers
}: GroupsTableProps) {
  const dateColumnLabel = getDateColumnLabel(groups[0]?.status ?? "pending");

  return (
    <div className="rounded-md border border-border bg-card shadow-sm">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead className="w-12">#</TableHead>
            <TableHead>الحالة</TableHead>
            <TableHead>المجموعة</TableHead>
            <TableHead>المالك</TableHead>
            <TableHead className="hidden md:table-cell">التصنيف</TableHead>
            <TableHead className="hidden lg:table-cell">المحافظة</TableHead>
            <TableHead className="hidden md:table-cell">الأعضاء</TableHead>
            <TableHead>{dateColumnLabel}</TableHead>
            <TableHead>إجراءات</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {groups.map((group, index) => (
            <GroupRow
              key={group.id}
              group={group}
              index={index}
              isBusy={busyGroupId === group.id}
              isDeleting={deletingGroupId === group.id}
              {...handlers}
            />
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
