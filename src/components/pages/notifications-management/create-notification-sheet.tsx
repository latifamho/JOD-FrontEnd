"use client";

import * as React from "react";

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
} from "@/components/pages/notifications-management/static-data";

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
};

export function CreateNotificationSheet({
  open,
  onOpenChange,
  onSubmit,
}: CreateNotificationSheetProps) {
  const [formValues, setFormValues] = React.useState<CreateNotificationValues>(
    EMPTY_VALUES,
  );

  React.useEffect(() => {
    if (!open) {
      setFormValues(EMPTY_VALUES);
    }
  }, [open]);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        dir="rtl"
        className="w-[95vw] border-border p-0 sm:max-w-lg"
      >
        <form
          className="flex h-full flex-col"
          onSubmit={(event) => {
            event.preventDefault();
            onSubmit({
              title: formValues.title.trim(),
              body: formValues.body.trim(),
              category: formValues.category,
              recipientScope: formValues.recipientScope,
              recipientLabel: formValues.recipientLabel.trim(),
            });
            onOpenChange(false);
          }}
        >
          <SheetHeader className="border-b border-border pe-12 text-right">
            <SheetTitle className="text-right text-lg">إرسال إشعار جديد</SheetTitle>
          </SheetHeader>

          <div className="flex-1 space-y-4 overflow-y-auto p-4">
            <div className="space-y-2">
              <Label htmlFor="notification-title">العنوان</Label>
              <Input
                id="notification-title"
                required
                value={formValues.title}
                onChange={(event) =>
                  setFormValues((currentValues) => ({
                    ...currentValues,
                    title: event.target.value,
                  }))
                }
                placeholder="اكتب عنوان الإشعار"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="notification-body">المحتوى</Label>
              <Textarea
                id="notification-body"
                required
                rows={5}
                value={formValues.body}
                onChange={(event) =>
                  setFormValues((currentValues) => ({
                    ...currentValues,
                    body: event.target.value,
                  }))
                }
                placeholder="اكتب نص الإشعار"
              />
            </div>

            <div className="space-y-2">
              <Label>نوع الإشعار</Label>
              <Select
                dir="rtl"
                value={formValues.category}
                onValueChange={(value) =>
                  setFormValues((currentValues) => ({
                    ...currentValues,
                    category: value as NotificationCategory,
                  }))
                }
              >
                <SelectTrigger className="w-full text-right">
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
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>نوع المستلم</Label>
                <Select
                  dir="rtl"
                  value={formValues.recipientScope}
                  onValueChange={(value) =>
                    setFormValues((currentValues) => ({
                      ...currentValues,
                      recipientScope: value as NotificationRecipientScope,
                    }))
                  }
                >
                  <SelectTrigger className="w-full text-right">
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
              </div>

              <div className="space-y-2">
                <Label htmlFor="recipient-label">اسم المستلم</Label>
                <Input
                  id="recipient-label"
                  required
                  value={formValues.recipientLabel}
                  onChange={(event) =>
                    setFormValues((currentValues) => ({
                      ...currentValues,
                      recipientLabel: event.target.value,
                    }))
                  }
                  placeholder="مثال: جمعية الخير الطبية"
                />
              </div>
            </div>
          </div>

          <SheetFooter className="border-t border-border pt-4 sm:flex-row sm:justify-start">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              إلغاء
            </Button>
            <Button type="submit">إرسال الإشعار</Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}
