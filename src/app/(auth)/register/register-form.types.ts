import type { ChangeEvent } from "react";

export type RegisterPhase = "phase-1" | "phase-2";

export type RegisterFounderValues = {
  id: string;
  name: string;
  email: string;
  phone: string;
  password: string;
  passwordConfirmation: string;
};

export type RegisterValues = {
  founders: RegisterFounderValues[];
  companyName: string;
  organizationNumber: string;
  registrationNumber: string;
  bankAccountNumber: string;
  companyEmail: string;
  companyPhone: string;
  location: string;
  website: string;
};

export type RegisterFieldName = Exclude<keyof RegisterValues, "founders">;
export type RegisterFounderFieldName = Exclude<keyof RegisterFounderValues, "id">;
export type RegisterFounderErrors = Partial<Record<RegisterFounderFieldName, string>>;
export type RegisterFieldErrors = Partial<Record<RegisterFieldName | "logo" | "root", string>> & {
  founders?: RegisterFounderErrors[];
};

export type RegisterInputChangeEvent = ChangeEvent<HTMLInputElement | HTMLTextAreaElement>;

export function createEmptyFounder(id = "founder-primary"): RegisterFounderValues {
  return {
    id,
    name: "",
    email: "",
    phone: "",
    password: "",
    passwordConfirmation: "",
  };
}

export const INITIAL_REGISTER_VALUES: RegisterValues = {
  founders: [createEmptyFounder()],
  companyName: "",
  organizationNumber: "",
  registrationNumber: "",
  bankAccountNumber: "",
  companyEmail: "",
  companyPhone: "",
  location: "",
  website: "",
};
