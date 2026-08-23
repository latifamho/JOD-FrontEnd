"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

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

const rejectCampaignSchema = z.object({
  reason: z.string().trim().min(8, "سبب الرفض يجب أن يكون 8 أحرف على الأقل"),
});

type RejectCampaignFormValues = z.infer<typeof rejectCampaignSchema>;

type RejectCampaignDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  campaignTitle: string;
  onConfirm: (reason: string) => void;
};

export function RejectCampaignDialog({
  open,
  onOpenChange,
  campaignTitle,
  onConfirm,
}: RejectCampaignDialogProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<RejectCampaignFormValues>({
    resolver: zodResolver(rejectCampaignSchema),
    defaultValues: { reason: "" },
  });

  React.useEffect(() => {
    if (!open) reset({ reason: "" });
  }, [open, reset]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent dir="rtl" className="sm:max-w-xl">
        <DialogHeader className="pe-12 text-right sm:text-right">
          <DialogTitle>رفض الحملة</DialogTitle>
          <DialogDescription>
            أدخل سبب الرفض ليظهر للجهة الناشرة ضمن إشعار المراجعة.
          </DialogDescription>
        </DialogHeader>

        <form
          className="space-y-3"
          noValidate
          onSubmit={handleSubmit(({ reason }) => {
            onConfirm(reason.trim());
            onOpenChange(false);
          })}
        >
          <p className="rounded-md border border-border bg-muted/50 px-3 py-2 text-xs text-muted-foreground">
            الحملة: {campaignTitle}
          </p>

          <div className="space-y-2">
            <Label htmlFor="campaign-rejection-reason">سبب الرفض</Label>
            <Textarea
              id="campaign-rejection-reason"
              aria-invalid={Boolean(errors.reason)}
              placeholder="مثال: يرجى إرفاق خطة تنفيذ أو مستندات توثيقية قبل إعادة الإرسال..."
              className="min-h-28 text-sm"
              {...register("reason")}
            />
            {errors.reason ? (
              <p className="text-xs text-destructive">{errors.reason.message}</p>
            ) : (
              <p className="text-[11px] text-muted-foreground">الحد الأدنى: 8 أحرف</p>
            )}
          </div>

        <DialogFooter className="sm:justify-start">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            إلغاء
          </Button>
          <Button type="submit" variant="destructive">
            تأكيد الرفض
          </Button>
        </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
