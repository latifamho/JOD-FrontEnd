"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import type { ModerationStatus } from "@/components/shared";
import { reviewStatusLabels } from "@/components/pages/posts-review/static-data";

export type { ReviewSortOption } from "@/features/admin/posts/admin.posts.types";
import type { ReviewSortOption } from "@/features/admin/posts/admin.posts.types";

type ReviewToolbarProps = {
  status: ModerationStatus;
  sortBy: ReviewSortOption;
  onSortByChange: (value: ReviewSortOption) => void;
  organizationSearch: string;
  onOrganizationSearchChange: (value: string) => void;
  totalResults: number;
};

export function ReviewToolbar({
  status,
  sortBy,
  onSortByChange,
  organizationSearch,
  onOrganizationSearchChange,
  totalResults,
}: ReviewToolbarProps) {
  return (
    <div className="space-y-4">
      <div className="flex gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-base font-semibold text-foreground">
            المنشورات — {reviewStatusLabels[status]}
          </h2>
          <p className="mt-0.5 text-xs text-muted-foreground">
            {totalResults} منشور
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Input
            value={organizationSearch}
            onChange={(e) => onOrganizationSearchChange(e.target.value)}
            placeholder="البحث بالمنظمة..."
            className="w-44 text-right text-xs placeholder:text-xs"
          />

          <Select
            dir="rtl"
            value={sortBy}
            onValueChange={(value) => onSortByChange(value as ReviewSortOption)}
          >
            <SelectTrigger className="w-44 text-right text-xs">
              <SelectValue placeholder="ترتيب النتائج" />
            </SelectTrigger>
            <SelectContent align="start" position="popper" className="text-right">
              <SelectItem value="title_asc" className="text-right">
                العنوان (A - Z)
              </SelectItem>
              <SelectItem value="title_desc" className="text-right">
                العنوان (Z - A)
              </SelectItem>
              <SelectItem value="created_at_newest" className="text-right">
                تاريخ الإنشاء (الأحدث)
              </SelectItem>
              <SelectItem value="created_at_oldest" className="text-right">
                تاريخ الإنشاء (الأقدم)
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
