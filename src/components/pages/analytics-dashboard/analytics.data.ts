/** بيانات تجريبية — معاينة التحليلات (قبل ربط الـ API) */

export type AnalyticsKpi = {
  id: string;
  label: string;
  value: string;
  changeVsLastMonth: string;
};

export const analyticsKpiPreviewData: AnalyticsKpi[] = [
  { id: "users", label: "مستخدمون نشطون", value: "1,247", changeVsLastMonth: "+8%" },
  {
    id: "organizations",
    label: "منظمات موثّقة",
    value: "64",
    changeVsLastMonth: "+4%",
  },
  { id: "posts", label: "منشورات منشورة", value: "389", changeVsLastMonth: "+12%" },
  {
    id: "campaigns",
    label: "حملات نشطة",
    value: "23",
    changeVsLastMonth: "+6%",
  },
  { id: "donations", label: "تسجيلات تبرع", value: "156", changeVsLastMonth: "+3%" },
  { id: "reports", label: "بلاغات مغلقة", value: "42", changeVsLastMonth: "-2%" },
];

export type AnalyticsWeekRow = {
  weekLabel: string;
  visits: string;
  newUsers: string;
  donations: string;
};

/** ملخص أسابيع تجريبي — يُستبدل لاحقاً ببيانات من الـ API */
export const analyticsWeeklyPreviewData: AnalyticsWeekRow[] = [
  {
    weekLabel: "16–22 مارس",
    visits: "12.4 ألف",
    newUsers: "89",
    donations: "41",
  },
  {
    weekLabel: "9–15 مارس",
    visits: "11.1 ألف",
    newUsers: "76",
    donations: "38",
  },
  {
    weekLabel: "2–8 مارس",
    visits: "10.8 ألف",
    newUsers: "71",
    donations: "35",
  },
  {
    weekLabel: "23 فبراير–1 مارس",
    visits: "9.9 ألف",
    newUsers: "64",
    donations: "29",
  },
];
