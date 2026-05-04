/** قيم افتراضية تجريبية — إعدادات الحساب البنكي للمنظمة */

export type OrgBankSettingsDefaults = {
  bankName: string;
  iban: string;
};

export const orgOwnerBankSettingsDefaults: OrgBankSettingsDefaults = {
  bankName: "البنك الأهلي السعودي",
  iban: "SA03 8000 0000 6080 1016 7519",
};

export const orgStaffBankSettingsDefaults: OrgBankSettingsDefaults = {
  bankName: "البنك الأهلي السعودي",
  iban: "— (يُعرض للمالك فقط)",
};
