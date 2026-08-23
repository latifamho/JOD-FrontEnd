"use client";

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

type StaffRoleDeleteDialogProps = {
  open: boolean;
  roleName: string;
  membersCount: number;
  isDeleting?: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
};

export function StaffRoleDeleteDialog({
  open,
  roleName,
  membersCount,
  isDeleting = false,
  onOpenChange,
  onConfirm,
}: StaffRoleDeleteDialogProps) {
  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (isDeleting) return;
        onOpenChange(nextOpen);
      }}
    >
      <DialogContent dir="rtl" className="sm:max-w-md">
        <DialogHeader className="pe-12 text-right sm:text-right">
          <DialogTitle>حذف الدور</DialogTitle>
          <DialogDescription>
            سيتم حذف الدور <span className="font-semibold text-foreground">{roleName}</span> من قائمة الأدوار.
            {membersCount > 0 ? " إذا كان الدور مرتبطًا بموظفين نشطين فلن يسمح النظام بحذفه." : ""}
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="sm:justify-start">
          <Button
            type="button"
            variant="outline"
            disabled={isDeleting}
            onClick={() => onOpenChange(false)}
          >
            إلغاء
          </Button>
          <Button
            type="button"
            variant="destructive"
            disabled={isDeleting}
            onClick={onConfirm}
          >
            {isDeleting ? <Loader2 className="size-4 animate-spin" /> : null}
            {isDeleting ? "جاري الحذف..." : "تأكيد الحذف"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
