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

type OrganizationDeleteDialogProps = {
  open: boolean;
  organizationName: string;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
};

export function OrganizationDeleteDialog({
  open,
  organizationName,
  onOpenChange,
  onConfirm,
}: OrganizationDeleteDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent dir="rtl" className="sm:max-w-md">
        <DialogHeader className="pe-12 text-right sm:text-right">
          <DialogTitle>حذف المنظمة</DialogTitle>
          <DialogDescription>
            سيتم حذف المنظمة{" "}
            <span className="font-semibold text-foreground">{organizationName}</span>{" "}
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
