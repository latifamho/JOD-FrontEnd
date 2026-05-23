"use client";

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
} from "@/components/pages/reports-management/static-data";
import {
  reportEntityTypeLabels,
  reportSeverityLabels,
} from "@/components/pages/reports-management/static-data";

type ReportsToolbarProps = {
  severityFilter: "all" | ReportSeverity;
  onSeverityFilterChange: (value: "all" | ReportSeverity) => void;
  entityTypeFilter: "all" | ReportEntityType;
  onEntityTypeFilterChange: (value: "all" | ReportEntityType) => void;
};

export function ReportsToolbar({
  severityFilter,
  onSeverityFilterChange,
  entityTypeFilter,
  onEntityTypeFilterChange,
}: ReportsToolbarProps) {
  return (
    <div className="grid gap-3 md:grid-cols-4">
      <Select
        dir="rtl"
        value={severityFilter}
        onValueChange={(value) =>
          onSeverityFilterChange(value as "all" | ReportSeverity)
        }
      >
        <SelectTrigger className="w-full text-right text-xs">
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
        <SelectTrigger className="w-full text-right text-xs">
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
    </div>
  );
}

