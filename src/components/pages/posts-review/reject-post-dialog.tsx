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

export function RejectPostDialog({
  open,
  onOpenChange,
  postTitle,
  onConfirm,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  postTitle: string;
  onConfirm: () => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent dir="rtl" className="sm:max-w-lg">
        <DialogHeader className="pe-12 text-right sm:text-right">
          <DialogTitle>رفض المنشور</DialogTitle>
          <DialogDescription>
            سيتم تغيير حالة المنشور إلى مرفوض وإشعار الناشر. لا يتطلب مسار المراجعة الحالي إدخال سبب رفض.
          </DialogDescription>
        </DialogHeader>
        <p className="rounded-md border border-border bg-muted/50 px-3 py-2 text-sm text-foreground">
          المنشور: {postTitle}
        </p>
        <DialogFooter className="sm:justify-start">
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
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
            تأكيد الرفض
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
