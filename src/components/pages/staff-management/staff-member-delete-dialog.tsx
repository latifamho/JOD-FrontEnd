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

type StaffMemberDeleteDialogProps = {
  open: boolean;
  staffName: string;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
};

export function StaffMemberDeleteDialog({
  open,
  staffName,
  onOpenChange,
  onConfirm,
}: StaffMemberDeleteDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent dir="rtl" className="sm:max-w-md">
        <DialogHeader className="pe-12 text-right sm:text-right">
          <DialogTitle>حذف الموظف</DialogTitle>
          <DialogDescription>
            سيتم حذف الموظف{" "}
            <span className="font-semibold text-foreground">{staffName}</span> من قائمة
            الموظفين.
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
