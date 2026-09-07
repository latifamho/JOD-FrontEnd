"use client";

import * as React from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2 } from "lucide-react";

import { FormLoadingSkeleton } from "@/components/shared";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import type { OrgPermissionCatalogItem } from "@/features/org/staff/org.staff.types";
import { cn } from "@/lib/utils";

const staffRoleFormSchema = z.object({
  name: z
    .string()
    .min(1, "اسم الدور مطلوب")
    .max(255, "اسم الدور يجب ألا يتجاوز 255 حرفًا")
    .refine((value) => value.trim().length > 0, "اسم الدور مطلوب"),
  description: z.string().max(1000, "الوصف يجب ألا يتجاوز 1000 حرف"),
  permissions: z.array(z.string()),
  isActive: z.boolean(),
});

export type StaffRoleFormValues = z.infer<typeof staffRoleFormSchema>;

export const EMPTY_STAFF_ROLE_FORM_VALUES: StaffRoleFormValues = {
  name: "",
  description: "",
  permissions: [],
  isActive: true,
};

type PermissionGroup = {
  group: string;
  permissions: OrgPermissionCatalogItem[];
};

function getPermissionDisplayName(option: OrgPermissionCatalogItem) {
  return option.name?.trim() || option.label?.trim() || option.id;
}

function groupPermissionsByGroup(options: OrgPermissionCatalogItem[]): PermissionGroup[] {
  const groups = new Map<string, OrgPermissionCatalogItem[]>();

  for (const option of options) {
    const groupName = option.group?.trim() || "أخرى";
    const existing = groups.get(groupName);
    if (existing) {
      existing.push(option);
    } else {
      groups.set(groupName, [option]);
    }
  }

  return Array.from(groups.entries()).map(([group, permissions]) => ({
    group,
    permissions,
  }));
}

function togglePermissionSelection(
  current: string[],
  option: OrgPermissionCatalogItem,
  checked: boolean,
  catalog: OrgPermissionCatalogItem[],
) {
  if (checked) {
    const next = new Set(current);
    next.add(option.id);
    for (const requiredId of option.requires ?? []) {
      next.add(requiredId);
    }
    return Array.from(next);
  }

  const dependentIds = new Set(
    catalog
      .filter((item) => (item.requires ?? []).includes(option.id))
      .map((item) => item.id),
  );

  return current.filter((permissionId) => permissionId !== option.id && !dependentIds.has(permissionId));
}

type Props = {
  open: boolean;
  mode: "create" | "edit";
  initialValues: StaffRoleFormValues;
  permissionOptions: OrgPermissionCatalogItem[];
  isLoadingDetails?: boolean;
  isSubmitting?: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: StaffRoleFormValues) => void;
};

