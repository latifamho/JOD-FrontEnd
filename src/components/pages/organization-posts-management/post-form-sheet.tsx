"use client";

import * as React from "react";
import { useQueryDisclosure } from "@/hooks/use-query-modal";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
  organizationPostStatusLabels,
  organizationPostTypeLabels,
  type OrganizationPostStatus,
  type OrganizationPostType,
} from "@/components/pages/organization-posts-management/static-data";
import { isCampaignRelatedPostType } from "@/components/pages/organization-posts-management/helpers";

export type PostFormValues = {
  title: string;
  summary: string;
  type: OrganizationPostType;
  status: OrganizationPostStatus;
  authorName: string;
  location: string;
  campaignTitle: string;
};

export const EMPTY_POST_FORM_VALUES: PostFormValues = {
  title: "",
  summary: "",
  type: "general",
  status: "draft",
  authorName: "",
  location: "",
  campaignTitle: "",
};

type PostFormSheetProps = {
  open: boolean;
  mode: "create" | "edit";
  initialValues: PostFormValues;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: PostFormValues) => void;
};

function areValuesEqual(first: PostFormValues, second: PostFormValues): boolean {
  return (
    first.title === second.title &&
    first.summary === second.summary &&
    first.type === second.type &&
    first.status === second.status &&
    first.authorName === second.authorName &&
    first.location === second.location &&
    first.campaignTitle === second.campaignTitle
  );
}

export function PostFormSheet({
  open,
  mode,
  initialValues,
  onOpenChange,
  onSubmit,
}: PostFormSheetProps) {
  const [formValues, setFormValues] = React.useState<PostFormValues>(initialValues);
  const [discardDialogOpen, setDiscardDialogOpen] = useQueryDisclosure(
    "post-discard-changes",
    { queryKey: "dialog", permission: "org.posts.create" },
  );

  React.useEffect(() => {
    if (open) {
      setFormValues(initialValues);
    }
  }, [initialValues, open]);

  const isDirty = mode === "edit" && !areValuesEqual(formValues, initialValues);
  const campaignRelated = isCampaignRelatedPostType(formValues.type);

  const closeSheetSafely = React.useCallback(() => {
    if (isDirty) {
      setDiscardDialogOpen(true);
      return;
    }

    onOpenChange(false);
  }, [isDirty, onOpenChange]);

  return (
    <>
      <Sheet
        open={open}
        onOpenChange={(nextOpen) => {
          if (nextOpen) {
            onOpenChange(true);
            return;
          }
          closeSheetSafely();
        }}
      >
        <SheetContent side="right" dir="rtl" className="w-[95vw] border-border p-0 sm:max-w-xl">
          <form
            className="flex h-full flex-col"
            onSubmit={(event) => {
              event.preventDefault();
              onSubmit({
                title: formValues.title.trim(),
                summary: formValues.summary.trim(),
                type: formValues.type,
                status: formValues.status,
                authorName: formValues.authorName.trim(),
                location: formValues.location.trim(),
                campaignTitle: campaignRelated ? formValues.campaignTitle.trim() : "",
              });
              onOpenChange(false);
            }}
          >
            <SheetHeader className="border-b border-border pe-12 text-right">
              <SheetTitle className="text-right text-lg">
                {mode === "create" ? "إضافة بوست جديد" : "تعديل البوست"}
              </SheetTitle>
            </SheetHeader>

            <div className="flex-1 space-y-4 overflow-y-auto p-4">
              <div className="space-y-2">
                <Label htmlFor="post-title">عنوان البوست</Label>
                <Input
                  id="post-title"
                  required
                  value={formValues.title}
                  onChange={(event) =>
                    setFormValues((currentValues) => ({
                      ...currentValues,
                      title: event.target.value,
                    }))
                  }
                  placeholder="أدخل عنوان البوست"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="post-summary">محتوى مختصر</Label>
                <Textarea
                  id="post-summary"
                  required
                  value={formValues.summary}
                  onChange={(event) =>
                    setFormValues((currentValues) => ({
                      ...currentValues,
                      summary: event.target.value,
                    }))
                  }
                  placeholder="اكتب ملخص محتوى البوست"
                  className="min-h-30 text-sm"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>نوع البوست</Label>
                  <Select
                    dir="rtl"
                    value={formValues.type}
                    onValueChange={(value) =>
                      setFormValues((currentValues) => ({
                        ...currentValues,
                        type: value as OrganizationPostType,
                      }))
                    }
                  >
                    <SelectTrigger className="w-full text-right">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent align="start" position="popper" className="text-right">
                      {Object.entries(organizationPostTypeLabels).map(([type, label]) => (
                        <SelectItem key={type} value={type} className="text-right text-xs">
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>الحالة</Label>
                  <Select
                    dir="rtl"
                    value={formValues.status}
                    onValueChange={(value) =>
                      setFormValues((currentValues) => ({
                        ...currentValues,
                        status: value as OrganizationPostStatus,
                      }))
                    }
                  >
                    <SelectTrigger className="w-full text-right">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent align="start" position="popper" className="text-right">
                      {Object.entries(organizationPostStatusLabels).map(
                        ([status, label]) => (
                          <SelectItem key={status} value={status} className="text-right text-xs">
                            {label}
                          </SelectItem>
                        ),
                      )}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="post-author">الكاتب</Label>
                  <Input
                    id="post-author"
                    required
                    value={formValues.authorName}
                    onChange={(event) =>
                      setFormValues((currentValues) => ({
                        ...currentValues,
                        authorName: event.target.value,
                      }))
                    }
                    placeholder="اسم الموظف أو المالك"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="post-location">الموقع</Label>
                  <Input
                    id="post-location"
                    required
                    value={formValues.location}
                    onChange={(event) =>
                      setFormValues((currentValues) => ({
                        ...currentValues,
                        location: event.target.value,
                      }))
                    }
                    placeholder="المدينة"
                  />
                </div>
              </div>

              {campaignRelated && (
                <div className="space-y-2">
                  <Label htmlFor="post-campaign">الحملة المرتبطة</Label>
                  <Input
                    id="post-campaign"
                    required
                    value={formValues.campaignTitle}
                    onChange={(event) =>
                      setFormValues((currentValues) => ({
                        ...currentValues,
                        campaignTitle: event.target.value,
                      }))
                    }
                    placeholder="اسم الحملة المرتبطة"
                  />
                </div>
              )}
            </div>

            <SheetFooter className="border-t border-border pt-4 sm:flex-row sm:justify-start">
              <Button type="button" variant="outline" onClick={closeSheetSafely}>
                إلغاء
              </Button>
              <Button type="submit">
                {mode === "create" ? "إضافة البوست" : "حفظ التعديلات"}
              </Button>
            </SheetFooter>
          </form>
        </SheetContent>
      </Sheet>

      <Dialog open={discardDialogOpen} onOpenChange={setDiscardDialogOpen}>
        <DialogContent dir="rtl" className="sm:max-w-md">
          <DialogHeader className="pe-12 text-right sm:text-right">
            <DialogTitle>تجاهل التعديلات؟</DialogTitle>
            <DialogDescription>
              لديك تغييرات غير محفوظة، هل تريد إغلاق نموذج التعديل دون حفظ؟
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="sm:justify-start">
            <Button type="button" variant="outline" onClick={() => setDiscardDialogOpen(false)}>
              متابعة التعديل
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={() => {
                setDiscardDialogOpen(false);
                onOpenChange(false);
              }}
            >
              تجاهل التغييرات
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
