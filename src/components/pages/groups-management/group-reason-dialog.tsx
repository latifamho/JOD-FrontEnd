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

const MIN_REASON_LENGTH = 3;
const MAX_REASON_LENGTH = 1000;

const reasonSchema = z.object({
  reason: z
    .string()
    .trim()
    .min(MIN_REASON_LENGTH, `السبب يجب أن يكون ${MIN_REASON_LENGTH} أحرف على الأقل`)
    .max(MAX_REASON_LENGTH, "السبب طويل جداً"),
});

type ReasonFormValues = z.infer<typeof reasonSchema>;

type GroupReasonDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Dialog heading, e.g. "رفض المجموعة". */
  title: string;
  /** Explains where the reason ends up, so the reviewer writes for that reader. */
  description: string;
  groupName: string;
  fieldLabel: string;
  placeholder: string;
  confirmLabel: string;
  onConfirm: (reason: string) => void;
};

/**
 * Reject and suspend ask for the exact same thing — a required, reader-facing
 * reason — so they share one dialog instead of two near-identical copies.
 */
export function GroupReasonDialog({
  open,
  onOpenChange,
  title,
  description,
  groupName,
  fieldLabel,
  placeholder,
  confirmLabel,
  onConfirm,
}: GroupReasonDialogProps) {
  const fieldId = React.useId();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ReasonFormValues>({
    resolver: zodResolver(reasonSchema),
    defaultValues: { reason: "" },
  });

  React.useEffect(() => {
    if (!open) reset({ reason: "" });
  }, [open, reset]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent dir="rtl" className="sm:max-w-xl">
        <DialogHeader className="pe-12 text-right sm:text-right">
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
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
            المجموعة: {groupName}
          </p>

          <div className="space-y-2">
            <Label htmlFor={fieldId}>{fieldLabel}</Label>
            <Textarea
              id={fieldId}
              aria-invalid={Boolean(errors.reason)}
              placeholder={placeholder}
              className="min-h-28 text-sm"
              {...register("reason")}
            />
            {errors.reason ? (
              <p className="text-xs text-destructive">{errors.reason.message}</p>
            ) : (
              <p className="text-[11px] text-muted-foreground">
                الحد الأدنى: {MIN_REASON_LENGTH} أحرف
              </p>
            )}
          </div>

          <DialogFooter className="sm:justify-start">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              إلغاء
            </Button>
            <Button type="submit" variant="destructive">
              {confirmLabel}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
