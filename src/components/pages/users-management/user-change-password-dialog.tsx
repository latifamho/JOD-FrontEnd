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
import { Label } from "@/components/ui/label";
import { PasswordInput } from "@/components/ui/password-input";

type UserChangePasswordDialogProps = {
  open: boolean;
  userName: string;
  isSubmitting: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (newPassword: string) => void;
};

export function UserChangePasswordDialog({
  open,
  userName,
  isSubmitting,
  onOpenChange,
  onConfirm,
}: UserChangePasswordDialogProps) {
  const [newPassword, setNewPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");

  React.useEffect(() => {
    if (!open) {
      setNewPassword("");
      setConfirmPassword("");
    }
  }, [open]);

  const canSubmit =
    newPassword.trim().length >= 8 && newPassword === confirmPassword;

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (!isSubmitting) onOpenChange(nextOpen);
      }}
    >
      <DialogContent dir="rtl" className="gap-6 sm:max-w-md">
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
              value={newPassword}
              onChange={(event) => setNewPassword(event.target.value)}
              placeholder="أدخل كلمة المرور الجديدة"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirm-password">تأكيد كلمة المرور</Label>
            <PasswordInput
              id="confirm-password"
              autoComplete="new-password"
              disabled={isSubmitting}
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              placeholder="أعد كتابة كلمة المرور"
            />
            <p className="text-[11px] text-muted-foreground">
              الحد الأدنى 8 أحرف ويجب أن تتطابق القيمتان.
            </p>
          </div>
        </div>

        <DialogFooter className="gap-2 sm:justify-start">
          <Button
            type="button"
            variant="outline"
            disabled={isSubmitting}
            onClick={() => onOpenChange(false)}
          >
            إلغاء
          </Button>
          <Button
            type="button"
            disabled={!canSubmit || isSubmitting}
            onClick={() => onConfirm(newPassword.trim())}
          >
            {isSubmitting && <Loader2 className="size-4 animate-spin" />}
            حفظ
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
