"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
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
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { normalizeApiError } from "@/lib/api-errors";

const closeReportSchema = z.object({
  note: z.string().max(2000, "ملاحظة الإغلاق يجب ألا تتجاوز 2000 حرف").optional(),
});

type CloseReportFormValues = z.infer<typeof closeReportSchema>;

type CloseReportDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  reportTitle: string;
  onConfirm: (note: string) => Promise<void>;
};

export function CloseReportDialog({ open, onOpenChange, reportTitle, onConfirm }: CloseReportDialogProps) {
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm<CloseReportFormValues>({
    resolver: zodResolver(closeReportSchema),
    defaultValues: { note: "" },
  });

  React.useEffect(() => {
    if (!open) reset({ note: "" });
  }, [open, reset]);

  return (
    <Dialog open={open} onOpenChange={(nextOpen) => !isSubmitting && onOpenChange(nextOpen)}>
      <DialogContent dir="rtl" className="p-0 sm:max-w-xl">
        <form
          className="space-y-6 p-6"
          noValidate
          onSubmit={handleSubmit(async ({ note }) => {
            if (isSubmitting) return;
            setIsSubmitting(true);
            try {
              await onConfirm(note?.trim() ?? "");
              onOpenChange(false);
            } catch (error) {
              const normalized = normalizeApiError(error);
              setError("note", {
                type: "server",
                message: normalized.fieldErrors.note ?? normalized.message,
              });
            } finally {
              setIsSubmitting(false);
            }
          })}
        >
        <DialogHeader className="pe-12 text-right sm:text-right">
          <DialogTitle>إغلاق البلاغ</DialogTitle>
          <DialogDescription>يمكنك إضافة ملاحظة توضح نتيجة المعالجة قبل إغلاق البلاغ.</DialogDescription>
        </DialogHeader>
        <div className="space-y-3">
          <p className="rounded-md border border-border bg-muted/50 px-3 py-2 text-xs text-muted-foreground">البلاغ: {reportTitle}</p>
          <div className="space-y-2">
            <Label htmlFor="close-report-note">ملاحظة الإغلاق</Label>
            <Textarea
              id="close-report-note"
              maxLength={2000}
              disabled={isSubmitting}
              aria-invalid={Boolean(errors.note)}
              placeholder="اكتب ملخص الإجراء أو سبب الإغلاق (اختياري)"
              className="min-h-28 text-sm"
              {...register("note")}
            />
            {errors.note ? <p className="text-xs text-destructive">{errors.note.message}</p> : null}
          </div>
        </div>
        <DialogFooter className="sm:justify-start">
          <Button type="button" variant="outline" disabled={isSubmitting} onClick={() => onOpenChange(false)}>إلغاء</Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? <Loader2 className="size-4 animate-spin" /> : null}
            {isSubmitting ? "جاري الإغلاق..." : "تأكيد الإغلاق"}
          </Button>
        </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
