/** قيم افتراضية تجريبية — ملف شخصي الداشبورد حسب النطاق */

import type { DashboardProfileScope } from "./dashboard-profile.types";

export type DashboardProfileDefaults = {
  name: string;
  email: string;
  showVerifiedBadge: boolean;
  showOrgBadge: boolean;
};

export const dashboardProfileDefaultsByScope: Record<
  DashboardProfileScope,
  DashboardProfileDefaults
> = {
  admin: {
    name: "فريق الإدارة",
    email: "admin@jod.sa",
    showVerifiedBadge: true,
    showOrgBadge: false,
  },
  "org-owner": {
    name: "جمعية الخير الطبية",
    email: "contact@khair-med.org.sa",
    showVerifiedBadge: true,
    showOrgBadge: true,
  },
  "org-staff": {
    name: "نورة العاملي",
    email: "noura.staff@khair-med.org.sa",
    showVerifiedBadge: true,
    showOrgBadge: false,
  },
};
