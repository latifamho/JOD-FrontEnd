"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  organizationPostTypeLabels,
  type OrganizationPostType,
} from "@/components/pages/organization-posts-management/static-data";

export type PostsSortOption =
  | "updated_newest"
  | "updated_oldest"
  | "title_asc"
  | "title_desc";

type PostsFiltersProps = {
  typeFilter: "all" | OrganizationPostType;
  onTypeFilterChange: (value: "all" | OrganizationPostType) => void;
  sortBy: PostsSortOption;
  onSortByChange: (value: PostsSortOption) => void;
};

export function PostsFilters({
  typeFilter,
  onTypeFilterChange,
  sortBy,
  onSortByChange,
}: PostsFiltersProps) {
  return (
    <div className="flex gap-4">
      <Select
        dir="rtl"
        value={typeFilter}
        onValueChange={(value) =>
          onTypeFilterChange(value as "all" | OrganizationPostType)
        }
      >
        <SelectTrigger className="w-46 text-right text-xs">
          <SelectValue placeholder="نوع البوست" />
        </SelectTrigger>
        <SelectContent align="start" position="popper" className="text-right">
          <SelectItem value="all" className="text-right text-xs">
            كل الأنواع
          </SelectItem>
          {Object.entries(organizationPostTypeLabels).map(([type, label]) => (
            <SelectItem key={type} value={type} className="text-right text-xs">
              {label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        dir="rtl"
        value={sortBy}
        onValueChange={(value) => onSortByChange(value as PostsSortOption)}
      >
        <SelectTrigger className="w-46 text-right text-xs">
          <SelectValue placeholder="الترتيب" />
        </SelectTrigger>
        <SelectContent align="start" position="popper" className="text-right">
          <SelectItem value="updated_newest" className="text-right text-xs">
            الأحدث تحديثًا
          </SelectItem>
          <SelectItem value="updated_oldest" className="text-right text-xs">
            الأقدم تحديثًا
          </SelectItem>
          <SelectItem value="title_asc" className="text-right text-xs">
            العنوان (A-Z)
          </SelectItem>
          <SelectItem value="title_desc" className="text-right text-xs">
            العنوان (Z-A)
          </SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
