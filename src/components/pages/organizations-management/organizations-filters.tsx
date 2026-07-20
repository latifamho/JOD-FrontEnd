"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  organizationVerificationLabels,
  type OrganizationVerificationStatus,
} from "@/components/pages/organizations-management/organizations-management.types";

export type OrganizationsSortOption =
  | "name_asc"
  | "name_desc"
  | "created_newest"
  | "created_oldest";

type OrganizationsFiltersProps = {
  verificationFilter: "all" | OrganizationVerificationStatus;
  onVerificationFilterChange: (
    value: "all" | OrganizationVerificationStatus,
  ) => void;
  locationFilter: string;
  locationOptions: string[];
  onLocationFilterChange: (value: string) => void;
  sortBy: OrganizationsSortOption;
  onSortByChange: (value: OrganizationsSortOption) => void;
};

export function OrganizationsFilters({
  verificationFilter,
  onVerificationFilterChange,
  locationFilter,
  locationOptions,
  onLocationFilterChange,
  sortBy,
  onSortByChange,
}: OrganizationsFiltersProps) {
  return (
    <div className="grid gap-3 md:grid-cols-3">
      <Select
        dir="rtl"
        value={verificationFilter}
        onValueChange={(value) =>
          onVerificationFilterChange(value as "all" | OrganizationVerificationStatus)
        }
      >
        <SelectTrigger className="w-full text-right text-xs">
          <SelectValue placeholder="فلتر التوثيق" />
        </SelectTrigger>
        <SelectContent align="start" position="popper" className="text-right">
          <SelectItem value="all" className="text-right text-xs">
            كل المنظمات
          </SelectItem>
          {Object.entries(organizationVerificationLabels).map(([status, label]) => (
            <SelectItem key={status} value={status} className="text-right text-xs">
              {label}
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
              {location}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        dir="rtl"
        value={sortBy}
        onValueChange={(value) => onSortByChange(value as OrganizationsSortOption)}
      >
        <SelectTrigger className="w-full text-right text-xs">
          <SelectValue placeholder="ترتيب النتائج" />
        </SelectTrigger>
        <SelectContent align="start" position="popper" className="text-right">
          <SelectItem value="name_asc" className="text-right text-xs">
            الاسم (A-Z)
          </SelectItem>
          <SelectItem value="name_desc" className="text-right text-xs">
            الاسم (Z-A)
          </SelectItem>
          <SelectItem value="created_newest" className="text-right text-xs">
            الأحدث
          </SelectItem>
          <SelectItem value="created_oldest" className="text-right text-xs">
            الأقدم
          </SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
