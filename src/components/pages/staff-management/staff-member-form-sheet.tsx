"use client";

import * as React from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  staffRoleLabels,
  type StaffRole,
} from "@/components/pages/staff-management/static-data";

export type StaffMemberFormValues = {
  name: string;
  email: string;
  role: StaffRole;
};

export const EMPTY_STAFF_MEMBER_FORM_VALUES: StaffMemberFormValues = {
  name: "",
  email: "",
  role: "viewer",
};

type StaffMemberFormSheetProps = {
  open: boolean;
  mode: "create" | "edit";
  initialValues: StaffMemberFormValues;
  roleOptions: StaffRole[];
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: StaffMemberFormValues) => void;
};

export function StaffMemberFormSheet({
  open,
  mode,
  initialValues,
  roleOptions,
  onOpenChange,
  onSubmit,
}: StaffMemberFormSheetProps) {
  const [formValues, setFormValues] =
    React.useState<StaffMemberFormValues>(initialValues);

  React.useEffect(() => {
    if (open) {
      setFormValues(initialValues);
    }
  }, [initialValues, open]);

  const resolvedRoleOptions = React.useMemo(() => {
    if (roleOptions.includes(formValues.role)) {
      return roleOptions;
    }

    return [formValues.role, ...roleOptions];
  }, [formValues.role, roleOptions]);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        dir="rtl"
        className="w-[95vw] border-border p-0 sm:max-w-lg"
      >
        <form
          className="flex h-full flex-col"
          onSubmit={(event) => {
            event.preventDefault();
            onSubmit({
              name: formValues.name.trim(),
              email: formValues.email.trim(),
              role: formValues.role,
            });
            onOpenChange(false);
          }}
        >
          <SheetHeader className="border-b border-border pe-12 text-right">
            <SheetTitle className="text-right text-lg">
              {mode === "create" ? "إضافة موظف جديد" : "تعديل بيانات الموظف"}
            </SheetTitle>
          </SheetHeader>

          <div className="flex-1 space-y-4 overflow-y-auto p-4">
            <div className="space-y-2">
              <Label htmlFor="staff-member-name">اسم الموظف</Label>
              <Input
                id="staff-member-name"
                required
                value={formValues.name}
                onChange={(event) =>
                  setFormValues((currentValues) => ({
                    ...currentValues,
                    name: event.target.value,
                  }))
                }
                placeholder="أدخل اسم الموظف"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="staff-member-email">البريد الإلكتروني</Label>
              <Input
                id="staff-member-email"
                type="email"
                required
                value={formValues.email}
                onChange={(event) =>
                  setFormValues((currentValues) => ({
                    ...currentValues,
                    email: event.target.value,
                  }))
                }
                placeholder="name@example.com"
              />
            </div>

            <div className="space-y-2">
              <Label>الدور</Label>
              <Select
                dir="rtl"
                value={formValues.role}
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
          </div>

          <SheetFooter className="border-t border-border pt-4 sm:flex-row sm:justify-start">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              إلغاء
            </Button>
            <Button type="submit">
              {mode === "create" ? "إضافة الموظف" : "حفظ التعديلات"}
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}
