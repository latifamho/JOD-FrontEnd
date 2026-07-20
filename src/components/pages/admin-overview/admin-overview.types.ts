import type { AppIconName } from "@/constant/icons";

export type StatCardItem = {
  id: string;
  label: string;
  value: number;
  subLabel?: string;
  icon: AppIconName;
};
