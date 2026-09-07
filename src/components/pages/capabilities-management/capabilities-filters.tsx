"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { CapabilityStatus } from "@/features/admin/capabilities/admin.capabilities.types";

type Props = { search: string; status: "all" | CapabilityStatus; onSearchChange: (value: string) => void; onStatusChange: (value: "all" | CapabilityStatus) => void; onReset: () => void };

export function CapabilitiesFilters({ search, status, onSearchChange, onStatusChange, onReset }: Props) {
  const hasActiveFilters = search.trim().length > 0 || status !== "all";
  return <div className="flex flex-wrap items-center gap-3">
    <Input dir="rtl" placeholder="بحث بالاسم أو المعرّف..." value={search} onChange={(event) => onSearchChange(event.target.value)} className="min-w-[180px] flex-1 text-right text-xs sm:max-w-sm" />
    <Select dir="rtl" value={status} onValueChange={(value) => onStatusChange(value as "all" | CapabilityStatus)}>
      <SelectTrigger className="w-full min-w-[140px] flex-1 text-right text-xs sm:max-w-[180px]"><SelectValue placeholder="الحالة" /></SelectTrigger>
      <SelectContent align="start" position="popper" className="text-right"><SelectItem value="all">كل الحالات</SelectItem><SelectItem value="active">نشط</SelectItem><SelectItem value="inactive">غير نشط</SelectItem></SelectContent>
    </Select>
    {hasActiveFilters ? <Button type="button" variant="outline" size="sm" className="ms-auto h-8 shrink-0 px-3 text-xs" onClick={onReset}>إعادة ضبط الفلاتر</Button> : null}
  </div>;
}
