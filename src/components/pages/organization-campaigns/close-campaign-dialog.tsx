"use client";

import * as React from "react";
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

type CloseCampaignDialogProps = {
  open: boolean;
  campaignTitle: string;
  isClosing: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (reason: string) => void;
};

export function CloseCampaignDialog({
  open,
  campaignTitle,
  isClosing,
  onOpenChange,
  onConfirm,
}: CloseCampaignDialogProps) {
  const [reason, setReason] = React.useState("");

  const canSubmit = reason.trim().length >= 8;

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (!isClosing) onOpenChange(nextOpen);
      }}
    >
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
              disabled={isClosing}
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
            disabled={isClosing}
            onClick={() => onOpenChange(false)}
          >
            إلغاء
          </Button>
          <Button
            type="button"
            variant="destructive"
            disabled={!canSubmit || isClosing}
            onClick={() => {
              if (!canSubmit || isClosing) {
                return;
              }
              onConfirm(reason.trim());
            }}
          >
            {isClosing && <Loader2 className="size-4 animate-spin" />}
            {isClosing ? "جاري الإغلاق..." : "تأكيد الإغلاق"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
