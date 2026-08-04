"use client";

import * as React from "react";
import { useQueryDisclosure } from "@/hooks/use-query-modal";
import { Controller, useForm, type Path } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
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
import { PasswordInput } from "@/components/ui/password-input";
import {
  getUserType,
  normalizeUserStatus,
  userRoleLabels,
  userStatusLabels,
  type UserRole,
  type UserStatus,
} from "@/components/pages/users-management/users-management.types";

const userRoleValues = ["general", "volunteer", "job_seeker", "donor"] as const;
const userStatusValues = ["active", "inactive"] as const;

const editUserSchema = z.object({
  name: z.string().min(1, "الاسم مطلوب"),
  email: z
    .string()
    .min(1, "البريد الإلكتروني مطلوب")
    .email("البريد الإلكتروني غير صحيح"),
  phone: z.string().min(1, "رقم الهاتف مطلوب"),
  role: z.enum(userRoleValues),
  status: z.enum(userStatusValues),
  password: z.string().optional(),
  passwordConfirmation: z.string().optional(),
});

const createUserSchema = editUserSchema
  .extend({
    password: z
      .string()
      .min(1, "كلمة المرور مطلوبة")
      .min(8, "كلمة المرور يجب أن تكون 8 أحرف على الأقل"),
    passwordConfirmation: z.string().min(1, "تأكيد كلمة المرور مطلوب"),
  })
  .refine((data) => data.password === data.passwordConfirmation, {
    message: "كلمتا المرور غير متطابقتين",
    path: ["passwordConfirmation"],
  });

export type UserFormValues = {
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  status: UserStatus;
  password?: string;
  passwordConfirmation?: string;
};

export const EMPTY_USER_FORM_VALUES: UserFormValues = {
  name: "",
  email: "",
  phone: "",
  role: "general",
  status: "active",
  password: "",
  passwordConfirmation: "",
};

export function normalizeUserRole(role: string | null | undefined): UserRole {
  return getUserType({ userType: role as UserRole | undefined });
}

type UserFormSheetProps = {
  open: boolean;
  mode: "create" | "edit";
  initialValues: UserFormValues;
  isSubmitting: boolean;
  isLoadingDetails?: boolean;
  emailError: string | null;
  apiFieldErrors?: Partial<Record<keyof UserFormValues, string>>;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: UserFormValues) => void;
};

