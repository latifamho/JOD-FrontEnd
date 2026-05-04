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
import { formatUtcDateTime } from "@/lib/date";
import {
  getOrganizationStatusBadgeClass,
  getOrganizationVerificationBadgeClass,
} from "@/components/pages/organizations-management/helpers";
import {
  organizationStatusLabels,
  organizationVerificationLabels,
  type AdminOrganizationItem,
} from "@/components/pages/organizations-management/static-data";
import { AppIcons } from "@/constant/icons";

type OrganizationsTableProps = {
  rows: AdminOrganizationItem[];
  onViewOrganization: (organizationId: string) => void;
  onToggleOrganizationStatus: (organizationId: string) => void;
  onToggleOrganizationVerification: (organizationId: string) => void;
  onDeleteOrganization: (organizationId: string) => void;
};

export function OrganizationsTable({
  rows,
  onViewOrganization,
  onToggleOrganizationStatus,
  onToggleOrganizationVerification,
  onDeleteOrganization,
}: OrganizationsTableProps) {
  return (
    <div className="overflow-auto flex flex-1 rounded-md border border-border shadow-xs">
      <Table className="min-w-300 bg-background">
        <TableHeader className="bg-muted/35">
          <TableRow>
            <TableHead>المنظمة</TableHead>
            <TableHead>التوثيق</TableHead>
            <TableHead>الحالة</TableHead>
            <TableHead>بيانات التواصل</TableHead>
            <TableHead>الموقع</TableHead>
            <TableHead>النشاط</TableHead>
            <TableHead>التواريخ</TableHead>
            <TableHead className="w-48">الإجراءات</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {rows.length > 0 ? (
            rows.map((organization) => (
              <TableRow key={organization.id}>
                <TableCell>
                  <p className="font-semibold text-foreground">
                    {organization.name}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {organization.id}
                  </p>
                </TableCell>

                <TableCell>
                  <Badge
                    variant="outline"
                    className={getOrganizationVerificationBadgeClass(
                      organization.verificationStatus,
                    )}
                  >
                    {
                      organizationVerificationLabels[
                        organization.verificationStatus
                      ]
                    }
                  </Badge>
                </TableCell>

                <TableCell>
                  <Badge
                    variant="outline"
                    className={getOrganizationStatusBadgeClass(
                      organization.status,
                    )}
                  >
                    {organizationStatusLabels[organization.status]}
                  </Badge>
                </TableCell>

                <TableCell>
                  <p className="text-xs text-foreground">
                    {organization.email}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {organization.phone}
                  </p>
                </TableCell>

                <TableCell>
                  <p className="text-xs text-foreground">
                    {organization.location}
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
                  <div className="flex items-center justify-start gap-2">
                    <Button
                      type="button"
                      size="icon"
                      variant="ghost"
                      title="عرض تفاصيل المنظمة"
                      onClick={() => onViewOrganization(organization.id)}
                      className="shadow-sm"
                    >
                      <AppIcons.eye className="size-4 text-info" />
                    </Button>
                    <Button
                      type="button"
                      size="icon"
                      variant="ghost"
                      title={
                        organization.status === "active"
                          ? "إلغاء تفعيل المنظمة"
                          : "تفعيل المنظمة"
                      }
                      onClick={() =>
                        onToggleOrganizationStatus(organization.id)
                      }
                      className="shadow-sm"
                    >
                      <AppIcons.ShieldCheck className="size-4 text-warning" />
                    </Button>
                    <Button
                      type="button"
                      size="icon"
                      variant="ghost"
                      title={
                        organization.verificationStatus === "verified"
                          ? "إلغاء توثيق المنظمة"
                          : "توثيق المنظمة"
                      }
                      onClick={() =>
                        onToggleOrganizationVerification(organization.id)
                      }
                      className="shadow-sm"
                    >
                      {organization.verificationStatus === "verified" ? (
                        <AppIcons.BadgeMinus className="size-4 text-warning" />
                      ) : (
                        <AppIcons.verification className="size-4 text-success" />
                      )}
                    </Button>
                    <Button
                      type="button"
                      size="icon"
                      variant="ghost"
                      title="حذف المنظمة"
                      onClick={() => onDeleteOrganization(organization.id)}
                      className="shadow-sm"
                    >
                      <AppIcons.Trash className="size-4 text-destructive" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={8}
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
