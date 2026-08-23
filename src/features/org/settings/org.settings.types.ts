import type { MediaItem } from "@/features/shared/media/media.types";

export interface OrganizationProfile {
  id: string;
  companyName: string;
  ownerName: string;
  organizationNumber: string;
  registrationNumber: string;
  bankAccountNumber: string;
  companyEmail: string;
  companyPhone: string;
  location: string;
  website: string | null;
  image: string | null;
  logo: MediaItem | null;
}

export type OrganizationProfileUpdateRequest = Partial<Pick<
  OrganizationProfile,
  "companyName" | "ownerName" | "organizationNumber" | "registrationNumber" | "bankAccountNumber" | "companyEmail" | "companyPhone" | "location" | "website"
>>;

export interface OrganizationPasswordUpdateRequest {
  currentPassword: string;
  newPassword: string;
  newPassword_confirmation: string;
}

export type OrganizationProfileResponse = { data: OrganizationProfile };
export type OrganizationPasswordUpdateResponse = { message: string };
