"use client";

import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { ReviewStatusBadge } from "@/components/shared";
import { formatUtcDate, formatUtcDateTime } from "@/lib/date";
import { displayOrDash } from "@/lib/text";
import {
  formatAmount,
  getProgress,
} from "@/components/pages/campaigns-review/helpers";
import {
  reviewCampaignCategoryLabels,
  type ReviewCampaignItem,
} from "@/components/pages/campaigns-review/campaigns-review.types";

type CampaignDetailsDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  campaign: ReviewCampaignItem;
};

export function CampaignDetailsDialog({
  open,
  onOpenChange,
  campaign,
}: CampaignDetailsDialogProps) {
  const progress = getProgress(campaign.goalAmount, campaign.raisedAmount);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        dir="rtl"
        className="w-[95vw] border-border p-0 sm:max-w-2xl"
      >
        <SheetHeader className="border-b border-border pe-12 text-right">
          <SheetTitle className="text-right text-xl">{campaign.title}</SheetTitle>
        </SheetHeader>

        <div className="space-y-4 overflow-y-auto p-4">
          <div className="flex flex-wrap items-center gap-2">
            <ReviewStatusBadge status={campaign.status} />
            <Badge variant="outline">
              {reviewCampaignCategoryLabels[campaign.category]}
            </Badge>
            <Badge variant="outline">{campaign.id}</Badge>
          </div>

          <div className="rounded-lg border border-border bg-muted/40 p-4">
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
            <div className="mt-3 grid gap-1 text-xs text-muted-foreground sm:grid-cols-2">
              <p>
                الهدف:{" "}
                <span className="font-semibold text-foreground">
                  {formatAmount(campaign.goalAmount)} ر.س
                </span>
              </p>
              <p>
                المحصّل:{" "}
                <span className="font-semibold text-foreground">
                  {formatAmount(campaign.raisedAmount)} ر.س
                </span>
              </p>
            </div>
          </div>

          <div className="grid gap-3 rounded-lg border border-border bg-muted/40 p-4 sm:grid-cols-2">
            <div>
              <p className="text-xs text-muted-foreground">الجهة الناشرة</p>
              <p className="text-sm font-medium">
                {displayOrDash(campaign.organizationName)}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">مدير الحملة</p>
              <p className="text-sm font-medium">
                {displayOrDash(campaign.campaignManagerName)}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">المدينة</p>
              <p className="text-sm font-medium">
                {displayOrDash(campaign.location)}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">المستفيدون</p>
              <p className="text-sm font-medium">
                {displayOrDash(campaign.beneficiariesCount)}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">تاريخ البداية</p>
              <p className="text-sm font-medium">
                {formatUtcDate(campaign.startDate)}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">تاريخ النهاية</p>
              <p className="text-sm font-medium">
                {formatUtcDate(campaign.endDate)}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">تاريخ الإرسال للمراجعة</p>
              <p className="text-sm font-medium">
                {formatUtcDateTime(campaign.submittedAt)}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">آخر مراجعة بواسطة</p>
              <p className="text-sm font-medium">
                {displayOrDash(campaign.reviewedBy)}
              </p>
            </div>
          </div>

          <div className="rounded-lg border border-border p-4">
            <p className="mb-2 text-xs text-muted-foreground">ملخص الحملة</p>
            <p className="text-sm leading-7 text-foreground">{campaign.summary}</p>
          </div>

          {campaign.rejectionReason && (
            <div className="rounded-lg border border-rose-200/70 bg-rose-50/80 p-4 dark:border-rose-500/40 dark:bg-rose-500/10">
              <p className="mb-1 text-xs font-semibold text-rose-700 dark:text-rose-200">
                سبب الرفض السابق
              </p>
              <p className="text-sm text-rose-700 dark:text-rose-100">
                {campaign.rejectionReason}
              </p>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
