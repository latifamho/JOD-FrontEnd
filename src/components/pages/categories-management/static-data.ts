export type CategoryTarget = "post" | "campaign";

export type CategoryStatus = "active" | "inactive";

export type AdminCategoryItem = {
  id: string;
  name: string;
  target: CategoryTarget;
  description: string;
  usageCount: number;
  status: CategoryStatus;
  createdAt: string;
  updatedAt: string;
};

export const categoryTargetLabels: Record<CategoryTarget, string> = {
  post: "تصنيفات المنشورات",
  campaign: "تصنيفات الحملات",
};

export const categoryStatusLabels: Record<CategoryStatus, string> = {
  active: "مفعلة",
  inactive: "متوقفة",
};

