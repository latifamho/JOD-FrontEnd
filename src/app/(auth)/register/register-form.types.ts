import type { ChangeEvent } from "react";

export type RegisterPhase = "phase-1" | "phase-2";
export type OrganizationType = "association" | "foundation" | "initiative";

export type RegisterValues = {
  ownerName: string;
  ownerEmail: string;
  ownerPhone: string;
  password: string;
  passwordConfirmation: string;
  companyName: string;
  companyEmail: string;
  companyPhone: string;
  organizationType: OrganizationType | "";
  registrationNumber: string;
  establishmentDate: string;
  city: string;
  shortAddress: string;
  description: string;
  website: string;
};

export type RegisterFieldName = keyof RegisterValues;
export type RegisterFieldErrors = Partial<Record<RegisterFieldName | "root", string>>;

export type RegisterInputChangeEvent = ChangeEvent<
  HTMLInputElement | HTMLTextAreaElement
>;

export const INITIAL_REGISTER_VALUES: RegisterValues = {
  ownerName: "",
  ownerEmail: "",
  ownerPhone: "",
  password: "",
  passwordConfirmation: "",
  companyName: "",
  companyEmail: "",
  companyPhone: "",
  organizationType: "",
  registrationNumber: "",
  establishmentDate: "",
  city: "",
  shortAddress: "",
  description: "",
  website: "",
};
