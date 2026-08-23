import type { ChangeEvent } from "react";

export type RegisterPhase = "phase-1" | "phase-2";

export type RegisterValues = {
  ownerName: string;
  password: string;
  passwordConfirmation: string;
  companyName: string;
  organizationNumber: string;
  registrationNumber: string;
  bankAccountNumber: string;
  companyEmail: string;
  companyPhone: string;
  location: string;
  website: string;
};

export type RegisterFieldName = keyof RegisterValues;
export type RegisterFieldErrors = Partial<Record<RegisterFieldName | "root", string>>;

export type RegisterInputChangeEvent = ChangeEvent<HTMLInputElement | HTMLTextAreaElement>;

export const INITIAL_REGISTER_VALUES: RegisterValues = {
  ownerName: "",
  password: "",
  passwordConfirmation: "",
  companyName: "",
  organizationNumber: "",
  registrationNumber: "",
  bankAccountNumber: "",
  companyEmail: "",
  companyPhone: "",
  location: "",
  website: "",
};
