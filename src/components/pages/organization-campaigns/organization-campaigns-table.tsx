"use client";

import { usePathname } from "next/navigation";

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
import { AppIcons } from "@/constant/icons";
import { routePaths } from "@/constant/routes";
import {
  formatUtcDate,
  formatUtcDateOrDash,
  formatUtcDateTime,
} from "@/lib/date";
import { displayOrDash } from "@/lib/text";
import {
  formatAmount,
  getCampaignStatusBadgeClass,
  getProgress,
} from "@/components/pages/organization-campaigns/helpers";
import {
  organizationCampaignStatusLabels,
  type OrganizationCampaignItem,
} from "@/components/pages/organization-campaigns/static-data";
import type { OrgCategoryBriefItem } from "@/features/org/categories/org.categories.types";

type OrganizationCampaignsTableProps = {
  rows: OrganizationCampaignItem[];
  categories: OrgCategoryBriefItem[];
  onCloseCampaign: (campaignId: string) => void;
  onDeleteCampaign: (campaignId: string) => void;
  canClose: boolean;
  canDelete: boolean;
};

export function OrganizationCampaignsTable({
  rows,
  categories,
  onCloseCampaign,
  onDeleteCampaign,
  canClose,
  canDelete,
}: OrganizationCampaignsTableProps) {
  const pathname = usePathname();
  const isStaffScope = pathname.startsWith(routePaths.dashboardScope.orgStaffRoot);
  const categoryNames = new Map(categories.map((category) => [category.id, category.name]));

  return (
    <div className="overflow-auto flex flex-1 rounded-md border border-border shadow-xs">
      <Table className="min-w-340 bg-background">
        <TableHeader className="bg-muted/35">
          <TableRow>
            <TableHead className="w-12">#</TableHead>
            <TableHead>الحملة</TableHead>
            <TableHead>الحالة</TableHead>
            <TableHead>الفئة</TableHead>
            <TableHead>التقدم</TableHead>
            <TableHead>المؤشرات</TableHead>
            <TableHead>الفترة</TableHead>
            <TableHead>آخر تحديث</TableHead>
            <TableHead className="w-14">الإجراءات</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {rows.length > 0 ? (
            rows.map((campaign, index) => {
              const progress = getProgress(
                campaign.goalAmount,
                campaign.raisedAmount,
              );

              return (
                <TableRow key={campaign.id}>
                  <TableCell className="text-sm text-muted-foreground">
                    {index + 1}
                  </TableCell>

                  <TableCell>
                    <p className="font-semibold text-foreground">{campaign.title}</p>
                    <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
                      {campaign.summary}
                    </p>

                  </TableCell>

                  <TableCell>
                    <Badge
                      variant="outline"
                      className={getCampaignStatusBadgeClass(campaign.status)}
                    >
                      {organizationCampaignStatusLabels[campaign.status]}
                    </Badge>
                  </TableCell>

                  <TableCell>
                    <Badge variant="outline">
                      {displayOrDash(categoryNames.get(campaign.categoryId ?? ""))}
                    </Badge>
                  </TableCell>

                  <TableCell>
                    <div className="w-45 space-y-2">
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>نسبة التقدم</span>
                        <span className="font-semibold text-foreground">{progress}%</span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-muted">
                        <div
                          className="h-2 rounded-full bg-primary transition-all"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                      <p className="text-xs text-muted-foreground">
                        المحصّل:{" "}
                        <span className="font-semibold text-foreground">
                          {formatAmount(campaign.raisedAmount)} ر.س
                        </span>
                      </p>
                      <p className="text-xs text-muted-foreground">
                        الهدف:{" "}
                        <span className="font-semibold text-foreground">
                          {formatAmount(campaign.goalAmount)} ر.س
                        </span>
                      </p>
                    </div>
                  </TableCell>

                  <TableCell>
                    <p className="text-xs text-muted-foreground">
                      المتبرعون:{" "}
                      <span className="font-semibold text-foreground">
                        {campaign.donorsCount}
                      </span>
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      المتقدمون:{" "}
                      <span className="font-semibold text-foreground">
                        {campaign.applicantsCount}
                      </span>
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      المستفيدون:{" "}
                      <span className="font-semibold text-foreground">
                        {campaign.beneficiariesCount}
                      </span>
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      المدينة:{" "}
                      <span className="font-semibold text-foreground">
                        {displayOrDash(campaign.location)}
                      </span>
                    </p>
                  </TableCell>

                  <TableCell>
                    <p className="text-xs text-muted-foreground">
                      البداية: {formatUtcDate(campaign.startDate)}
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      النهاية: {formatUtcDate(campaign.endDate)}
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      الإغلاق: {formatUtcDateOrDash(campaign.closedAt)}
                    </p>
                  </TableCell>

                  <TableCell>
                    <p className="text-xs text-muted-foreground">
                      {formatUtcDateTime(campaign.updatedAt)}
                    </p>
                  </TableCell>

                  <TableCell>
                    <TableRowActions
                      actions={[
                        {
                          id: "details",
                          label: "تفاصيل الحملة",
                          icon: <AppIcons.eye className="size-4 text-info" />,
                          href: isStaffScope
                            ? routePaths.organizationStaffScope.campaignDetails(
                                campaign.id,
                              )
                            : routePaths.organizationOwnerScope.campaignDetails(
                                campaign.id,
                              ),
                        },
                        {
                          id: "close",
                          label: "إغلاق الحملة",
                          icon: (
                            <AppIcons.archive className="size-4 text-warning" />
                          ),
                          onSelect: () => onCloseCampaign(campaign.id),
                          disabled: campaign.status !== "active",
                          hidden: !canClose,
                        },
                        {
                          id: "delete",
                          label: "حذف الحملة",
                          icon: (
                            <AppIcons.Trash className="size-4 text-destructive" />
                          ),
                          onSelect: () => onDeleteCampaign(campaign.id),
                          destructive: true,
                          separatorBefore: true,
                          hidden: !canDelete,
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
                colSpan={9}
                className="py-10 text-center text-sm text-muted-foreground"
              >
                لا توجد حملات مطابقة لخيارات العرض الحالية.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
