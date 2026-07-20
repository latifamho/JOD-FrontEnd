"use client";

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
  targetFilter: "all" | CategoryTarget;
  statusFilter: "all" | CategoryStatus;
  searchFilter: string;
  onTargetFilterChange: (value: "all" | CategoryTarget) => void;
  onStatusFilterChange: (value: "all" | CategoryStatus) => void;
  onSearchFilterChange: (value: string) => void;
};

export function CategoriesFilters({
  targetFilter,
  statusFilter,
  searchFilter,
  onTargetFilterChange,
  onStatusFilterChange,
  onSearchFilterChange,
}: CategoriesFiltersProps) {
  return (
    <div className="grid gap-3 sm:grid-cols-3">
      <Input
        dir="rtl"
        placeholder="بحث بالاسم..."
        value={searchFilter}
        onChange={(e) => onSearchFilterChange(e.target.value)}
        className="text-right text-xs"
      />

      <Select
        dir="rtl"
        value={targetFilter}
        onValueChange={(value) =>
          onTargetFilterChange(value as "all" | CategoryTarget)
        }
      >
        <SelectTrigger className="w-full text-right text-xs">
          <SelectValue placeholder="النوع" />
        </SelectTrigger>
        <SelectContent align="start" position="popper" className="text-right">
          <SelectItem value="all" className="text-right">
            كل الأنواع
          </SelectItem>
          {Object.entries(categoryTargetLabels).map(([target, label]) => (
            <SelectItem key={target} value={target} className="text-right text-xs">
              {label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        dir="rtl"
        value={statusFilter}
        onValueChange={(value) =>
          onStatusFilterChange(value as "all" | CategoryStatus)
        }
      >
        <SelectTrigger className="w-full text-right text-xs">
          <SelectValue placeholder="الحالة" />
        </SelectTrigger>
        <SelectContent align="start" position="popper" className="text-right">
          <SelectItem value="all" className="text-right">
            كل الحالات
          </SelectItem>
          {Object.entries(categoryStatusLabels).map(([status, label]) => (
            <SelectItem key={status} value={status} className="text-right text-xs">
              {label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
