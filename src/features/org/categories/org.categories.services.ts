import { api } from "@/services/api";
import type { OrgCategoriesBriefResponse } from "./org.categories.types";

export const orgCategoriesServices = {
  async getBrief(): Promise<OrgCategoriesBriefResponse> {
    const response = await api.get<OrgCategoriesBriefResponse>("/org/categories/brief");
    return response.data;
  },
};
