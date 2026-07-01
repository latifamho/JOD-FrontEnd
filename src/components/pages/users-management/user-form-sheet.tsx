"use client";

import * as React from "react";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
  userRoleLabels,
  userStatusLabels,
  type UserRole,
  type UserStatus,
} from "@/components/pages/users-management/static-data";

export type UserFormValues = {
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  status: UserStatus;
};

export const EMPTY_USER_FORM_VALUES: UserFormValues = {
  name: "",
  email: "",
  phone: "",
  role: "general",
  status: "active",
};

type UserFormSheetProps = {
  open: boolean;
  mode: "create" | "edit";
  initialValues: UserFormValues;
  isSubmitting: boolean;
  emailError: string | null;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: UserFormValues) => void;
};

function areValuesEqual(first: UserFormValues, second: UserFormValues): boolean {
  return (
    first.name === second.name &&
    first.email === second.email &&
    first.phone === second.phone &&
    first.role === second.role &&
    first.status === second.status
  );
}

export function UserFormSheet({
  open,
  mode,
  initialValues,
  isSubmitting,
  emailError,
  onOpenChange,
  onSubmit,
}: UserFormSheetProps) {
  const [formValues, setFormValues] = React.useState<UserFormValues>(initialValues);
  const [localEmailError, setLocalEmailError] = React.useState<string | null>(null);
  const [discardDialogOpen, setDiscardDialogOpen] = React.useState(false);

  React.useEffect(() => {
    if (open) {
      setFormValues(initialValues);
      setLocalEmailError(null);
    }
  }, [initialValues, open]);

  React.useEffect(() => {
    setLocalEmailError(emailError);
  }, [emailError]);

  const isDirty = mode === "edit" && !areValuesEqual(formValues, initialValues);

  const closeSheetSafely = React.useCallback(() => {
    if (isSubmitting) return;
    if (isDirty) {
      setDiscardDialogOpen(true);
      return;
    }
    onOpenChange(false);
  }, [isDirty, isSubmitting, onOpenChange]);

  return (
    <>
      <Sheet
        open={open}
        onOpenChange={(nextOpen) => {
          if (nextOpen) {
            onOpenChange(true);
            return;
          }
          closeSheetSafely();
        }}
      >
        <SheetContent side="right" dir="rtl" className="w-[95vw] border-border p-0 sm:max-w-lg">
          <form
            className="flex h-full flex-col"
            onSubmit={(event) => {
              event.preventDefault();
              onSubmit({
                name: formValues.name.trim(),
                email: formValues.email.trim(),
                phone: formValues.phone.trim(),
                role: formValues.role,
                status: formValues.status,
              });
            }}
          >
            <SheetHeader className="border-b border-border pe-12 text-right">
              <SheetTitle className="text-right text-lg">
                {mode === "create" ? "إضافة مستخدم" : "تعديل المستخدم"}
              </SheetTitle>
            </SheetHeader>

            <div className="flex-1 space-y-4 overflow-y-auto p-4">
              <div className="space-y-2">
                <Label htmlFor="user-name">الاسم الكامل</Label>
                <Input
                  id="user-name"
                  required
                  disabled={isSubmitting}
                  value={formValues.name}
                  onChange={(event) =>
                    setFormValues((currentValues) => ({
                      ...currentValues,
                      name: event.target.value,
                    }))
                  }
                  placeholder="أدخل اسم المستخدم"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="user-email">البريد الإلكتروني</Label>
                <Input
                  id="user-email"
                  type="email"
                  required
                  disabled={isSubmitting}
                  value={formValues.email}
                  onChange={(event) => {
                    setFormValues((currentValues) => ({
                      ...currentValues,
                      email: event.target.value,
                    }));
                    if (localEmailError) setLocalEmailError(null);
                  }}
                  placeholder="name@example.com"
                />
                {localEmailError && (
                  <p className="text-xs text-destructive">{localEmailError}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="user-phone">رقم الهاتف</Label>
                <Input
                  id="user-phone"
                  required
                  disabled={isSubmitting}
                  value={formValues.phone}
                  onChange={(event) =>
                    setFormValues((currentValues) => ({
                      ...currentValues,
                      phone: event.target.value,
                    }))
                  }
                  placeholder="+9665XXXXXXXX"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>الدور</Label>
                  <Select
                    dir="rtl"
                    disabled={isSubmitting}
                    value={formValues.role}
                    onValueChange={(value) =>
                      setFormValues((currentValues) => ({
                        ...currentValues,
                        role: value as UserRole,
                      }))
                    }
                  >
                    <SelectTrigger className="w-full text-right">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent align="start" position="popper" className="text-right">
                      {Object.entries(userRoleLabels).map(([role, label]) => (
                        <SelectItem key={role} value={role} className="text-right text-xs">
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>حالة الحساب</Label>
                  <Select
                    dir="rtl"
                    disabled={isSubmitting}
                    value={formValues.status}
                    onValueChange={(value) =>
                      setFormValues((currentValues) => ({
                        ...currentValues,
                        status: value as UserStatus,
                      }))
                    }
                  >
                    <SelectTrigger className="w-full text-right">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent align="start" position="popper" className="text-right">
                      {Object.entries(userStatusLabels).map(([status, label]) => (
                        <SelectItem key={status} value={status} className="text-right text-xs">
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <SheetFooter className="border-t border-border pt-4 sm:flex-row sm:justify-start">
              <Button
                type="button"
                variant="outline"
                disabled={isSubmitting}
                onClick={closeSheetSafely}
              >
                إلغاء
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="size-4 animate-spin" />}
                {mode === "create" ? "إضافة" : "حفظ التعديلات"}
              </Button>
            </SheetFooter>
          </form>
        </SheetContent>
      </Sheet>

      <Dialog open={discardDialogOpen} onOpenChange={setDiscardDialogOpen}>
        <DialogContent dir="rtl" className="sm:max-w-md">
          <DialogHeader className="pe-12 text-right sm:text-right">
            <DialogTitle>تجاهل التعديلات؟</DialogTitle>
            <DialogDescription>
              لديك تغييرات غير محفوظة. هل تريد إغلاق نافذة التعديل بدون حفظ؟
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="sm:justify-start">
            <Button
              type="button"
              variant="outline"
              onClick={() => setDiscardDialogOpen(false)}
            >
              متابعة التعديل
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={() => {
                setDiscardDialogOpen(false);
                onOpenChange(false);
              }}
            >
              تجاهل التغييرات
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
