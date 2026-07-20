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

type RequestInfoDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  reportTitle: string;
  onConfirm: (note: string) => void;
};

export function RequestInfoDialog({
  open,
  onOpenChange,
  reportTitle,
  onConfirm,
}: RequestInfoDialogProps) {
  const [note, setNote] = React.useState("");

  React.useEffect(() => {
    if (!open) {
      setNote("");
    }
  }, [open]);

  const canSubmit = note.trim().length > 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent dir="rtl" className="sm:max-w-xl">
        <DialogHeader className="pe-12 text-right sm:text-right">
          <DialogTitle>نقل البلاغ لبانتظار الرد</DialogTitle>
          <DialogDescription>
            أدخل ملاحظة توضح المعلومات المطلوبة من الجهة المعنية بالبلاغ.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3">
          <p className="rounded-md border border-border bg-muted/50 px-3 py-2 text-xs text-muted-foreground">
            البلاغ: {reportTitle}
          </p>

          <div className="space-y-2">
            <Label htmlFor="request-info-note">الملاحظة</Label>
            <Textarea
              id="request-info-note"
              value={note}
              onChange={(event) => setNote(event.target.value)}
              placeholder="مثال: يرجى تزويدنا بمستندات إضافية للتحقق من الحالة..."
              className="min-h-28 text-sm"
            />
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
            disabled={!canSubmit}
            onClick={() => {
              if (!canSubmit) {
                return;
              }
              onConfirm(note.trim());
              onOpenChange(false);
            }}
          >
            تأكيد
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
