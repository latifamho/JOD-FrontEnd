export type CategoryStatus = "active" | "inactive";

export type AdminCategoryItem = {
  id: string;
  name: string;
  description: string;
  usageCount: number;
  status: CategoryStatus;
  createdAt: string;
  updatedAt: string;
};

export const categoryStatusLabels: Record<CategoryStatus, string> = {
  active: "مفعلة",
  inactive: "متوقفة",
};

