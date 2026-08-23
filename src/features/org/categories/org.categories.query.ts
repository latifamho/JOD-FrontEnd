"use client";

import { useQuery } from "@tanstack/react-query";
import { orgCategoriesServices } from "./org.categories.services";

export const orgCategoriesKeys = {
  all: ["org", "categories"] as const,
  brief: () => ["org", "categories", "brief"] as const,
};

export function useOrgCategoriesBrief(enabled = true) {
  return useQuery({
    queryKey: orgCategoriesKeys.brief(),
    queryFn: () => orgCategoriesServices.getBrief(),
    enabled,
    staleTime: 60_000,
  });
}
