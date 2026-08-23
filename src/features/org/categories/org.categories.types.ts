export interface OrgCategoryBriefItem {
  id: string;
  name: string;
}

export type OrgCategoriesBriefResponse = { data: OrgCategoryBriefItem[] };
