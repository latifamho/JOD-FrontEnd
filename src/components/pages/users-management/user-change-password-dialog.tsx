"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
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
import { Label } from "@/components/ui/label";
import { PasswordInput } from "@/components/ui/password-input";

const changePasswordSchema = z
  .object({
    newPassword: z
      .string()
      .min(1, "كلمة المرور الجديدة مطلوبة")
      .min(8, "كلمة المرور يجب أن تكون 8 أحرف على الأقل"),
    confirmPassword: z.string().min(1, "تأكيد كلمة المرور مطلوب"),
  })
  .refine((values) => values.newPassword === values.confirmPassword, {
    message: "كلمتا المرور غير متطابقتين",
    path: ["confirmPassword"],
  });

type ChangePasswordFormValues = z.infer<typeof changePasswordSchema>;

type UserChangePasswordDialogProps = {
  open: boolean;
  userName: string;
  isSubmitting: boolean;
  errorMessage?: string | null;
  onOpenChange: (open: boolean) => void;
  onConfirm: (newPassword: string) => void;
};

export function UserChangePasswordDialog({
  open,
  userName,
  isSubmitting,
  errorMessage,
  onOpenChange,
  onConfirm,
}: UserChangePasswordDialogProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ChangePasswordFormValues>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: { newPassword: "", confirmPassword: "" },
  });

  React.useEffect(() => {
    if (!open) reset({ newPassword: "", confirmPassword: "" });
  }, [open, reset]);

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (!isSubmitting) onOpenChange(nextOpen);
      }}
    >
      <DialogContent dir="rtl" className="gap-0 p-0 sm:max-w-md">
        <form
          className="space-y-6 p-6"
          noValidate
          onSubmit={handleSubmit(({ newPassword }) => onConfirm(newPassword.trim()))}
        >
        <DialogHeader className="space-y-2 pe-12 text-right sm:text-right">
          <DialogTitle>تغيير كلمة المرور</DialogTitle>
          <DialogDescription>
            تعيين كلمة مرور جديدة للمستخدم{" "}
            <span className="font-semibold text-foreground">{userName}</span>.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="new-password">كلمة المرور الجديدة</Label>
            <PasswordInput
              id="new-password"
              autoComplete="new-password"
              disabled={isSubmitting}
              aria-invalid={Boolean(errors.newPassword)}
              placeholder="أدخل كلمة المرور الجديدة"
              {...register("newPassword")}
            />
            {errors.newPassword ? (
              <p className="text-xs text-destructive">{errors.newPassword.message}</p>
            ) : null}
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirm-password">تأكيد كلمة المرور</Label>
            <PasswordInput
              id="confirm-password"
              autoComplete="new-password"
              disabled={isSubmitting}
              aria-invalid={Boolean(errors.confirmPassword)}
              placeholder="أعد كتابة كلمة المرور"
              {...register("confirmPassword")}
            />
            {errors.confirmPassword ? (
              <p className="text-xs text-destructive">{errors.confirmPassword.message}</p>
            ) : (
              <p className="text-[11px] text-muted-foreground">
                الحد الأدنى 8 أحرف ويجب أن تتطابق القيمتان.
              </p>
            )}
          </div>
        </div>

        {errorMessage ? (
          <p className="text-xs text-destructive">{errorMessage}</p>
        ) : null}

        <DialogFooter className="gap-2 sm:justify-start">
          <Button
            type="button"
            variant="outline"
            disabled={isSubmitting}
            onClick={() => onOpenChange(false)}
          >
            إلغاء
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="size-4 animate-spin" />}
            حفظ
          </Button>
        </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
