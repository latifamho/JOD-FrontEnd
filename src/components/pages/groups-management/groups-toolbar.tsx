"use client";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { AdminGroupSortOption } from "@/features/admin/groups/admin.groups.types";
import {
  GROUP_CATEGORIES,
  groupStatusLabels,
  type AdminGroupStatus,
} from "@/components/pages/groups-management/groups-management.types";

const ALL_OPTION = "all";

type GroupsToolbarProps = {
  status: AdminGroupStatus;
  search: string;
  onSearchChange: (value: string) => void;
  categoryFilter: string;
  onCategoryFilterChange: (value: string) => void;
  sortBy: AdminGroupSortOption;
  onSortByChange: (value: AdminGroupSortOption) => void;
  totalResults: number;
};

export function GroupsToolbar({
  status,
  search,
  onSearchChange,
  categoryFilter,
  onCategoryFilterChange,
  sortBy,
  onSortByChange,
  totalResults,
}: GroupsToolbarProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h2 className="text-base font-semibold text-foreground">
          الفرق التطوعية — {groupStatusLabels[status]}
        </h2>
        <p className="mt-0.5 text-xs text-muted-foreground">{totalResults} فريق تطوعي</p>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Input
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="البحث بالاسم أو المالك..."
          className="w-44 text-right text-xs placeholder:text-xs"
        />

        <Select dir="rtl" value={categoryFilter} onValueChange={onCategoryFilterChange}>
          <SelectTrigger className="w-40 text-right text-xs">
            <SelectValue placeholder="التصنيف" />
          </SelectTrigger>
          <SelectContent align="start" position="popper" className="text-right">
            <SelectItem value={ALL_OPTION} className="text-right">
              كل التصنيفات
            </SelectItem>
            {GROUP_CATEGORIES.map((category) => (
              <SelectItem key={category} value={category} className="text-right">
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          dir="rtl"
          value={sortBy}
          onValueChange={(value) => onSortByChange(value as AdminGroupSortOption)}
        >
          <SelectTrigger className="w-44 text-right text-xs">
            <SelectValue placeholder="ترتيب النتائج" />
          </SelectTrigger>
          <SelectContent align="start" position="popper" className="text-right">
            <SelectItem value="created_at_newest" className="text-right">
              تاريخ الإرسال (الأحدث)
            </SelectItem>
            <SelectItem value="created_at_oldest" className="text-right">
              تاريخ الإرسال (الأقدم)
            </SelectItem>
            <SelectItem value="members_desc" className="text-right">
              الأكثر أعضاءً
            </SelectItem>
            <SelectItem value="name_asc" className="text-right">
              الاسم (أ - ي)
            </SelectItem>
            <SelectItem value="name_desc" className="text-right">
              الاسم (ي - أ)
            </SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
