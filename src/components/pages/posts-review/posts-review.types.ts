import type { ModerationStatus } from "@/components/shared";

export type ReviewPostType =
  | "general"
  | "help_request"
  | "job_opportunity"
  | "awareness"
  | "campaign_update"
  | "campaign_teaser"
  | "campaign_summary";

export type ReviewPostItem = {
  id: string;
  title: string;
  summary: string;
  organizationName: string;
  authorName: string | null;
  location: string;
  submittedAt: string;
  publishedAt: string | null;
  status: ModerationStatus;
  type: ReviewPostType;
  campaignTitle?: string | null;
  reviewedBy?: string | null;
  rejectionReason?: string | null;
};

export const postTypeLabels: Record<ReviewPostType, string> = {
  general: "عام",
  help_request: "طلب مساعدة",
  job_opportunity: "فرصة عمل",
  awareness: "منشور توعوي",
  campaign_update: "تحديث حملة",
  campaign_teaser: "تشويق حملة",
  campaign_summary: "ملخص حملة",
};

export const reviewStatusLabels: Record<ModerationStatus, string> = {
  pending: "قيد المراجعة",
  approved: "مقبولة",
  rejected: "مرفوضة",
};
