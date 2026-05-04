"use client";

import * as React from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { AppIcons } from "@/constant/icons";
import { platformSettingsDefaultsData } from "@/components/pages/platform-settings/platform-settings.data";

export function PlatformSettingsPage() {
  const [siteName, setSiteName] = React.useState(
    platformSettingsDefaultsData.siteName,
  );
  const [allowNewPosts, setAllowNewPosts] = React.useState(
    platformSettingsDefaultsData.allowNewPosts,
  );
  const [requirePostReview, setRequirePostReview] = React.useState(
    platformSettingsDefaultsData.requirePostReview,
  );

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

      <div className="space-y-6 rounded-xl border border-border bg-card p-4 shadow-sm sm:p-6">
        <div className="space-y-2">
          <Label htmlFor="site-name">اسم المنصة</Label>
          <Input
            id="site-name"
            value={siteName}
            onChange={(e) => setSiteName(e.target.value)}
            className="max-w-md text-right"
            dir="rtl"
          />
        </div>

        <div className="flex items-center justify-between rounded-lg border border-border p-4">
          <div>
            <p className="font-medium text-foreground">السماح بإنشاء منشورات جديدة</p>
            <p className="text-xs text-muted-foreground">
              عند التعطيل لن يستطيع المستخدمون إنشاء منشورات
            </p>
          </div>
          <Switch
            checked={allowNewPosts}
            onCheckedChange={setAllowNewPosts}
          />
        </div>

        <div className="flex items-center justify-between rounded-lg border border-border p-4">
          <div>
            <p className="font-medium text-foreground">مراجعة المنشورات قبل النشر</p>
            <p className="text-xs text-muted-foreground">
              كل منشور جديد يذهب إلى قائمة المراجعة
            </p>
          </div>
          <Switch
            checked={requirePostReview}
            onCheckedChange={setRequirePostReview}
          />
        </div>

        <div className="pt-2">
          <Button size="sm">
            <AppIcons.settings className="size-4" />
            حفظ الإعدادات
          </Button>
        </div>
      </div>
    </section>
  );
}
