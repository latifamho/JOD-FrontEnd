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
import { displayOrDash } from "@/lib/text";

type DeletePostDialogProps = {
  open: boolean;
  postTitle: string;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
};

export function DeletePostDialog({
  open,
  postTitle,
  onOpenChange,
  onConfirm,
}: DeletePostDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent dir="rtl" className="sm:max-w-md">
        <DialogHeader className="pe-12 text-right sm:text-right">
          <DialogTitle>حذف البوست</DialogTitle>
          <DialogDescription>
            سيتم حذف البوست نهائيًا من القائمة الحالية ولا يمكن التراجع بعد الحذف.
          </DialogDescription>
        </DialogHeader>

        <p className="rounded-md border border-border bg-muted/50 px-3 py-2 text-xs text-muted-foreground">
          البوست: {displayOrDash(postTitle)}
        </p>

        <DialogFooter className="sm:justify-start">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            إلغاء
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={() => {
              onConfirm();
              onOpenChange(false);
            }}
          >
            تأكيد الحذف
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
