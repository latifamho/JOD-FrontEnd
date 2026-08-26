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
import { formatUtcDateTime } from "@/lib/date";
import { displayOrDash } from "@/lib/text";
import {
  getOrganizationStatusBadgeClass,
  getDisplayOrganizationStatus,
} from "@/components/pages/organizations-management/helpers";
import {
  organizationStatusLabels,
  type AdminOrganizationItem,
} from "@/components/pages/organizations-management/organizations-management.types";
import { AppIcons } from "@/constant/icons";

const SKELETON_ROW_COUNT = 5;

function SkeletonPulse({ className }: { className: string }) {
  return <div className={`animate-pulse rounded bg-muted ${className}`} />;
}

type OrganizationsTableProps = {
  rows: AdminOrganizationItem[];
  isLoading: boolean;
  loadingRowIds: Set<string>;
  onViewOrganization: (organizationId: string) => void;
  onToggleOrganizationStatus: (organizationId: string) => void;
  onDeleteOrganization: (organizationId: string) => void;
};

export function OrganizationsTable({
  rows,
  isLoading,
  loadingRowIds,
  onViewOrganization,
  onToggleOrganizationStatus,
  onDeleteOrganization,
}: OrganizationsTableProps) {
  return (
    <div className="overflow-auto flex flex-1 rounded-md border border-border shadow-xs">
      <Table className="min-w-300 bg-background">
        <TableHeader className="bg-muted/35">
          <TableRow>
            <TableHead>المنظمة</TableHead>
            <TableHead>الحالة</TableHead>
            <TableHead>بيانات التواصل</TableHead>
            <TableHead>الموقع</TableHead>
            <TableHead>النشاط</TableHead>
            <TableHead>التواريخ</TableHead>
            <TableHead className="w-14">الإجراءات</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {isLoading ? (
            Array.from({ length: SKELETON_ROW_COUNT }).map((_, i) => (
              <TableRow key={i}>
                <TableCell>
                  <SkeletonPulse className="mb-1.5 h-3.5 w-28" />
                  <SkeletonPulse className="h-3 w-16" />
                </TableCell>
                <TableCell>
                  <SkeletonPulse className="h-5 w-16 rounded-full" />
                </TableCell>
                <TableCell>
                  <SkeletonPulse className="mb-1.5 h-3 w-36" />
                  <SkeletonPulse className="h-3 w-24" />
                </TableCell>
                <TableCell>
                  <SkeletonPulse className="h-3 w-20" />
                </TableCell>
                <TableCell>
                  <SkeletonPulse className="mb-1.5 h-3 w-20" />
                  <SkeletonPulse className="h-3 w-20" />
                </TableCell>
                <TableCell>
                  <SkeletonPulse className="mb-1.5 h-3 w-32" />
                  <SkeletonPulse className="h-3 w-32" />
                </TableCell>
                <TableCell>
                  <SkeletonPulse className="h-8 w-8 rounded-md" />
                </TableCell>
              </TableRow>
            ))
          ) : rows.length > 0 ? (
            rows.map((organization) => {
              const isRowLoading = loadingRowIds.has(organization.id);
              const displayStatus = getDisplayOrganizationStatus(organization);

              return (
                <TableRow key={organization.id}>
                  <TableCell>
                    <p className="font-semibold text-foreground">
                      {displayOrDash(organization.name)}
                    </p>
                  </TableCell>

                  <TableCell>
                    <Badge
                      variant="outline"
                      className={getOrganizationStatusBadgeClass(displayStatus)}
                    >
                      {organizationStatusLabels[displayStatus]}
                    </Badge>
                  </TableCell>

                  <TableCell>
                    <p className="text-xs text-foreground">
                      {displayOrDash(organization.email)}
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {displayOrDash(organization.phone)}
                    </p>
                  </TableCell>

                  <TableCell>
                    <p className="text-xs text-foreground">
                      {displayOrDash(organization.location)}
                    </p>
                  </TableCell>

                  <TableCell>
                    <p className="text-xs text-muted-foreground">
                      الحملات:{" "}
                      <span className="font-semibold text-foreground">
                        {organization.campaignsCount}
                      </span>
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      المنشورات:{" "}
                      <span className="font-semibold text-foreground">
                        {organization.postsCount}
                      </span>
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      درجة النشاط:{" "}
                      <span className="font-semibold text-foreground">
                        {organization.activityScore}
                      </span>
                    </p>
                  </TableCell>

                  <TableCell>
                    <p className="text-xs text-muted-foreground">
                      الإنشاء: {formatUtcDateTime(organization.createdAt)}
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      آخر نشاط: {formatUtcDateTime(organization.lastActiveAt)}
                    </p>
                  </TableCell>

                  <TableCell>
                    <TableRowActions
                      loading={isRowLoading}
                      actions={[
                        {
                          id: "view",
                          label: "عرض تفاصيل المنظمة",
                          icon: <AppIcons.eye className="size-4" />,
                          onSelect: () => onViewOrganization(organization.id),
                        },
                        {
                          id: "toggle",
                          label:
                            displayStatus === "active"
                              ? "إلغاء تفعيل المنظمة"
                              : "تفعيل المنظمة",
                          icon: <AppIcons.ShieldCheck className="size-4" />,
                          onSelect: () =>
                            onToggleOrganizationStatus(organization.id),
                        },
                        {
                          id: "delete",
                          label: "حذف المنظمة",
                          icon: <AppIcons.Trash className="size-4" />,
                          onSelect: () =>
                            onDeleteOrganization(organization.id),
                          destructive: true,
                          separatorBefore: true,
                        },
                      ]}
                    />
                  </TableCell>
                </TableRow>
              );
            })
          ) : (
            <TableRow>
              <TableCell
                colSpan={7}
                className="py-10 text-center text-sm text-muted-foreground"
              >
                لا توجد بيانات منظمات للعرض.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
