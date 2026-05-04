"use client";

import * as React from "react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  staffPermissionCatalog,
  staffRoleLabels,
  type StaffPermissionOption,
  type StaffRole,
} from "@/components/pages/staff-management/static-data";
import { Textarea } from "@/components/ui/textarea";

export type StaffRoleFormValues = {
  role: StaffRole;
  description: string;
  permissions: string[];
  isActive: boolean;
};

export const EMPTY_STAFF_ROLE_FORM_VALUES: StaffRoleFormValues = {
  role: "viewer",
  description: "",
  permissions: [],
  isActive: true,
};

type StaffRoleFormSheetProps = {
  open: boolean;
  mode: "create" | "edit";
  initialValues: StaffRoleFormValues;
  roleOptions: StaffRole[];
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: StaffRoleFormValues) => void;
};

function normalizePermissions(permissions: string[]): string[] {
  return Array.from(new Set(permissions.map((permission) => permission.trim()))).filter(
    (permission) => permission.length > 0,
  );
}

function comparePermissions(first: StaffPermissionOption, second: StaffPermissionOption): number {
  return first.label.localeCompare(second.label, "ar", { sensitivity: "base" });
}

export function StaffRoleFormSheet({
  open,
  mode,
  initialValues,
  roleOptions,
  onOpenChange,
  onSubmit,
}: StaffRoleFormSheetProps) {
  const [formValues, setFormValues] =
    React.useState<StaffRoleFormValues>(initialValues);
  const [selectedPermissions, setSelectedPermissions] = React.useState<string[]>(
    normalizePermissions(initialValues.permissions),
  );

  React.useEffect(() => {
    if (open) {
      setFormValues(initialValues);
      setSelectedPermissions(normalizePermissions(initialValues.permissions));
    }
  }, [initialValues, open]);

  const resolvedRoleOptions = React.useMemo(() => {
    if (roleOptions.includes(formValues.role)) {
      return roleOptions;
    }

    return [formValues.role, ...roleOptions];
  }, [formValues.role, roleOptions]);

  const permissionsTableRows = React.useMemo(() => {
    const knownPermissions = new Map(
      staffPermissionCatalog.map((permissionOption) => [
        permissionOption.label,
        permissionOption,
      ]),
    );

    const extraPermissions = selectedPermissions
      .filter((permissionLabel) => !knownPermissions.has(permissionLabel))
      .map((permissionLabel, index) => ({
        id: `permission-custom-${index}`,
        label: permissionLabel,
        description: "صلاحية مضافة مسبقاً.",
      }));

    return [...staffPermissionCatalog, ...extraPermissions].sort(comparePermissions);
  }, [selectedPermissions]);

  const togglePermission = React.useCallback((permissionLabel: string, checked: boolean) => {
    setSelectedPermissions((currentPermissions) => {
      if (checked) {
        return normalizePermissions([...currentPermissions, permissionLabel]);
      }

      return currentPermissions.filter((permission) => permission !== permissionLabel);
    });
  }, []);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        dir="rtl"
        className="w-[95vw] border-border p-0 sm:max-w-2xl"
      >
        <form
          className="flex h-full flex-col"
          onSubmit={(event) => {
            event.preventDefault();
            onSubmit({
              role: formValues.role,
              description: formValues.description.trim(),
              permissions: selectedPermissions,
              isActive: formValues.isActive,
            });
            onOpenChange(false);
          }}
        >
          <SheetHeader className="border-b border-border pe-12 text-right">
            <SheetTitle className="text-right text-lg">
              {mode === "create" ? "إضافة دور جديد" : "تعديل الدور"}
            </SheetTitle>
          </SheetHeader>

          <div className="flex-1 space-y-4 overflow-y-auto p-4">
            <div className="space-y-2">
              <Label>الدور</Label>
              <Select
                dir="rtl"
                value={formValues.role}
                disabled={mode === "edit"}
                onValueChange={(value) =>
                  setFormValues((currentValues) => ({
                    ...currentValues,
                    role: value as StaffRole,
                  }))
                }
              >
                <SelectTrigger className="w-full text-right">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent align="start" position="popper" className="text-right">
                  {resolvedRoleOptions.map((role) => (
                    <SelectItem key={role} value={role} className="text-right text-xs">
                      {staffRoleLabels[role]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>الحالة</Label>
              <Select
                dir="rtl"
                value={formValues.isActive ? "active" : "inactive"}
                onValueChange={(value) =>
                  setFormValues((currentValues) => ({
                    ...currentValues,
                    isActive: value === "active",
                  }))
                }
              >
                <SelectTrigger className="w-full text-right">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent align="start" position="popper" className="text-right">
                  <SelectItem value="active" className="text-right text-xs">
                    مفعّل
                  </SelectItem>
                  <SelectItem value="inactive" className="text-right text-xs">
                    موقّف
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="staff-role-description">وصف الدور</Label>
              <Textarea
                id="staff-role-description"
                required
                value={formValues.description}
                onChange={(event) =>
                  setFormValues((currentValues) => ({
                    ...currentValues,
                    description: event.target.value,
                  }))
                }
                placeholder="اكتب وصفاً مختصراً لهذا الدور"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between gap-2">
                <Label>الصلاحيات</Label>
                <span className="text-xs text-muted-foreground">
                  المحدد: {selectedPermissions.length}
                </span>
              </div>

              <div className="rounded-md border border-border">
                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-transparent">
                      <TableHead className="w-20 text-right font-semibold text-muted-foreground">
                        تحديد
                      </TableHead>
                      <TableHead className="text-right font-semibold text-muted-foreground">
                        الصلاحية
                      </TableHead>
                      <TableHead className="text-right font-semibold text-muted-foreground">
                        الوصف
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {permissionsTableRows.map((permissionOption) => {
                      const checked = selectedPermissions.includes(permissionOption.label);

                      return (
                        <TableRow key={permissionOption.id}>
                          <TableCell className="text-right">
                            <Checkbox
                              checked={checked}
                              onCheckedChange={(value) =>
                                togglePermission(permissionOption.label, value === true)
                              }
                            />
                          </TableCell>
                          <TableCell className="text-right text-sm font-medium">
                            {permissionOption.label}
                          </TableCell>
                          <TableCell className="text-right text-xs text-muted-foreground">
                            {permissionOption.description}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            </div>
          </div>

          <SheetFooter className="border-t border-border pt-4 sm:flex-row sm:justify-start">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              إلغاء
            </Button>
            <Button type="submit">
              {mode === "create" ? "إضافة الدور" : "حفظ التعديلات"}
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}
