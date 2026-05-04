"use client";

import * as React from "react";

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
  organizationStatusLabels,
  organizationVerificationLabels,
  type OrganizationStatus,
  type OrganizationVerificationStatus,
} from "@/components/pages/organizations-management/static-data";

export type OrganizationFormValues = {
  name: string;
  email: string;
  phone: string;
  location: string;
  status: OrganizationStatus;
  verificationStatus: OrganizationVerificationStatus;
};

export const EMPTY_ORGANIZATION_FORM_VALUES: OrganizationFormValues = {
  name: "",
  email: "",
  phone: "",
  location: "",
  status: "active",
  verificationStatus: "unverified",
};

type OrganizationFormSheetProps = {
  open: boolean;
  mode: "create" | "edit";
  initialValues: OrganizationFormValues;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: OrganizationFormValues) => void;
};

function areValuesEqual(
  first: OrganizationFormValues,
  second: OrganizationFormValues,
): boolean {
  return (
    first.name === second.name &&
    first.email === second.email &&
    first.phone === second.phone &&
    first.location === second.location &&
    first.status === second.status &&
    first.verificationStatus === second.verificationStatus
  );
}

export function OrganizationFormSheet({
  open,
  mode,
  initialValues,
  onOpenChange,
  onSubmit,
}: OrganizationFormSheetProps) {
  const [formValues, setFormValues] = React.useState<OrganizationFormValues>(
    initialValues,
  );
  const [discardDialogOpen, setDiscardDialogOpen] = React.useState(false);

  React.useEffect(() => {
    if (open) {
      setFormValues(initialValues);
    }
  }, [initialValues, open]);

  const isDirty = mode === "edit" && !areValuesEqual(formValues, initialValues);

  const closeSheetSafely = React.useCallback(() => {
    if (isDirty) {
      setDiscardDialogOpen(true);
      return;
    }
    onOpenChange(false);
  }, [isDirty, onOpenChange]);

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
                phone: formValues.phone.trim(),
                location: formValues.location.trim(),
                status: formValues.status,
                verificationStatus: formValues.verificationStatus,
              });
              onOpenChange(false);
            }}
          >
            <SheetHeader className="border-b border-border pe-12 text-right">
              <SheetTitle className="text-right text-lg">
                {mode === "create" ? "إضافة منظمة" : "تعديل المنظمة"}
              </SheetTitle>
            </SheetHeader>

            <div className="flex-1 space-y-4 overflow-y-auto p-4">
              <div className="space-y-2">
                <Label htmlFor="organization-name">اسم المنظمة</Label>
                <Input
                  id="organization-name"
                  required
                  value={formValues.name}
                  onChange={(event) =>
                    setFormValues((currentValues) => ({
                      ...currentValues,
                      name: event.target.value,
                    }))
                  }
                  placeholder="أدخل اسم المنظمة"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="organization-email">البريد الإلكتروني</Label>
                <Input
                  id="organization-email"
                  type="email"
                  required
                  value={formValues.email}
                  onChange={(event) =>
                    setFormValues((currentValues) => ({
                      ...currentValues,
                      email: event.target.value,
                    }))
                  }
                  placeholder="org@example.com"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="organization-phone">رقم الجوال</Label>
                <Input
                  id="organization-phone"
                  required
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

              <div className="space-y-2">
                <Label htmlFor="organization-location">الموقع</Label>
                <Input
                  id="organization-location"
                  required
                  value={formValues.location}
                  onChange={(event) =>
                    setFormValues((currentValues) => ({
                      ...currentValues,
                      location: event.target.value,
                    }))
                  }
                  placeholder="مثال: الرياض"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>حالة الحساب</Label>
                  <Select
                    dir="rtl"
                    value={formValues.status}
                    onValueChange={(value) =>
                      setFormValues((currentValues) => ({
                        ...currentValues,
                        status: value as OrganizationStatus,
                      }))
                    }
                  >
                    <SelectTrigger className="w-full text-right">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent
                      align="start"
                      position="popper"
                      className="text-right"
                    >
                      {Object.entries(organizationStatusLabels).map(
                        ([status, label]) => (
                          <SelectItem
                            key={status}
                            value={status}
                            className="text-right text-xs"
                          >
                            {label}
                          </SelectItem>
                        ),
                      )}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>حالة التوثيق</Label>
                  <Select
                    dir="rtl"
                    value={formValues.verificationStatus}
                    onValueChange={(value) =>
                      setFormValues((currentValues) => ({
                        ...currentValues,
                        verificationStatus: value as OrganizationVerificationStatus,
                      }))
                    }
                  >
                    <SelectTrigger className="w-full text-right">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent
                      align="start"
                      position="popper"
                      className="text-right"
                    >
                      {Object.entries(organizationVerificationLabels).map(
                        ([status, label]) => (
                          <SelectItem
                            key={status}
                            value={status}
                            className="text-right text-xs"
                          >
                            {label}
                          </SelectItem>
                        ),
                      )}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <SheetFooter className="border-t border-border pt-4 sm:flex-row sm:justify-start">
              <Button type="button" variant="outline" onClick={closeSheetSafely}>
                إلغاء
              </Button>
              <Button type="submit">
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
