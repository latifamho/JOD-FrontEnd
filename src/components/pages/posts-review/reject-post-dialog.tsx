"use client";

import * as React from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

type RejectPostDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  postTitle: string;
  onConfirm: (reason: string) => void;
};

export function RejectPostDialog({
  open,
  onOpenChange,
  postTitle,
  onConfirm,
}: RejectPostDialogProps) {
  const [reason, setReason] = React.useState("");

  React.useEffect(() => {
    if (!open) {
      setReason("");
    }
  }, [open]);

  const canSubmit = reason.trim().length >= 8;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent dir="rtl" className="sm:max-w-xl">
        <DialogHeader className="pe-12 text-right sm:text-right">
          <DialogTitle>رفض المنشور</DialogTitle>
          <DialogDescription>
            أدخل سبب الرفض ليظهر للجهة الناشرة ضمن إشعار المراجعة.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3">
          <p className="rounded-md border border-border bg-muted/50 px-3 py-2 text-xs text-muted-foreground">
            المنشور: {postTitle}
          </p>

          <div className="space-y-2">
            <Label htmlFor="rejection-reason">سبب الرفض</Label>
            <Textarea
              id="rejection-reason"
              value={reason}
              onChange={(event) => setReason(event.target.value)}
              placeholder="مثال: يرجى إضافة تفاصيل أو مرفقات توثيقية قبل إعادة الإرسال..."
              className="min-h-28 text-sm"
            />
            <p className="text-[11px] text-muted-foreground">الحد الأدنى: 8 أحرف</p>
          </div>
        </div>

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
            disabled={!canSubmit}
            onClick={() => {
              if (!canSubmit) {
                return;
              }
              onConfirm(reason.trim());
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
