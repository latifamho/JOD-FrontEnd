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
  categoryStatusLabels,
  categoryTargetLabels,
  type CategoryStatus,
  type CategoryTarget,
} from "@/components/pages/categories-management/categories-management.types";

type CategoriesFiltersProps = {
  searchFilter: string;
  targetFilter: "all" | CategoryTarget;
  statusFilter: "all" | CategoryStatus;
  onSearchFilterChange: (value: string) => void;
  onTargetFilterChange: (value: "all" | CategoryTarget) => void;
  onStatusFilterChange: (value: "all" | CategoryStatus) => void;
  onResetFilters: () => void;
};

export function CategoriesFilters({
  searchFilter,
  targetFilter,
  statusFilter,
  onSearchFilterChange,
  onTargetFilterChange,
  onStatusFilterChange,
  onResetFilters,
}: CategoriesFiltersProps) {
  const hasActiveFilters =
    searchFilter.trim().length > 0 || targetFilter !== "all" || statusFilter !== "all";

  return (
    <div className="flex flex-wrap items-center gap-3">
      <Input
        dir="rtl"
        placeholder="بحث بالاسم..."
        value={searchFilter}
        onChange={(e) => onSearchFilterChange(e.target.value)}
        className="min-w-[160px] flex-1 text-right text-xs sm:max-w-xs"
      />

      <Select dir="rtl" value={targetFilter} onValueChange={(value) => onTargetFilterChange(value as "all" | CategoryTarget)}>
        <SelectTrigger className="w-full min-w-[140px] flex-1 text-right text-xs sm:max-w-[180px]">
          <SelectValue placeholder="النوع" />
        </SelectTrigger>
        <SelectContent align="start" position="popper" className="text-right">
          <SelectItem value="all">كل الأنواع</SelectItem>
          {(Object.keys(categoryTargetLabels) as CategoryTarget[]).map((target) => (
            <SelectItem key={target} value={target}>{categoryTargetLabels[target]}</SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select dir="rtl" value={statusFilter} onValueChange={(value) => onStatusFilterChange(value as "all" | CategoryStatus)}>
        <SelectTrigger className="w-full min-w-[140px] flex-1 text-right text-xs sm:max-w-[180px]">
          <SelectValue placeholder="الحالة" />
        </SelectTrigger>
        <SelectContent align="start" position="popper" className="text-right">
          <SelectItem value="all">كل الحالات</SelectItem>
          {(Object.keys(categoryStatusLabels) as CategoryStatus[]).map((status) => (
            <SelectItem key={status} value={status}>{categoryStatusLabels[status]}</SelectItem>
          ))}
        </SelectContent>
      </Select>

      {hasActiveFilters && (
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="ms-auto h-8 shrink-0 px-3 text-xs"
          onClick={onResetFilters}
        >
          إعادة تعيين
        </Button>
      )}
    </div>
  );
}
