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
  userRoleLabels,
  userStatusLabels,
  type UserRole,
  type UserStatus,
} from "@/components/pages/users-management/static-data";

type UsersFiltersProps = {
  statusFilter: "all" | UserStatus;
  roleFilter: "all" | UserRole;
  searchFilter: string;
  onStatusFilterChange: (value: "all" | UserStatus) => void;
  onRoleFilterChange: (value: "all" | UserRole) => void;
  onSearchFilterChange: (value: string) => void;
};

export function UsersFilters({
  statusFilter,
  roleFilter,
  searchFilter,
  onStatusFilterChange,
  onRoleFilterChange,
  onSearchFilterChange,
}: UsersFiltersProps) {
  return (
    <div className="grid gap-3 sm:grid-cols-3">
      <Input
        dir="rtl"
        placeholder="بحث بالاسم أو البريد..."
        value={searchFilter}
        onChange={(e) => onSearchFilterChange(e.target.value)}
        className="text-right text-xs"
      />

      <Select
        dir="rtl"
        value={statusFilter}
        onValueChange={(value) =>
          onStatusFilterChange(value as "all" | UserStatus)
        }
      >
        <SelectTrigger className="w-full text-right text-xs">
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
        <SelectTrigger className="w-full text-right text-xs">
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
    </div>
  );
}
