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
import { normalizeApiError } from "@/lib/api-errors";

type CloseReportDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  reportTitle: string;
  onConfirm: (note: string) => Promise<void>;
};

export function CloseReportDialog({ open, onOpenChange, reportTitle, onConfirm }: CloseReportDialogProps) {
  const [note, setNote] = React.useState("");
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!open) {
      setNote("");
      setErrorMessage(null);
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={(nextOpen) => !isSubmitting && onOpenChange(nextOpen)}>
      <DialogContent dir="rtl" className="sm:max-w-xl">
        <DialogHeader className="pe-12 text-right sm:text-right">
          <DialogTitle>إغلاق البلاغ</DialogTitle>
          <DialogDescription>يمكنك إضافة ملاحظة توضح نتيجة المعالجة قبل إغلاق البلاغ.</DialogDescription>
        </DialogHeader>
        <div className="space-y-3">
          <p className="rounded-md border border-border bg-muted/50 px-3 py-2 text-xs text-muted-foreground">البلاغ: {reportTitle}</p>
          <div className="space-y-2">
            <Label htmlFor="close-report-note">ملاحظة الإغلاق</Label>
            <Textarea id="close-report-note" value={note} maxLength={2000} disabled={isSubmitting} onChange={(event) => { setNote(event.target.value); setErrorMessage(null); }} placeholder="اكتب ملخص الإجراء أو سبب الإغلاق (اختياري)" className="min-h-28 text-sm" />
            {errorMessage ? <p className="text-xs text-destructive">{errorMessage}</p> : null}
          </div>
        </div>
        <DialogFooter className="sm:justify-start">
          <Button type="button" variant="outline" disabled={isSubmitting} onClick={() => onOpenChange(false)}>إلغاء</Button>
          <Button type="button" disabled={isSubmitting} onClick={async () => {
            if (isSubmitting) return;
            setIsSubmitting(true);
            setErrorMessage(null);
            try {
              await onConfirm(note.trim());
              onOpenChange(false);
            } catch (error) {
              const normalized = normalizeApiError(error);
              setErrorMessage(normalized.fieldErrors.note ?? normalized.message);
            } finally {
              setIsSubmitting(false);
            }
          }}>{isSubmitting ? "جاري الإغلاق..." : "تأكيد الإغلاق"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
