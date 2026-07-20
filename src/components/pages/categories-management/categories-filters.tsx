"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type CategoriesFiltersProps = {
  searchFilter: string;
  onSearchFilterChange: (value: string) => void;
};

export function CategoriesFilters({
  searchFilter,
  onSearchFilterChange,
}: CategoriesFiltersProps) {
  const hasActiveSearch = searchFilter.trim().length > 0;

  return (
    <div className="flex flex-wrap items-center gap-3">
      <Input
        dir="rtl"
        placeholder="بحث بالاسم..."
        value={searchFilter}
        onChange={(e) => onSearchFilterChange(e.target.value)}
        className="min-w-[160px] flex-1 text-right text-xs sm:max-w-xs"
      />

      {hasActiveSearch && (
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="ms-auto h-8 shrink-0 px-3 text-xs"
          onClick={() => onSearchFilterChange("")}
        >
          إعادة تعيين
        </Button>
      )}
    </div>
  );
}
