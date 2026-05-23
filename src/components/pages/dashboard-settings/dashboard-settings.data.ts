/** قيم افتراضية تجريبية — إعدادات الحساب والأمان والبنك */

export type DashboardSettingsDefaults = {
  accountName: string;
  accountEmail: string;
  accountPhone: string;
  recoveryEmail: string;
  twoFactorEnabled: boolean;
  bankName: string;
  bankAccountNumber: string;
  iban: string;
};

export const dashboardSettingsDefaultsByScope: Record<
  "admin" | "org-owner" | "org-staff",
  DashboardSettingsDefaults
> = {
  admin: {
    accountName: "مدير المنصة",
    accountEmail: "admin@jod.sa",
    accountPhone: "+966500000001",
    recoveryEmail: "admin.recovery@jod.sa",
    twoFactorEnabled: true,
    bankName: "البنك الأهلي السعودي",
    bankAccountNumber: "200100111222",
    iban: "SA03 8000 0000 6080 1016 7519",
  },
  "org-owner": {
    accountName: "مالك المنظمة",
    accountEmail: "owner@org.jod.sa",
    accountPhone: "+966500000010",
    recoveryEmail: "owner.recovery@org.jod.sa",
    twoFactorEnabled: true,
    bankName: "البنك الأهلي السعودي",
    bankAccountNumber: "430021000345",
    iban: "SA03 8000 0000 6080 1016 7519",
  },
  "org-staff": {
    accountName: "موظف المنظمة",
    accountEmail: "staff@org.jod.sa",
    accountPhone: "+966500000020",
    recoveryEmail: "staff.recovery@org.jod.sa",
    twoFactorEnabled: false,
    bankName: "البنك الأهلي السعودي",
    bankAccountNumber: "430021000345",
    iban: "SA03 8000 0000 6080 1016 7519",
  },
};
