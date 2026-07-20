"use client";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type {
  ReportEntityType,
  ReportSeverity,
} from "@/components/pages/reports-management/reports-management.types";
import {
  reportEntityTypeLabels,
  reportSeverityLabels,
} from "@/components/pages/reports-management/reports-management.types";

type ReportsToolbarProps = {
  severityFilter: "all" | ReportSeverity;
  onSeverityFilterChange: (value: "all" | ReportSeverity) => void;
  entityTypeFilter: "all" | ReportEntityType;
  onEntityTypeFilterChange: (value: "all" | ReportEntityType) => void;
  onResetFilters: () => void;
};

export function ReportsToolbar({
  severityFilter,
  onSeverityFilterChange,
  entityTypeFilter,
  onEntityTypeFilterChange,
  onResetFilters,
}: ReportsToolbarProps) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <Select
        dir="rtl"
        value={severityFilter}
        onValueChange={(value) =>
          onSeverityFilterChange(value as "all" | ReportSeverity)
        }
      >
        <SelectTrigger className="w-full min-w-[160px] flex-1 text-right text-xs sm:max-w-[220px]">
          <SelectValue placeholder="مستوى الخطورة" />
        </SelectTrigger>
        <SelectContent align="start" position="popper" className="text-right">
          <SelectItem value="all" className="text-right">
            كل مستويات الخطورة
          </SelectItem>
          {Object.entries(reportSeverityLabels).map(([severity, label]) => (
            <SelectItem
              key={severity}
              value={severity}
              className="text-right text-xs"
            >
              {label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        dir="rtl"
        value={entityTypeFilter}
        onValueChange={(value) =>
          onEntityTypeFilterChange(value as "all" | ReportEntityType)
        }
      >
        <SelectTrigger className="w-full min-w-[140px] flex-1 text-right text-xs sm:max-w-[200px]">
          <SelectValue placeholder="نوع الكيان" />
        </SelectTrigger>
        <SelectContent align="start" position="popper" className="text-right">
          <SelectItem value="all" className="text-right">
            كل الأنواع
          </SelectItem>
          {Object.entries(reportEntityTypeLabels).map(([type, label]) => (
            <SelectItem key={type} value={type} className="text-right text-xs">
              {label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Button
        type="button"
        variant="outline"
        size="sm"
        className="ms-auto h-8 shrink-0 px-3 text-xs"
        onClick={onResetFilters}
      >
        إعادة تعيين
      </Button>
    </div>
  );
}
