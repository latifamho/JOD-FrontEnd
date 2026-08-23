"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  organizationCampaignCategoryLabels,
  syrianGovernorateOptions,
  type OrganizationCampaignCategory,
} from "@/components/pages/organization-campaigns/static-data";

export type CampaignSortOption =
  | "updated_newest"
  | "updated_oldest"
  | "progress_highest"
  | "progress_lowest";

type OrganizationCampaignsFiltersProps = {
  categoryFilter: "all" | OrganizationCampaignCategory;
  onCategoryFilterChange: (
    value: "all" | OrganizationCampaignCategory,
  ) => void;
  locationFilter: string;
  locationOptions: string[];
  onLocationFilterChange: (value: string) => void;
  sortBy: CampaignSortOption;
  onSortByChange: (value: CampaignSortOption) => void;
};

export function OrganizationCampaignsFilters({
  categoryFilter,
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
        onValueChange={(value) =>
          onCategoryFilterChange(value as "all" | OrganizationCampaignCategory)
        }
      >
        <SelectTrigger className="w-full text-right text-xs">
          <SelectValue placeholder="فلتر الفئة" />
        </SelectTrigger>
        <SelectContent align="start" position="popper" className="text-right">
          <SelectItem value="all" className="text-right text-xs">
            كل الفئات
          </SelectItem>
          {Object.entries(organizationCampaignCategoryLabels).map(
            ([category, label]) => (
              <SelectItem
                key={category}
                value={category}
                className="text-right text-xs"
              >
                {label}
              </SelectItem>
            ),
          )}
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
