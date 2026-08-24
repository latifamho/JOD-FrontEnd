import type { ModerationStatus } from "@/components/shared";

export type ReviewPostType =
  | "volunteer_opportunity"
  | "donation_campaign"
  | "help_request"
  | "campaign_update"
  | "awareness"
  | "general";

export type ReviewPostItem = {
  id: string;
  title: string | null;
  summary: string | null;
  organizationName: string | null;
  authorName: string | null;
  location: string | null;
  submittedAt: string | null;
  publishedAt: string | null;
  status: ModerationStatus;
  type: ReviewPostType;
  campaignTitle?: string | null;
  reviewedBy?: string | null;
  rejectionReason?: string | null;
};

export const postTypeLabels: Record<ReviewPostType, string> = {
  volunteer_opportunity: "فرصة تطوع",
  donation_campaign: "حملة تبرع",
  help_request: "طلب مساعدة",
  campaign_update: "تحديث حملة",
  awareness: "منشور توعوي",
  general: "عام",
};

export const reviewStatusLabels: Record<ModerationStatus, string> = {
  pending: "قيد المراجعة",
  approved: "مقبولة",
  rejected: "مرفوضة",
};
