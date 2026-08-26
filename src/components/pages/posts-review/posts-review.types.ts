import type { ModerationStatus } from "@/components/shared";

export type ReviewPostType =
  | "volunteer_opportunity"
  | "donation_campaign"
  | "help_request"
  | "service_offer"
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
  audience?: "general" | "student";
  categoryId?: string | null;
  category?: { id: string; name: string } | null;
  publisher?: { id: string; name: string; type: "user" | "organization" | "admin" };
};

export const postTypeLabels: Record<ReviewPostType, string> = {
  volunteer_opportunity: "فرصة تطوع",
  donation_campaign: "حملة تبرع",
  help_request: "طلب مساعدة",
  service_offer: "تقديم مساعدة",
  campaign_update: "تحديث حملة",
  awareness: "منشور توعوي",
  general: "عام",
};

export const postAudienceLabels = {
  general: "عام",
  student: "طلاب",
} as const;

export const publisherTypeLabels = {
  user: "مستخدم",
  organization: "منظمة",
  admin: "إدارة",
} as const;

export const reviewStatusLabels: Record<ModerationStatus, string> = {
  pending: "قيد المراجعة",
  approved: "مقبولة",
  rejected: "مرفوضة",
};
