"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  organizationStatusLabels,
  organizationVerificationLabels,
  type OrganizationStatus,
  type OrganizationVerificationStatus,
} from "@/components/pages/organizations-management/organizations-management.types";

export type OrganizationsSortOption =
  | "name_asc"
  | "name_desc"
  | "created_newest"
  | "created_oldest";

type OrganizationsFiltersProps = {
  searchFilter: string;
  onSearchFilterChange: (value: string) => void;
  statusFilter: "all" | OrganizationStatus;
  onStatusFilterChange: (value: "all" | OrganizationStatus) => void;
  verificationFilter: "all" | OrganizationVerificationStatus;
  onVerificationFilterChange: (
    value: "all" | OrganizationVerificationStatus,
  ) => void;
  locationFilter: string;
  locationOptions: string[];
  onLocationFilterChange: (value: string) => void;
  sortBy: OrganizationsSortOption;
  onSortByChange: (value: OrganizationsSortOption) => void;
  onResetFilters: () => void;
  isLoading?: boolean;
};

export function OrganizationsFilters({
  searchFilter,
  onSearchFilterChange,
  statusFilter,
  onStatusFilterChange,
  verificationFilter,
  onVerificationFilterChange,
  locationFilter,
  locationOptions,
  onLocationFilterChange,
  sortBy,
  onSortByChange,
  onResetFilters,
  isLoading = false,
}: OrganizationsFiltersProps) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <Input
        dir="rtl"
        disabled={isLoading}
        value={searchFilter}
        onChange={(event) => onSearchFilterChange(event.target.value)}
        placeholder="بحث بالاسم أو البريد أو الهاتف..."
        className="min-w-[200px] flex-1 text-right text-xs sm:max-w-xs"
      />

      <Select
        dir="rtl"
        disabled={isLoading}
        value={statusFilter}
        onValueChange={(value) => onStatusFilterChange(value as "all" | OrganizationStatus)}
      >
        <SelectTrigger className="w-full min-w-[150px] flex-1 text-right text-xs sm:max-w-[190px]">
          <SelectValue placeholder="حالة الحساب" />
        </SelectTrigger>
        <SelectContent align="start" position="popper" className="text-right">
          <SelectItem value="all" className="text-right text-xs">كل الحالات</SelectItem>
          {Object.entries(organizationStatusLabels).map(([status, label]) => (
            <SelectItem key={status} value={status} className="text-right text-xs">{label}</SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        dir="rtl"
        disabled={isLoading}
        value={verificationFilter}
        onValueChange={(value) =>
          onVerificationFilterChange(value as "all" | OrganizationVerificationStatus)
        }
      >
        <SelectTrigger className="w-full min-w-[160px] flex-1 text-right text-xs sm:max-w-[220px]">
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

      <Select
        dir="rtl"
        disabled={isLoading || locationOptions.length === 0}
        value={locationFilter}
        onValueChange={onLocationFilterChange}
      >
        <SelectTrigger className="w-full min-w-[140px] flex-1 text-right text-xs sm:max-w-[180px]">
          <SelectValue placeholder="الموقع" />
        </SelectTrigger>
        <SelectContent align="start" position="popper" className="text-right">
          <SelectItem value="all" className="text-right text-xs">كل المواقع</SelectItem>
          {locationOptions.map((location) => (
            <SelectItem key={location} value={location} className="text-right text-xs">{location}</SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        dir="rtl"
        disabled={isLoading}
        value={sortBy}
        onValueChange={(value) => onSortByChange(value as OrganizationsSortOption)}
      >
        <SelectTrigger className="w-full min-w-[140px] flex-1 text-right text-xs sm:max-w-[200px]">
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

      <Button
        type="button"
        variant="outline"
        size="sm"
        className="ms-auto h-8 shrink-0 px-3 text-xs"
        disabled={isLoading}
        onClick={onResetFilters}
      >
        إعادة تعيين
      </Button>
    </div>
  );
}
