export type OrganizationStatus = "active" | "inactive" | "pending" | "rejected";
export type OrganizationVerificationStatus =
  | "verified"
  | "unverified"
  | "pending"
  | "rejected";
export type OrganizationType =
  | "ngo"
  | "charity"
  | "social_enterprise"
  | "community_group"
  | "government"
  | "other";

export type OrganizationSocialMedia = {
  facebook?: string;
  twitter?: string;
  instagram?: string;
};

export type AdminOrganizationItem = {
  id: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  verificationStatus: OrganizationVerificationStatus;
  status: OrganizationStatus;
  campaignsCount: number;
  postsCount: number;
  activeVolunteersCount: number;
  activityScore: number;
  createdAt: string;
  lastActiveAt: string;
  organizationType: OrganizationType;
  registrationNumber: string;
  establishmentDate: string;
  shortAddress: string;
  description: string;
  licenseDocumentName: string;
  delegationDocumentName: string;
  ownerFullName: string;
  ownerEmail: string;
  ownerPhone: string;
  website?: string;
  socialMedia?: OrganizationSocialMedia;
  acceptedAt?: string;
};

export const organizationStatusLabels: Record<OrganizationStatus, string> = {
  active: "نشطة",
  inactive: "غير نشطة",
  pending: "قيد المراجعة",
  rejected: "مرفوضة",
};

export const organizationVerificationLabels: Record<
  OrganizationVerificationStatus,
  string
> = {
  verified: "موثقة",
  unverified: "غير موثقة",
  pending: "قيد التوثيق",
  rejected: "مرفوض توثيقها",
};

export const organizationTypeLabels: Record<OrganizationType, string> = {
  ngo: "منظمة غير حكومية",
  charity: "جمعية خيرية",
  social_enterprise: "مؤسسة اجتماعية",
  community_group: "مجموعة مجتمعية",
  government: "جهة حكومية",
  other: "أخرى",
};
