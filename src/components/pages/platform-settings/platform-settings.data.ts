/** قيم افتراضية تجريبية — إعدادات المنصة (الأدمن) */

export type PlatformSettingsDefaults = {
  siteName: string;
  allowNewPosts: boolean;
  requirePostReview: boolean;
  accountName: string;
  accountEmail: string;
  accountPhone: string;
  recoveryEmail: string;
  twoFactorEnabled: boolean;
  bankName: string;
  bankAccountNumber: string;
  iban: string;
};

export const platformSettingsDefaultsData: PlatformSettingsDefaults = {
  siteName: "منصة جود",
  allowNewPosts: true,
  requirePostReview: true,
  accountName: "مدير المنصة",
  accountEmail: "admin@jod.sa",
  accountPhone: "+966500000001",
  recoveryEmail: "admin.recovery@jod.sa",
  twoFactorEnabled: true,
  bankName: "البنك الأهلي السعودي",
  bankAccountNumber: "200100111222",
  iban: "SA03 8000 0000 6080 1016 7519",
};
