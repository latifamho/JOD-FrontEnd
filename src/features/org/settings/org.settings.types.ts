export interface OrganizationProfile { id: string; name: string; email: string; phone: string }
export interface OrganizationBankAccount { bankName: string | null; iban: string | null }
export type OrganizationProfileResponse = { data: OrganizationProfile }
export type OrganizationBankAccountResponse = { data: OrganizationBankAccount }
