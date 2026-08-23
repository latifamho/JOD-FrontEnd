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

type DonorEntryDeleteDialogProps = {
  open: boolean;
  entryName: string;
  view: "donors" | "applicants";
  isDeleting?: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
};

export function DonorEntryDeleteDialog({
  open,
  entryName,
  view,
  isDeleting = false,
  onOpenChange,
  onConfirm,
}: DonorEntryDeleteDialogProps) {
  const label = view === "applicants" ? "المتقدم" : "المتبرع";

  return (
    <Dialog open={open} onOpenChange={(nextOpen) => !isDeleting && onOpenChange(nextOpen)}>
      <DialogContent dir="rtl" className="sm:max-w-md">
        <DialogHeader className="pe-12 text-right sm:text-right">
          <DialogTitle>حذف {label}</DialogTitle>
          <DialogDescription>
            سيتم حذف {label} <span className="font-semibold text-foreground">{entryName}</span> من القائمة الحالية.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="sm:justify-start">
          <Button type="button" variant="outline" disabled={isDeleting} onClick={() => onOpenChange(false)}>
            إلغاء
          </Button>
          <Button type="button" variant="destructive" disabled={isDeleting} onClick={onConfirm}>
            {isDeleting ? <Loader2 className="size-4 animate-spin" /> : null}
            {isDeleting ? "جاري الحذف..." : "تأكيد الحذف"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
