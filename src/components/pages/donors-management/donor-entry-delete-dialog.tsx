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

type DonorEntryDeleteDialogProps = {
  open: boolean;
  entryName: string;
  view: "donors" | "applicants";
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
};

export function DonorEntryDeleteDialog({
  open,
  entryName,
  view,
  onOpenChange,
  onConfirm,
}: DonorEntryDeleteDialogProps) {
  const label = view === "applicants" ? "المتقدم" : "المتبرع";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent dir="rtl" className="sm:max-w-md">
        <DialogHeader className="pe-12 text-right sm:text-right">
          <DialogTitle>حذف {label}</DialogTitle>
          <DialogDescription>
            سيتم حذف {label}{" "}
            <span className="font-semibold text-foreground">{entryName}</span>{" "}
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

