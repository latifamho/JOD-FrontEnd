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

type StaffRoleDeleteDialogProps = {
  open: boolean;
  roleName: string;
  membersCount: number;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
};

export function StaffRoleDeleteDialog({
  open,
  roleName,
  membersCount,
  onOpenChange,
  onConfirm,
}: StaffRoleDeleteDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent dir="rtl" className="sm:max-w-md">
        <DialogHeader className="pe-12 text-right sm:text-right">
          <DialogTitle>حذف الدور</DialogTitle>
          <DialogDescription>
            سيتم حذف الدور{" "}
            <span className="font-semibold text-foreground">{roleName}</span>
            {membersCount > 0
              ? `، وسيتم نقل ${membersCount} موظف إلى دور مشاهد.`
              : " من قائمة الأدوار."}
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
