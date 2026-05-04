import type {
  OrganizationCampaignItem,
  OrganizationCampaignStatus,
} from "@/components/pages/organization-campaigns/static-data";

export function createNextCampaignId(
  campaigns: OrganizationCampaignItem[],
): string {
  const maxId = campaigns.reduce((currentMax, campaign) => {
    const numericPart = Number.parseInt(campaign.id.replace(/\D/g, ""), 10);
    if (Number.isNaN(numericPart)) {
      return currentMax;
    }
    return Math.max(currentMax, numericPart);
  }, 3000);

  return `OCM-${maxId + 1}`;
}

export function getCampaignStatusBadgeClass(
  status: OrganizationCampaignStatus,
): string {
  if (status === "active") {
    return "border-emerald-200/70 bg-emerald-100 text-emerald-800 dark:border-emerald-500/40 dark:bg-emerald-500/20 dark:text-emerald-100";
  }

  if (status === "draft") {
    return "border-amber-200/70 bg-amber-100 text-amber-800 dark:border-amber-500/40 dark:bg-amber-500/20 dark:text-amber-100";
  }

  return "border-slate-200/70 bg-slate-100 text-slate-800 dark:border-slate-500/40 dark:bg-slate-500/20 dark:text-slate-100";
}

export function formatAmount(amount: number): string {
  return new Intl.NumberFormat("en-US").format(amount);
}

export function getProgress(goalAmount: number, raisedAmount: number): number {
  if (goalAmount <= 0) {
    return 0;
  }

  const progress = Math.round((raisedAmount / goalAmount) * 100);
  return Math.max(0, Math.min(progress, 100));
}

export function toDateInputValue(dateTime: string): string {
  return dateTime.slice(0, 10);
}

export function toDateTimeFromInput(dateValue: string): string {
  return `${dateValue}T09:00:00`;
}
