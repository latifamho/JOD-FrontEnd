"use client";

import * as React from "react";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { ModerationStatus } from "@/components/shared";
import { normalizeText } from "@/lib/text";
import { reviewStatusLabels } from "@/components/pages/campaigns-review/static-data";

export type ReviewSortOption =
  | "title_asc"
  | "title_desc"
  | "created_at_newest"
  | "created_at_oldest";

type CampaignReviewToolbarProps = {
  status: ModerationStatus;
  sortBy: ReviewSortOption;
  onSortByChange: (value: ReviewSortOption) => void;
  organizationFilter: string;
  organizations: string[];
  onOrganizationFilterChange: (value: string) => void;
  totalResults: number;
};

export function CampaignReviewToolbar({
  status,
  sortBy,
  onSortByChange,
  organizationFilter,
  organizations,
  onOrganizationFilterChange,
  totalResults,
}: CampaignReviewToolbarProps) {
  const [organizationSearch, setOrganizationSearch] = React.useState("");

  const filteredOrganizations = React.useMemo(() => {
    const query = normalizeText(organizationSearch);
    if (!query) {
      return organizations;
    }
    return organizations.filter((organizationName) =>
      normalizeText(organizationName).includes(query),
    );
  }, [organizationSearch, organizations]);

  return (
    <div className="space-y-4">
      <div className="flex gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-base font-semibold text-foreground">
            مراجعة الحملات — {reviewStatusLabels[status]}
          </h2>
          <p className="mt-0.5 text-xs text-muted-foreground">
            {totalResults} حملة
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Select
            dir="rtl"
            value={sortBy}
            onValueChange={(value) => onSortByChange(value as ReviewSortOption)}
          >
            <SelectTrigger className="w-full text-right text-xs">
              <SelectValue placeholder="ترتيب النتائج" />
            </SelectTrigger>
            <SelectContent
              align="start"
              position="popper"
              className="text-right"
            >
              <SelectItem value="title_asc" className="text-right">
                العنوان (A - Z)
              </SelectItem>
              <SelectItem value="title_desc" className="text-right">
                العنوان (Z - A)
              </SelectItem>
              <SelectItem value="created_at_newest" className="text-right">
                تاريخ الإرسال (الأحدث)
              </SelectItem>
              <SelectItem value="created_at_oldest" className="text-right">
                تاريخ الإرسال (الأقدم)
              </SelectItem>
            </SelectContent>
          </Select>

          <Select
            dir="rtl"
            value={organizationFilter}
            onOpenChange={(open) => {
              if (!open) {
                setOrganizationSearch("");
              }
            }}
            onValueChange={onOrganizationFilterChange}
          >
            <SelectTrigger className="w-full text-right text-xs">
              <SelectValue placeholder="اختر المنظمة" />
            </SelectTrigger>
            <SelectContent
              align="start"
              position="popper"
              className="max-h-72 text-right"
            >
              <div className="sticky top-0 z-10 border-b border-border bg-popover p-2">
                <Input
                  value={organizationSearch}
                  onChange={(event) =>
                    setOrganizationSearch(event.target.value)
                  }
                  onKeyDown={(event) => event.stopPropagation()}
                  placeholder="ابحث عن منظمة..."
                  className="text-xs placeholder:text-xs"
                />
              </div>

              <SelectItem value="all" className="text-right">
                كل المنظمات
              </SelectItem>

              {filteredOrganizations.map((organizationName) => (
                <SelectItem
                  key={organizationName}
                  value={organizationName}
                  className="text-right text-xs"
                >
                  {organizationName}
                </SelectItem>
              ))}

              {filteredOrganizations.length === 0 && (
                <p className="px-2 py-2 text-xs text-muted-foreground">
                  لا توجد نتائج مطابقة.
                </p>
              )}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
