"use client";

import * as React from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { AppIcons } from "@/constant/icons";
import {
  useAdminPlatformSettings,
  useUpdatePlatformSettings,
} from "@/features/admin/platform-settings/admin.platform-settings.query";
import { applyApiFieldErrorsToForm } from "@/lib/api-errors";

const settingsSchema = z.object({
  siteName: z.string().min(1, "اسم المنصة مطلوب"),
  allowNewPosts: z.boolean(),
  requirePostReview: z.boolean(),
});

type SettingsFormValues = z.infer<typeof settingsSchema>;

export function PlatformSettingsPage() {
  const { data, isLoading, isError, refetch } = useAdminPlatformSettings();
  const updateMutation = useUpdatePlatformSettings();

  const {
    register,
    control,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm<SettingsFormValues>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      siteName: "",
      allowNewPosts: true,
      requirePostReview: true,
    },
  });

  React.useEffect(() => {
    if (!data?.data) return;
    reset({
      siteName: data.data.siteName,
      allowNewPosts: data.data.allowNewPosts,
      requirePostReview: data.data.requirePostReview,
    });
  }, [data, reset]);

  const onSubmit = (values: SettingsFormValues) => {
    updateMutation.mutate(
      {
        siteName: values.siteName.trim(),
        allowNewPosts: values.allowNewPosts,
        requirePostReview: values.requirePostReview,
      },
      { onError: (error) => applyApiFieldErrorsToForm(error, setError) },
    );
  };

  return (
    <section className="flex flex-col flex-1 gap-6">
      <div>
        <h2 className="text-lg font-semibold text-foreground">
          الإعدادات العامة للمنصة
        </h2>
        <p className="mt-0.5 text-sm text-muted-foreground">
          إعدادات تظهر لجميع المستخدمين
        </p>
      </div>

      {isError && (
        <div className="flex items-center gap-3 rounded-md border border-destructive/30 bg-destructive/5 px-4 py-3">
          <p className="flex-1 text-sm text-destructive">
            تعذّر تحميل إعدادات المنصة. حاول مرة أخرى.
          </p>
          <Button type="button" size="sm" variant="outline" onClick={() => refetch()}>
            إعادة المحاولة
          </Button>
        </div>
      )}

      {isLoading ? (
        <div className="space-y-4 rounded-xl border border-border bg-card p-6">
          <div className="h-10 max-w-md animate-pulse rounded bg-muted" />
          <div className="h-16 animate-pulse rounded bg-muted" />
          <div className="h-16 animate-pulse rounded bg-muted" />
        </div>
      ) : (
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-6 rounded-xl border border-border bg-card p-4 shadow-sm sm:p-6"
        >
          <div className="space-y-2">
            <Label htmlFor="site-name">اسم المنصة</Label>
            <Input
              id="site-name"
              disabled={updateMutation.isPending}
              className="max-w-md text-right"
              dir="rtl"
              {...register("siteName")}
            />
            {errors.siteName ? (
              <p className="text-xs text-destructive">{errors.siteName.message}</p>
            ) : null}
          </div>

          <div className="flex items-center justify-between rounded-lg border border-border p-4">
            <div>
              <p className="font-medium text-foreground">السماح بإنشاء منشورات جديدة</p>
              <p className="text-xs text-muted-foreground">
                عند التعطيل لن يستطيع المستخدمون إنشاء منشورات
              </p>
            </div>
            <Controller
              control={control}
              name="allowNewPosts"
              render={({ field }) => (
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  disabled={updateMutation.isPending}
                />
              )}
            />
          </div>

          <div className="flex items-center justify-between rounded-lg border border-border p-4">
            <div>
              <p className="font-medium text-foreground">مراجعة المنشورات قبل النشر</p>
              <p className="text-xs text-muted-foreground">
                كل منشور جديد يذهب إلى قائمة المراجعة
              </p>
            </div>
            <Controller
              control={control}
              name="requirePostReview"
              render={({ field }) => (
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  disabled={updateMutation.isPending}
                />
              )}
            />
          </div>

          <div className="flex items-center gap-3 pt-2">
            <Button
              size="sm"
              type="submit"
              disabled={updateMutation.isPending}
            >
              {updateMutation.isPending ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <AppIcons.settings className="size-4" />
              )}
              حفظ الإعدادات
            </Button>
          </div>
        </form>
      )}
    </section>
  );
}