export function UserFormSheet({
  open,
  mode,
  initialValues,
  isSubmitting,
  isLoadingDetails = false,
  emailError,
  apiFieldErrors,
  onOpenChange,
  onSubmit,
}: UserFormSheetProps) {
  const [discardDialogOpen, setDiscardDialogOpen] = useQueryDisclosure("user-discard-changes", { queryKey: "dialog" });

  const schema = mode === "create" ? createUserSchema : editUserSchema;

  const {
    register,
    handleSubmit,
    control,
    reset,
    setError,
    clearErrors,
    formState: { errors, isDirty },
  } = useForm<UserFormValues>({
    resolver: zodResolver(schema),
    defaultValues: EMPTY_USER_FORM_VALUES,
  });

  React.useEffect(() => {
    if (!open) return;
    reset({
      name: initialValues.name,
      email: initialValues.email,
      phone: initialValues.phone,
      role: normalizeUserRole(initialValues.role),
      status: normalizeUserStatus(initialValues.status),
      password: initialValues.password ?? "",
      passwordConfirmation: initialValues.passwordConfirmation ?? "",
    });
  }, [initialValues, open, reset, mode]);

  React.useEffect(() => {
    if (!apiFieldErrors) return;
    Object.entries(apiFieldErrors).forEach(([field, message]) => {
      if (message) {
        setError(field as Path<UserFormValues>, { type: "server", message });
      }
    });
  }, [apiFieldErrors, setError]);

  React.useEffect(() => {
    if (!open) clearErrors();
  }, [clearErrors, open]);

  const showDiscardPrompt = mode === "edit" && isDirty && !isLoadingDetails;

  const closeSheetSafely = React.useCallback(() => {
    if (isSubmitting || isLoadingDetails) return;
    if (showDiscardPrompt) {
      setDiscardDialogOpen(true);
      return;
    }
    onOpenChange(false);
  }, [isSubmitting, isLoadingDetails, showDiscardPrompt, onOpenChange]);

  const onValidSubmit = (values: UserFormValues) => {
    onSubmit({
      name: values.name.trim(),
      email: values.email.trim(),
      phone: values.phone.trim(),
      role: normalizeUserRole(values.role),
      status: normalizeUserStatus(values.status),
      ...(mode === "create" && {
        password: values.password?.trim(),
        passwordConfirmation: values.passwordConfirmation?.trim(),
      }),
    });
  };

  const fieldsDisabled = isSubmitting || isLoadingDetails;

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
            key={`${mode}-${open ? "open" : "closed"}`}
            className="flex h-full flex-col"
            onSubmit={handleSubmit(onValidSubmit)}
            autoComplete="off"
          >
            <SheetHeader className="border-b border-border pe-12 text-right">
              <SheetTitle className="text-right text-lg">
                {mode === "create" ? "إضافة مستخدم" : "تعديل المستخدم"}
              </SheetTitle>
            </SheetHeader>

            {isLoadingDetails ? (
              <div className="flex flex-1 items-center justify-center p-8">
                <Loader2 className="size-8 animate-spin text-muted-foreground" />
              </div>
            ) : (
              <div className="flex-1 space-y-4 overflow-y-auto p-4">
                <div className="space-y-2">
                  <Label htmlFor="user-name">الاسم الكامل</Label>
                  <Input
                    id="user-name"
                    disabled={fieldsDisabled}
                    placeholder="أدخل اسم المستخدم"
                    {...register("name")}
                  />
                  {errors.name ? (
                    <p className="text-xs text-destructive">{errors.name.message}</p>
                  ) : null}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="user-email">البريد الإلكتروني</Label>
                  <Input
                    id="user-email"
                    type="email"
                    autoComplete="off"
                    disabled={fieldsDisabled}
                    placeholder="name@example.com"
                    {...register("email")}
                  />
                  {errors.email ? (
                    <p className="text-xs text-destructive">{errors.email.message}</p>
                  ) : null}
                  {emailError ? (
                    <p className="text-xs text-destructive">{emailError}</p>
                  ) : null}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="user-phone">رقم الهاتف</Label>
                  <Input
                    id="user-phone"
                    disabled={fieldsDisabled}
                    placeholder="+9665XXXXXXXX"
                    {...register("phone")}
                  />
                  {errors.phone ? (
                    <p className="text-xs text-destructive">{errors.phone.message}</p>
                  ) : null}
                </div>

                {mode === "create" && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="user-password">كلمة المرور</Label>
                      <PasswordInput
                        id="user-password"
                        autoComplete="new-password"
                        disabled={fieldsDisabled}
                        placeholder="أدخل كلمة المرور"
                        {...register("password")}
                      />
                      {errors.password ? (
                        <p className="text-xs text-destructive">
                          {errors.password.message}
                        </p>
                      ) : (
                        <p className="text-[11px] text-muted-foreground">
                          الحد الأدنى 8 أحرف.
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="user-password-confirmation">
                        تأكيد كلمة المرور
                      </Label>
                      <PasswordInput
                        id="user-password-confirmation"
                        autoComplete="new-password"
                        disabled={fieldsDisabled}
                        placeholder="أعد كتابة كلمة المرور"
                        {...register("passwordConfirmation")}
                      />
                      {errors.passwordConfirmation ? (
                        <p className="text-xs text-destructive">
                          {errors.passwordConfirmation.message}
                        </p>
                      ) : null}
                    </div>
                  </>
                )}

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>الدور</Label>
                    <Controller
                      name="role"
                      control={control}
                      render={({ field }) => (
                        <Select
                          dir="rtl"
                          disabled={fieldsDisabled}
                          value={normalizeUserRole(field.value)}
                          onValueChange={(value) =>
                            field.onChange(normalizeUserRole(value))
                          }
                        >
                          <SelectTrigger className="w-full text-right">
                            <SelectValue placeholder="اختر الدور" />
                          </SelectTrigger>
                          <SelectContent
                            align="start"
                            position="popper"
                            className="text-right"
                          >
                            {Object.entries(userRoleLabels).map(([role, label]) => (
                              <SelectItem
                                key={role}
                                value={role}
                                className="text-right text-xs"
                              >
                                {label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                    {errors.role ? (
                      <p className="text-xs text-destructive">
                        {errors.role.message ?? "الدور مطلوب"}
                      </p>
                    ) : null}
                  </div>

                  <div className="space-y-2">
                    <Label>حالة الحساب</Label>
                    <Controller
                      name="status"
                      control={control}
                      render={({ field }) => (
                        <Select
                          dir="rtl"
                          disabled={fieldsDisabled}
                          value={normalizeUserStatus(field.value)}
                          onValueChange={(value) =>
                            field.onChange(normalizeUserStatus(value))
                          }
                        >
                          <SelectTrigger className="w-full text-right">
                            <SelectValue placeholder="اختر الحالة" />
                          </SelectTrigger>
                          <SelectContent
                            align="start"
                            position="popper"
                            className="text-right"
                          >
                            {Object.entries(userStatusLabels).map(
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
                      )}
                    />
                    {errors.status ? (
                      <p className="text-xs text-destructive">
                        {errors.status.message ?? "الحالة مطلوبة"}
                      </p>
                    ) : null}
                  </div>
                </div>
              </div>
            )}

            <SheetFooter className="border-t border-border pt-4 sm:flex-row sm:justify-start">
              <Button
                type="button"
                variant="outline"
                disabled={fieldsDisabled}
                onClick={closeSheetSafely}
              >
                إلغاء
              </Button>
              <Button type="submit" disabled={fieldsDisabled}>
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
