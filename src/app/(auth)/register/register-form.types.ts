import type { ChangeEvent } from "react";

export type RegisterPhase = "phase-1" | "phase-2";
export type OrganizationType = "association" | "foundation" | "initiative";

export type RegisterValues = {
  adminFullName: string;
  adminEmail: string;
  adminPhone: string;
  password: string;
  confirmPassword: string;
  organizationNameAr: string;
  organizationNameEn: string;
  registrationNumber: string;
  establishmentDate: string;
  city: string;
  shortAddress: string;
  organizationDescription: string;
  officialEmail: string;
  officialPhone: string;
  website: string;
  socialMedia: string;
};

export type RegisterInputChangeEvent = ChangeEvent<
  HTMLInputElement | HTMLTextAreaElement
>;

export const INITIAL_REGISTER_VALUES: RegisterValues = {
  adminFullName: "",
  adminEmail: "",
  adminPhone: "",
  password: "",
  confirmPassword: "",
  organizationNameAr: "",
  organizationNameEn: "",
  registrationNumber: "",
  establishmentDate: "",
  city: "",
  shortAddress: "",
  organizationDescription: "",
  officialEmail: "",
  officialPhone: "",
  website: "",
  socialMedia: "",
};