export function StaffRoleFormSheet({
  open,
  mode,
  initialValues,
  permissionOptions,
  isLoadingDetails = false,
  isSubmitting = false,
  onOpenChange,
  onSubmit,
}: Props) {
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<StaffRoleFormValues>({
    resolver: zodResolver(staffRoleFormSchema),
    defaultValues: initialValues,
  });

  React.useEffect(() => {
    if (open && !isLoadingDetails) {
      reset(initialValues);
    }
  }, [initialValues, isLoadingDetails, open, reset]);

  const permissionGroups = React.useMemo(
    () => groupPermissionsByGroup(permissionOptions),
    [permissionOptions],
  );

  const isFormLocked = isLoadingDetails || isSubmitting;

  return (
    <Sheet
      open={open}
      onOpenChange={(nextOpen) => {
        if (isSubmitting) return;
        onOpenChange(nextOpen);
      }}
    >
      <SheetContent side="right" dir="rtl" className="w-[95vw] border-border p-0 sm:max-w-2xl">
        <form
          noValidate
          className="flex h-full flex-col"
          onSubmit={handleSubmit((values) =>
            onSubmit({
              name: values.name.trim(),
              description: values.description?.trim() ?? "",
              permissions: values.permissions,
              isActive: values.isActive,
            }),
          )}
        >
          <SheetHeader className="border-b border-border pe-12 text-right">
            <SheetTitle className="text-right text-lg">
              {mode === "create" ? "إضافة دور" : "تعديل الدور"}
            </SheetTitle>
          </SheetHeader>

          <div className="flex-1 space-y-4 overflow-y-auto p-4">
            {isLoadingDetails ? (
              <FormLoadingSkeleton count={5} />
            ) : (
              <>
                <div className="space-y-2">
                  <Label htmlFor="role-name">اسم الدور</Label>
                  <Input
                    id="role-name"
                    disabled={isFormLocked}
                    aria-invalid={Boolean(errors.name)}
                    placeholder="أدخل اسم الدور"
                    {...register("name")}
                  />
                  {errors.name ? <p className="text-xs text-destructive">{errors.name.message}</p> : null}
                </div>

                <div className="flex items-center justify-between gap-4 rounded-md border border-border p-3">
                  <div className="space-y-1">
                    <Label htmlFor="role-active">الحالة</Label>
                    <p className="text-xs text-muted-foreground">فعّل أو أوقف هذا الدور.</p>
                  </div>
                  <Controller
                    control={control}
                    name="isActive"
                    render={({ field }) => (
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">
                          {field.value ? "مفعّل" : "موقّف"}
                        </span>
                        <Switch
                          id="role-active"
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          disabled={isFormLocked}
                        />
                      </div>
                    )}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="role-description">الوصف</Label>
                  <Textarea
                    id="role-description"
                    disabled={isFormLocked}
                    aria-invalid={Boolean(errors.description)}
                    placeholder="وصف مختصر للدور"
                    {...register("description")}
                  />
                  {errors.description ? (
                    <p className="text-xs text-destructive">{errors.description.message}</p>
                  ) : null}
                </div>

                <div className="space-y-2">
                  <Label>الصلاحيات</Label>
                  <Controller
                    control={control}
                    name="permissions"
                    render={({ field }) =>
                      permissionGroups.length === 0 ? (
                        <div className="rounded-md border border-dashed border-border px-3 py-6 text-center text-sm text-muted-foreground">
                          لا توجد صلاحيات متاحة حاليًا.
                        </div>
                      ) : (
                        <Accordion
                          type="multiple"
                          defaultValue={[]}
                          className="rounded-md border border-border px-3"
                        >
                          {permissionGroups.map(({ group, permissions }) => {
                            const selectedCount = permissions.filter((option) =>
                              field.value.includes(option.id),
                            ).length;
                            const allSelected =
                              selectedCount === permissions.length && permissions.length > 0;
                            const someSelected = selectedCount > 0 && !allSelected;

                            return (
                              <AccordionItem key={group} value={group}>
                                <AccordionTrigger className="py-3 hover:no-underline">
                                  <div className="flex min-w-0 flex-1 items-center gap-3 text-right">
                                    <Checkbox
                                      disabled={isFormLocked}
                                      checked={
                                        allSelected ? true : someSelected ? "indeterminate" : false
                                      }
                                      onClick={(event) => event.stopPropagation()}
                                      onCheckedChange={(nextChecked) => {
                                        const groupIds = permissions.map((option) => option.id);
                                        if (nextChecked === true) {
                                          const next = new Set(field.value);
                                          for (const option of permissions) {
                                            next.add(option.id);
                                            for (const requiredId of option.requires ?? []) {
                                              next.add(requiredId);
                                            }
                                          }
                                          field.onChange(Array.from(next));
                                          return;
                                        }

                                        const groupIdSet = new Set(groupIds);
                                        field.onChange(
                                          field.value.filter(
                                            (permissionId) => !groupIdSet.has(permissionId),
                                          ),
                                        );
                                      }}
                                      aria-label={`تحديد كل صلاحيات ${group}`}
                                    />
                                    <div className="min-w-0 flex-1">
                                      <p className="truncate text-sm font-medium">{group}</p>
                                      <p className="text-xs font-normal text-muted-foreground">
                                        {selectedCount} من {permissions.length} محددة
                                      </p>
                                    </div>
                                  </div>
                                </AccordionTrigger>
                                <AccordionContent className="pb-3">
                                  <ul className="divide-y divide-border rounded-md border border-border">
                                    {permissions.map((option) => {
                                      const checked = field.value.includes(option.id);
                                      const displayName = getPermissionDisplayName(option);

                                      return (
                                        <li key={option.id}>
                                          <label
                                            className={cn(
                                              "flex cursor-pointer items-start gap-3 px-3 py-2.5 transition-colors",
                                              checked ? "bg-primary/5" : "hover:bg-muted/30",
                                              isFormLocked && "cursor-not-allowed opacity-70",
                                            )}
                                          >
                                            <Checkbox
                                              disabled={isFormLocked}
                                              checked={checked}
                                              className="mt-0.5"
                                              onCheckedChange={(nextChecked) => {
                                                field.onChange(
                                                  togglePermissionSelection(
                                                    field.value,
                                                    option,
                                                    nextChecked === true,
                                                    permissionOptions,
                                                  ),
                                                );
                                              }}
                                            />
                                            <span className="min-w-0 flex-1 space-y-0.5">
                                              <span className="block text-sm font-medium leading-5">
                                                {displayName}
                                              </span>
                                              {option.description ? (
                                                <span className="block text-xs leading-5 text-muted-foreground">
                                                  {option.description}
                                                </span>
                                              ) : null}
                                            </span>
                                          </label>
                                        </li>
                                      );
                                    })}
                                  </ul>
                                </AccordionContent>
                              </AccordionItem>
                            );
                          })}
                        </Accordion>
                      )
                    }
                  />
                  {errors.permissions ? (
                    <p className="text-xs text-destructive">{errors.permissions.message}</p>
                  ) : null}
                </div>
              </>
            )}
          </div>

          <SheetFooter className="border-t border-border pt-4 sm:flex-row sm:justify-start">
            <Button
              type="button"
              variant="outline"
              disabled={isSubmitting}
              onClick={() => onOpenChange(false)}
            >
              إلغاء
            </Button>
            <Button type="submit" disabled={isFormLocked}>
              {isSubmitting ? <Loader2 className="size-4 animate-spin" /> : null}
              {isSubmitting ? "جاري الحفظ..." : mode === "create" ? "إضافة" : "حفظ"}
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}
