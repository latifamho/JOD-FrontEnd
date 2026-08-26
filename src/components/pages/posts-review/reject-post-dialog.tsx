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

const rejectPostSchema = z.object({
  reason: z.string().trim().min(3, "سبب الرفض يجب أن يكون 3 أحرف على الأقل").max(1000, "سبب الرفض طويل جداً"),
});

type RejectPostFormValues = z.infer<typeof rejectPostSchema>;

export function RejectPostDialog({
  open,
  onOpenChange,
  postTitle,
  onConfirm,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  postTitle: string;
  onConfirm: (reason: string) => void;
}) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<RejectPostFormValues>({
    resolver: zodResolver(rejectPostSchema),
    defaultValues: { reason: "" },
  });

  React.useEffect(() => {
    if (!open) reset({ reason: "" });
  }, [open, reset]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent dir="rtl" className="sm:max-w-xl">
        <DialogHeader className="pe-12 text-right sm:text-right">
          <DialogTitle>رفض المنشور</DialogTitle>
          <DialogDescription>
            أدخل سبب الرفض ليظهر للمستخدم ضمن المنشور المرفوض ويصل إليه مع إشعار المراجعة.
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
            المنشور: {postTitle}
          </p>

          <div className="space-y-2">
            <Label htmlFor="post-rejection-reason">سبب الرفض</Label>
            <Textarea
              id="post-rejection-reason"
              aria-invalid={Boolean(errors.reason)}
              placeholder="مثال: يرجى توضيح تفاصيل المساعدة أو تعديل المعلومات الناقصة قبل إعادة الإرسال..."
              className="min-h-28 text-sm"
              {...register("reason")}
            />
            {errors.reason ? (
              <p className="text-xs text-destructive">{errors.reason.message}</p>
            ) : (
              <p className="text-[11px] text-muted-foreground">الحد الأدنى: 3 أحرف</p>
            )}
          </div>

          <DialogFooter className="sm:justify-start">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
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
