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

type DeleteGroupDialogProps = {
  open: boolean;
  groupName: string;
  membersCount: number;
  isDeleting: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
};

export function DeleteGroupDialog({
  open,
  groupName,
  membersCount,
  isDeleting,
  onOpenChange,
  onConfirm,
}: DeleteGroupDialogProps) {
  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (!isDeleting) onOpenChange(nextOpen);
      }}
    >
      <DialogContent dir="rtl" className="sm:max-w-md">
        <DialogHeader className="pe-12 text-right sm:text-right">
          <DialogTitle>حذف المجموعة</DialogTitle>
          <DialogDescription>
            سيتم حذف المجموعة{" "}
            <span className="font-semibold text-foreground">{groupName}</span> ومنشوراتها
            وعضويّاتها نهائياً. لا يمكن التراجع عن هذا الإجراء.
          </DialogDescription>
        </DialogHeader>

        {membersCount > 0 ? (
          <p className="rounded-md border border-destructive/35 bg-destructive/5 px-3 py-2 text-xs text-destructive">
            المجموعة فيها {membersCount} عضواً سيفقدون الوصول إليها فوراً. إذا كان الهدف
            إيقافها مؤقتاً فاستخدم «تعليق المجموعة» بدل الحذف.
          </p>
        ) : null}

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
            {isDeleting && <Loader2 className="size-4 animate-spin" />}
            تأكيد الحذف
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
