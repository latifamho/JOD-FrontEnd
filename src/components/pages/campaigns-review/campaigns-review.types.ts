import type { ModerationStatus } from "@/components/shared";

export type ReviewCampaignCategory =
  | "health"
  | "education"
  | "shelter"
  | "food"
  | "emergency"
  | "environment"
  | "technology"
  | "other";

export type ReviewCampaignItem = {
  id: string;
  title: string;
  summary: string;
  organizationName: string;
  managerName: string | null;
  location: string;
  submittedAt: string;
  startDate: string;
  endDate: string;
  status: ModerationStatus;
  category: ReviewCampaignCategory;
  goalAmount: number;
  raisedAmount: number;
  beneficiariesCount: number;
  reviewedBy?: string;
  rejectionReason?: string;
};

export const reviewCampaignCategoryLabels: Record<
  ReviewCampaignCategory,
  string
> = {
  health: "صحية",
  education: "تعليمية",
  shelter: "إسكان",
  food: "غذائية",
  emergency: "طوارئ",
  environment: "بيئية",
  technology: "تقنية",
  other: "أخرى",
};

export const reviewStatusLabels: Record<ModerationStatus, string> = {
  pending: "قيد المراجعة",
  approved: "مقبولة",
  rejected: "مرفوضة",
};
