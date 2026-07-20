import type { AppIconName } from "@/constant/icons";

export const rewardIconOptions = [
  { value: "rewards", label: "جائزة عامة" },
  { value: "donors", label: "تبرع" },
  { value: "verification", label: "توثيق" },
  { value: "campaigns", label: "حملات" },
  { value: "reports", label: "بلاغات" },
  { value: "goal", label: "إنجاز هدف" },
] as const satisfies ReadonlyArray<{ value: AppIconName; label: string }>;

export type RewardIconName = (typeof rewardIconOptions)[number]["value"];
export type RewardStatus = "active" | "inactive";

export const rewardStatusLabels: Record<RewardStatus, string> = {
  active: "نشط",
  inactive: "معطّل",
};

export type BadgeItem = {
  id: string;
  name: string;
  description: string;
  criteria: string;
  iconName: RewardIconName;
  isActive: boolean;
  createdAt: string;
};

