/** Volunteer-group creation review states. */
export type AdminGroupStatus = "pending" | "active" | "rejected";
export type GroupMemberRole = "owner" | "admin" | "moderator" | "member";

export type AdminGroupPerson = {
  id: string;
  name: string;
  username: string;
  role?: GroupMemberRole;
};

export type AdminGroupItem = {
  id: string;
  name: string;
  category: string;
  location: string | null;
  membersCount: number;
  postsThisWeek: number;
  imageUrl: string | null;
  organizationName: string | null;
  isVerifiedOrganization: boolean;
  ownerName: string | null;
  status: AdminGroupStatus;
  rejectionReason: string | null;
  suspensionReason: string | null;
  submittedAt: string | null;
  reviewedAt: string | null;
  reviewedBy: string | null;
};

export const groupStatusLabels: Record<AdminGroupStatus, string> = {
  pending: "قيد المراجعة",
  active: "مقبولة",
  rejected: "مرفوضة",
};

export const groupRoleLabels: Record<GroupMemberRole, string> = {
  owner: "المالك",
  admin: "مشرف",
  moderator: "مراقب",
  member: "عضو",
};

export const GROUP_CATEGORIES = [
  "تطوع",
  "تعليم",
  "إغاثة",
  "صحة",
  "كفالات",
  "توظيف",
  "تمكين اقتصادي",
  "أخرى",
] as const;

export type GroupCategory = (typeof GROUP_CATEGORIES)[number];
