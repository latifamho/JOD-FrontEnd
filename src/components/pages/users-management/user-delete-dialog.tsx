"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type UserDeleteDialogProps = {
  open: boolean;
  userName: string;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
};

export function UserDeleteDialog({
  open,
  userName,
  onOpenChange,
  onConfirm,
}: UserDeleteDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent dir="rtl" className="sm:max-w-md">
        <DialogHeader className="pe-12 text-right sm:text-right">
          <DialogTitle>حذف المستخدم</DialogTitle>
          <DialogDescription>
            سيتم حذف المستخدم{" "}
            <span className="font-semibold text-foreground">{userName}</span>{" "}
            من القائمة الحالية.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="sm:justify-start">
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            إلغاء
          </Button>
          <Button type="button" variant="destructive" onClick={onConfirm}>
            تأكيد الحذف
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
