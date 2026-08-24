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
  type CategoryStatus,
} from "@/components/pages/categories-management/categories-management.types";

type CategoriesFiltersProps = {
  searchFilter: string;
  statusFilter: "all" | CategoryStatus;
  onSearchFilterChange: (value: string) => void;
  onStatusFilterChange: (value: "all" | CategoryStatus) => void;
  onResetFilters: () => void;
};

export function CategoriesFilters({
  searchFilter,
  statusFilter,
  onSearchFilterChange,
  onStatusFilterChange,
  onResetFilters,
}: CategoriesFiltersProps) {
  const hasActiveFilters =
    searchFilter.trim().length > 0 || statusFilter !== "all";

  return (
    <div className="flex flex-wrap items-center gap-3">
      <Input
        dir="rtl"
        placeholder="بحث بالاسم..."
        value={searchFilter}
        onChange={(e) => onSearchFilterChange(e.target.value)}
        className="min-w-[160px] flex-1 text-right text-xs sm:max-w-xs"
      />
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
