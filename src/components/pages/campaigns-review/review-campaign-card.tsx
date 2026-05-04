"use client";

import * as React from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ReviewStatusBadge } from "@/components/shared";
import { AppIcons } from "@/constant/icons";
import { formatUtcDate } from "@/lib/date";
import {
  campaignCategoryLabels,
  type ReviewCampaignItem,
} from "@/components/pages/campaigns-review/static-data";
import { CampaignDetailsDialog } from "@/components/pages/campaigns-review/campaign-details-dialog";
import { RejectCampaignDialog } from "@/components/pages/campaigns-review/reject-campaign-dialog";
import {
  formatAmount,
  getProgress,
} from "@/components/pages/campaigns-review/helpers";

type ReviewCampaignCardProps = {
  campaign: ReviewCampaignItem;
  onApprove: (campaignId: string) => void;
  onReject: (campaignId: string, reason: string) => void;
};

export function ReviewCampaignCard({
  campaign,
  onApprove,
  onReject,
}: ReviewCampaignCardProps) {
  const [detailsOpen, setDetailsOpen] = React.useState(false);
  const [rejectDialogOpen, setRejectDialogOpen] = React.useState(false);

  const progress = getProgress(campaign.goalAmount, campaign.raisedAmount);

  return (
    <>
      <article className="rounded-xl border border-border bg-background p-4 shadow-xs">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-2">
            <ReviewStatusBadge status={campaign.status} />
            <Badge variant="outline">
              {campaignCategoryLabels[campaign.category]}
            </Badge>
            <Badge variant="outline">{campaign.id}</Badge>
          </div>
          <p className="text-xs text-muted-foreground">
            أرسلت للمراجعة: {formatUtcDate(campaign.submittedAt)}
          </p>
        </div>

        <h3 className="mb-2 text-base font-semibold text-foreground">
          {campaign.title}
        </h3>
        <p className="line-clamp-2 text-sm leading-6 text-muted-foreground">
          {campaign.summary}
        </p>

        <div className="mt-4 rounded-lg border border-border/70 bg-muted/35 p-3">
          <div className="mb-2 flex items-center justify-between text-xs text-muted-foreground">
            <span>نسبة التقدم</span>
            <span className="font-semibold text-foreground">{progress}%</span>
          </div>
          <div className="h-2 w-full rounded-full bg-muted">
            <div
              className="h-2 rounded-full bg-primary transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="mt-2 grid gap-2 text-xs text-muted-foreground sm:grid-cols-2">
            <p>
              الهدف:{" "}
              <span className="font-semibold text-foreground">
                {formatAmount(campaign.goalAmount)} ر.س
              </span>
            </p>
            <p>
              المحصل:{" "}
              <span className="font-semibold text-foreground">
                {formatAmount(campaign.raisedAmount)} ر.س
              </span>
            </p>
          </div>
        </div>

        <div className="mt-4 grid gap-2 rounded-lg border border-border/70 bg-muted/35 p-3 text-xs text-muted-foreground sm:grid-cols-3">
          <p>
            <span className="font-semibold text-foreground">المنظمة:</span>{" "}
            {campaign.organizationName}
          </p>
          <p>
            <span className="font-semibold text-foreground">المستفيدون:</span>{" "}
            {campaign.beneficiariesCount}
          </p>
          <p>
            <span className="font-semibold text-foreground">المدينة:</span>{" "}
            {campaign.location}
          </p>
        </div>

        {campaign.rejectionReason && (
          <div className="mt-3 rounded-lg border border-rose-200/70 bg-rose-50/80 p-3 text-xs text-rose-700 dark:border-rose-500/40 dark:bg-rose-500/10 dark:text-rose-100">
            <p className="font-semibold">سبب الرفض:</p>
            <p className="mt-1 line-clamp-2">{campaign.rejectionReason}</p>
          </div>
        )}

        <div className="mt-4 flex flex-wrap items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setDetailsOpen(true)}
          >
            <AppIcons.profile className="size-4" />
            عرض التفاصيل
          </Button>

          {campaign.status === "pending" && (
            <>
              <Button
                type="button"
                size="sm"
                className="bg-emerald-600 text-white hover:bg-emerald-700"
                onClick={() => onApprove(campaign.id)}
              >
                <AppIcons.campaigns className="size-4" />
                قبول
              </Button>
              <Button
                type="button"
                size="sm"
                variant="destructive"
                onClick={() => setRejectDialogOpen(true)}
              >
                <AppIcons.reports className="size-4" />
                رفض
              </Button>
            </>
          )}
        </div>
      </article>

      <CampaignDetailsDialog
        open={detailsOpen}
        onOpenChange={setDetailsOpen}
        campaign={campaign}
      />

      <RejectCampaignDialog
        open={rejectDialogOpen}
        onOpenChange={setRejectDialogOpen}
        campaignTitle={campaign.title}
        onConfirm={(reason) => onReject(campaign.id, reason)}
      />
    </>
  );
}
