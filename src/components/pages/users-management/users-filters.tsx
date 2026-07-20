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
  userRoleLabels,
  userStatusLabels,
  type UserRole,
  type UserStatus,
} from "@/components/pages/users-management/users-management.types";

type UsersFiltersProps = {
  statusFilter: "all" | UserStatus;
  roleFilter: "all" | UserRole;
  searchFilter: string;
  onStatusFilterChange: (value: "all" | UserStatus) => void;
  onRoleFilterChange: (value: "all" | UserRole) => void;
  onSearchFilterChange: (value: string) => void;
  onResetFilters: () => void;
};

export function UsersFilters({
  statusFilter,
  roleFilter,
  searchFilter,
  onStatusFilterChange,
  onRoleFilterChange,
  onSearchFilterChange,
  onResetFilters,
}: UsersFiltersProps) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <Input
        dir="rtl"
        autoComplete="off"
        placeholder="بحث بالاسم أو البريد..."
        value={searchFilter}
        onChange={(e) => onSearchFilterChange(e.target.value)}
        className="min-w-[160px] flex-1 text-right text-xs sm:max-w-xs"
      />

      <Select
        dir="rtl"
        value={statusFilter}
        onValueChange={(value) =>
          onStatusFilterChange(value as "all" | UserStatus)
        }
      >
        <SelectTrigger className="w-full min-w-[140px] flex-1 text-right text-xs sm:max-w-[180px]">
          <SelectValue placeholder="الحالة" />
        </SelectTrigger>
        <SelectContent align="start" position="popper" className="text-right">
          <SelectItem value="all" className="text-right">
            كل الحالات
          </SelectItem>
          {Object.entries(userStatusLabels).map(([status, label]) => (
            <SelectItem key={status} value={status} className="text-right text-xs">
              {label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        dir="rtl"
        value={roleFilter}
        onValueChange={(value) =>
          onRoleFilterChange(value as "all" | UserRole)
        }
      >
        <SelectTrigger className="w-full min-w-[140px] flex-1 text-right text-xs sm:max-w-[180px]">
          <SelectValue placeholder="الدور" />
        </SelectTrigger>
        <SelectContent align="start" position="popper" className="text-right">
          <SelectItem value="all" className="text-right">
            كل الأدوار
          </SelectItem>
          {Object.entries(userRoleLabels).map(([role, label]) => (
            <SelectItem key={role} value={role} className="text-right text-xs">
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
