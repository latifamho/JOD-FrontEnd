/** Mirrors the mobile app: pending | active | rejected. */
export type AdminGroupStatus = "pending" | "active" | "rejected";

export type GroupVisibility = "public" | "private";

export type GroupMemberRole = "owner" | "admin" | "moderator" | "member";

/** Owner or proposed admin, as the review screen needs to show them. */
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
  visibility: GroupVisibility;
  membersCount: number;
  postsThisWeek: number;
  imageUrl: string | null;
  organizationName: string | null;
  isVerifiedOrganization: boolean;
  ownerName: string | null;
  status: AdminGroupStatus;
  rejectionReason: string | null;
  suspensionReason: string | null;
  /** When the creation request was submitted for review. */
  submittedAt: string | null;
  reviewedAt: string | null;
  reviewedBy: string | null;
};

export const groupStatusLabels: Record<AdminGroupStatus, string> = {
  pending: "قيد المراجعة",
  active: "مقبولة",
  rejected: "مرفوضة",
};

export const groupVisibilityLabels: Record<GroupVisibility, string> = {
  public: "عامة",
  private: "خاصة",
};

export const groupRoleLabels: Record<GroupMemberRole, string> = {
  owner: "المالك",
  admin: "مشرف",
  moderator: "مراقب",
  member: "عضو",
};

/** Mirrors GROUP_CATEGORIES in the mobile app — keep the two lists in sync. */
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
