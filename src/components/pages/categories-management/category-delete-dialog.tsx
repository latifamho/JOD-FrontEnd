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

type CategoryDeleteDialogProps = {
  open: boolean;
  categoryName: string;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
};

export function CategoryDeleteDialog({
  open,
  categoryName,
  onOpenChange,
  onConfirm,
}: CategoryDeleteDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent dir="rtl" className="sm:max-w-md">
        <DialogHeader className="pe-12 text-right sm:text-right">
          <DialogTitle>حذف التصنيف</DialogTitle>
          <DialogDescription>
            سيتم حذف التصنيف{" "}
            <span className="font-semibold text-foreground">{categoryName}</span> من القائمة.
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
