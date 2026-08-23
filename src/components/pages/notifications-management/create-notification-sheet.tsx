"use client";

import * as React from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import {
  notificationCategoryLabels,
  notificationRecipientScopeLabels,
  type NotificationCategory,
  type NotificationRecipientScope,
} from "@/components/pages/notifications-management/notifications-management.types";

const categoryValues = ["campaign", "post", "account", "report", "system"] as const;
const recipientScopeValues = ["all", "users", "organizations"] as const;

const createNotificationSchema = z.object({
  title: z.string().trim().min(1, "عنوان الإشعار مطلوب"),
  body: z.string().trim().min(1, "محتوى الإشعار مطلوب"),
  category: z.enum(categoryValues),
  recipientScope: z.enum(recipientScopeValues),
  recipientLabel: z.string().trim().min(1, "اسم المستلم مطلوب"),
});

export type CreateNotificationValues = {
  title: string;
  body: string;
  category: NotificationCategory;
  recipientScope: NotificationRecipientScope;
  recipientLabel: string;
};

const EMPTY_VALUES: CreateNotificationValues = {
  title: "",
  body: "",
  category: "system",
  recipientScope: "all",
  recipientLabel: "جميع المستخدمين",
};

type CreateNotificationSheetProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: CreateNotificationValues) => void;
  isSubmitting?: boolean;
};

export function CreateNotificationSheet({
  open,
  onOpenChange,
  onSubmit,
  isSubmitting = false,
}: CreateNotificationSheetProps) {
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateNotificationValues>({
    resolver: zodResolver(createNotificationSchema),
    defaultValues: EMPTY_VALUES,
  });

  React.useEffect(() => {
    if (!open) reset(EMPTY_VALUES);
  }, [open, reset]);

  return (
    <Sheet open={open} onOpenChange={(nextOpen) => !isSubmitting && onOpenChange(nextOpen)}>
      <SheetContent
        side="right"
        dir="rtl"
        className="w-[95vw] border-border p-0 sm:max-w-lg"
      >
        <form
          className="flex h-full flex-col"
          noValidate
          onSubmit={handleSubmit((values) => {
            onSubmit({
              title: values.title.trim(),
              body: values.body.trim(),
              category: values.category,
              recipientScope: values.recipientScope,
              recipientLabel: values.recipientLabel.trim(),
            });
          })}
        >
          <SheetHeader className="border-b border-border pe-12 text-right">
            <SheetTitle className="text-right text-lg">إرسال إشعار جديد</SheetTitle>
          </SheetHeader>

          <div className="flex-1 space-y-4 overflow-y-auto p-4">
            <div className="space-y-2">
              <Label htmlFor="notification-title">العنوان</Label>
              <Input
                id="notification-title"
                disabled={isSubmitting}
                aria-invalid={Boolean(errors.title)}
                placeholder="اكتب عنوان الإشعار"
                {...register("title")}
              />
              {errors.title ? (
                <p className="text-xs text-destructive">{errors.title.message}</p>
              ) : null}
            </div>

            <div className="space-y-2">
              <Label htmlFor="notification-body">المحتوى</Label>
              <Textarea
                id="notification-body"
                disabled={isSubmitting}
                aria-invalid={Boolean(errors.body)}
                rows={5}
                placeholder="اكتب نص الإشعار"
                {...register("body")}
              />
              {errors.body ? (
                <p className="text-xs text-destructive">{errors.body.message}</p>
              ) : null}
            </div>

            <div className="space-y-2">
              <Label>نوع الإشعار</Label>
              <Controller
                control={control}
                name="category"
                render={({ field }) => (
                  <Select
                    dir="rtl"
                    disabled={isSubmitting}
                    value={field.value}
                    onValueChange={field.onChange}
                  >
                    <SelectTrigger
                      className="w-full text-right"
                      aria-invalid={Boolean(errors.category)}
                    >
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent align="start" position="popper" className="text-right">
                      {Object.entries(notificationCategoryLabels).map(([category, label]) => (
                        <SelectItem key={category} value={category} className="text-right text-xs">
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>نوع المستلم</Label>
                <Controller
                  control={control}
                  name="recipientScope"
                  render={({ field }) => (
                    <Select
                      dir="rtl"
                      disabled={isSubmitting}
                      value={field.value}
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger
                        className="w-full text-right"
                        aria-invalid={Boolean(errors.recipientScope)}
                      >
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent align="start" position="popper" className="text-right">
                        {Object.entries(notificationRecipientScopeLabels).map(([scope, label]) => (
                          <SelectItem key={scope} value={scope} className="text-right text-xs">
                            {label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="recipient-label">اسم المستلم</Label>
                <Input
                  id="recipient-label"
                  disabled={isSubmitting}
                  aria-invalid={Boolean(errors.recipientLabel)}
                  placeholder="مثال: جمعية الخير الطبية"
                  {...register("recipientLabel")}
                />
                {errors.recipientLabel ? (
                  <p className="text-xs text-destructive">{errors.recipientLabel.message}</p>
                ) : null}
              </div>
            </div>
          </div>

          <SheetFooter className="border-t border-border pt-4 sm:flex-row sm:justify-start">
            <Button
              type="button"
              variant="outline"
              disabled={isSubmitting}
              onClick={() => onOpenChange(false)}
            >
              إلغاء
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? <Loader2 className="size-4 animate-spin" /> : null}
              إرسال الإشعار
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}
