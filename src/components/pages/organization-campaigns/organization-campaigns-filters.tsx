"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { syrianGovernorateOptions } from "@/components/pages/organization-campaigns/static-data";
import type { OrgCategoryBriefItem } from "@/features/org/categories/org.categories.types";

export type CampaignSortOption =
  | "updated_newest"
  | "updated_oldest"
  | "progress_highest"
  | "progress_lowest";

type OrganizationCampaignsFiltersProps = {
  categoryFilter: string;
  categories: OrgCategoryBriefItem[];
  onCategoryFilterChange: (value: string) => void;
  locationFilter: string;
  locationOptions: string[];
  onLocationFilterChange: (value: string) => void;
  sortBy: CampaignSortOption;
  onSortByChange: (value: CampaignSortOption) => void;
};

export function OrganizationCampaignsFilters({
  categoryFilter,
  categories,
  onCategoryFilterChange,
  locationFilter,
  locationOptions,
  onLocationFilterChange,
  sortBy,
  onSortByChange,
}: OrganizationCampaignsFiltersProps) {
  return (
    <div className="grid gap-3 md:grid-cols-3">
      <Select
        dir="rtl"
        value={categoryFilter}
        onValueChange={onCategoryFilterChange}
      >
        <SelectTrigger className="w-full text-right text-xs">
          <SelectValue placeholder="فلتر الفئة" />
        </SelectTrigger>
        <SelectContent align="start" position="popper" className="text-right">
          <SelectItem value="all" className="text-right text-xs">
            كل الفئات
          </SelectItem>
          {categories.map((category) => (
            <SelectItem
              key={category.id}
              value={category.id}
              className="text-right text-xs"
            >
              {category.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select dir="rtl" value={locationFilter} onValueChange={onLocationFilterChange}>
        <SelectTrigger className="w-full text-right text-xs">
          <SelectValue placeholder="فلتر الموقع" />
        </SelectTrigger>
        <SelectContent align="start" position="popper" className="text-right">
          <SelectItem value="all" className="text-right text-xs">
            كل المواقع
          </SelectItem>
          {locationOptions.map((location) => (
            <SelectItem key={location} value={location} className="text-right text-xs">
              {syrianGovernorateOptions.find((option) => option.value === location)?.label ?? location}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        dir="rtl"
        value={sortBy}
        onValueChange={(value) => onSortByChange(value as CampaignSortOption)}
      >
        <SelectTrigger className="w-full text-right text-xs">
          <SelectValue placeholder="ترتيب النتائج" />
        </SelectTrigger>
        <SelectContent align="start" position="popper" className="text-right">
          <SelectItem value="updated_newest" className="text-right text-xs">
            الأحدث تحديثًا
          </SelectItem>
          <SelectItem value="updated_oldest" className="text-right text-xs">
            الأقدم تحديثًا
          </SelectItem>
          <SelectItem value="progress_highest" className="text-right text-xs">
            الأعلى تقدمًا
          </SelectItem>
          <SelectItem value="progress_lowest" className="text-right text-xs">
            الأقل تقدمًا
          </SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
