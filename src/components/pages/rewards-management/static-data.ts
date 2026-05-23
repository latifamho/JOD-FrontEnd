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

export const badgeStaticData: BadgeItem[] = [
  {
    id: "BDG-001",
    name: "متبرع نشط",
    description: "لمن أتم 5 تبرعات أو أكثر",
    criteria: "5 تبرعات مكتملة",
    iconName: "donors",
    isActive: true,
    createdAt: "2026-01-15T10:00:00",
  },
  {
    id: "BDG-002",
    name: "مؤسسة موثقة",
    description: "لمؤسسات تم التحقق من وثائقها",
    criteria: "توثيق من الأدمن",
    iconName: "verification",
    isActive: true,
    createdAt: "2026-01-15T10:00:00",
  },
  {
    id: "BDG-003",
    name: "مساهم توعوي",
    description: "لمن نشر 10 منشورات توعوية مقبولة",
    criteria: "10 منشورات توعوية",
    iconName: "campaigns",
    isActive: true,
    createdAt: "2026-01-16T09:00:00",
  },
  {
    id: "BDG-004",
    name: "كاشف احتيال",
    description: "لمن أبلغ عن احتيال وتم تأكيده",
    criteria: "بلاغ مؤكد",
    iconName: "reports",
    isActive: true,
    createdAt: "2026-01-17T11:00:00",
  },
  {
    id: "BDG-005",
    name: "متطوع متميز",
    description: "لمن سجّل 40 ساعة تطوع عبر المنصة",
    criteria: "40 ساعة تطوع",
    iconName: "donors",
    isActive: true,
    createdAt: "2026-02-01T08:00:00",
  },
];
