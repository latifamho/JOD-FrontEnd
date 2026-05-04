/** قيم افتراضية تجريبية — إعدادات المنصة (الأدمن) */

export type PlatformSettingsDefaults = {
  siteName: string;
  allowNewPosts: boolean;
  requirePostReview: boolean;
};

export const platformSettingsDefaultsData: PlatformSettingsDefaults = {
  siteName: "منصة جود",
  allowNewPosts: true,
  requirePostReview: true,
};
