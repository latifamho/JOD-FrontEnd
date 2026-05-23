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

type CloseCampaignDialogProps = {
  open: boolean;
  campaignTitle: string;
  onOpenChange: (open: boolean) => void;
  onConfirm: (reason: string) => void;
};

export function CloseCampaignDialog({
  open,
  campaignTitle,
  onOpenChange,
  onConfirm,
}: CloseCampaignDialogProps) {
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
          <DialogTitle>إغلاق الحملة</DialogTitle>
          <DialogDescription>
            أدخل سبب الإغلاق ليظهر في سجل الحملة الداخلي.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3">
          <p className="rounded-md border border-border bg-muted/50 px-3 py-2 text-xs text-muted-foreground">
            الحملة: {campaignTitle}
          </p>

          <div className="space-y-2">
            <Label htmlFor="campaign-close-reason">سبب الإغلاق</Label>
            <Textarea
              id="campaign-close-reason"
              value={reason}
              onChange={(event) => setReason(event.target.value)}
              placeholder="مثال: تم إغلاق الحملة بعد انتهاء المدة وعدم توفر موارد إضافية..."
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
            تأكيد الإغلاق
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
