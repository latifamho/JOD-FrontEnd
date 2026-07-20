"use client";

import * as React from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { AppIcons } from "@/constant/icons";
import { platformAccountDefaultsData } from "@/components/pages/platform-settings/platform-settings.data";
import {
  useAdminPlatformSettings,
  useUpdatePlatformSettings,
} from "@/features/admin/platform-settings/admin.platform-settings.query";

export function PlatformSettingsPage() {
  const { data, isLoading, isError, refetch } = useAdminPlatformSettings();
  const updateMutation = useUpdatePlatformSettings();

  const [siteName, setSiteName] = React.useState("");
  const [allowNewPosts, setAllowNewPosts] = React.useState(true);
  const [requirePostReview, setRequirePostReview] = React.useState(true);

  React.useEffect(() => {
    if (!data?.data) {
      return;
    }
    setSiteName(data.data.siteName);
    setAllowNewPosts(data.data.allowNewPosts);
    setRequirePostReview(data.data.requirePostReview);
  }, [data]);

  const [accountName, setAccountName] = React.useState(
    platformAccountDefaultsData.accountName,
  );
  const [accountEmail, setAccountEmail] = React.useState(
    platformAccountDefaultsData.accountEmail,
  );
  const [accountPhone, setAccountPhone] = React.useState(
    platformAccountDefaultsData.accountPhone,
  );
  const [recoveryEmail, setRecoveryEmail] = React.useState(
    platformAccountDefaultsData.recoveryEmail,
  );
  const [twoFactorEnabled, setTwoFactorEnabled] = React.useState(
    platformAccountDefaultsData.twoFactorEnabled,
  );
  const [newPassword, setNewPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [bankName, setBankName] = React.useState(
    platformAccountDefaultsData.bankName,
  );
  const [bankAccountNumber, setBankAccountNumber] = React.useState(
    platformAccountDefaultsData.bankAccountNumber,
  );
  const [iban, setIban] = React.useState(platformAccountDefaultsData.iban);

  const handleSave = () => {
    updateMutation.mutate({ siteName, allowNewPosts, requirePostReview });
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

      <div className="space-y-6 rounded-xl border border-border bg-card p-4 shadow-sm sm:p-6">
        <div className="space-y-2">
          <Label htmlFor="site-name">اسم المنصة</Label>
          <Input
            id="site-name"
            value={siteName}
            onChange={(e) => setSiteName(e.target.value)}
            disabled={isLoading}
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
            disabled={isLoading}
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
            disabled={isLoading}
          />
        </div>

        <div className="space-y-4 rounded-lg border border-border p-4">
          <h3 className="text-sm font-semibold text-foreground">معلومات الحساب</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="admin-account-name">الاسم</Label>
              <Input
                id="admin-account-name"
                value={accountName}
                onChange={(e) => setAccountName(e.target.value)}
                className="text-right"
                dir="rtl"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="admin-account-email">البريد الإلكتروني</Label>
              <Input
                id="admin-account-email"
                type="email"
                value={accountEmail}
                onChange={(e) => setAccountEmail(e.target.value)}
                className="text-right"
                dir="rtl"
              />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="admin-account-phone">رقم الجوال</Label>
              <Input
                id="admin-account-phone"
                value={accountPhone}
                onChange={(e) => setAccountPhone(e.target.value)}
                className="max-w-md text-right"
                dir="ltr"
              />
            </div>
          </div>
        </div>

        <div className="space-y-4 rounded-lg border border-border p-4">
          <h3 className="text-sm font-semibold text-foreground">أمان الحساب</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="admin-recovery-email">بريد الاسترداد</Label>
              <Input
                id="admin-recovery-email"
                type="email"
                value={recoveryEmail}
                onChange={(e) => setRecoveryEmail(e.target.value)}
                className="max-w-md text-right"
                dir="rtl"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="admin-new-password">كلمة مرور جديدة</Label>
              <Input
                id="admin-new-password"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="max-w-md"
                dir="ltr"
                placeholder="********"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="admin-confirm-password">تأكيد كلمة المرور</Label>
              <Input
                id="admin-confirm-password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="max-w-md"
                dir="ltr"
                placeholder="********"
              />
            </div>
          </div>
        </div>

        <div className="space-y-4 rounded-lg border border-border p-4">
          <h3 className="text-sm font-semibold text-foreground">الحساب البنكي</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="admin-bank-name">اسم البنك</Label>
              <Input
                id="admin-bank-name"
                value={bankName}
                onChange={(e) => setBankName(e.target.value)}
                className="text-right"
                dir="rtl"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="admin-bank-account-number">رقم الحساب البنكي</Label>
              <Input
                id="admin-bank-account-number"
                value={bankAccountNumber}
                onChange={(e) => setBankAccountNumber(e.target.value)}
                className="text-right font-mono"
                dir="ltr"
              />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="admin-iban">رقم الآيبان</Label>
              <Input
                id="admin-iban"
                value={iban}
                onChange={(e) => setIban(e.target.value)}
                className="max-w-md text-right font-mono"
                dir="ltr"
              />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 pt-2">
          <Button
            size="sm"
            type="button"
            onClick={handleSave}
            disabled={isLoading || updateMutation.isPending}
          >
            <AppIcons.settings className="size-4" />
            حفظ الإعدادات
          </Button>
          {updateMutation.isSuccess && (
            <p className="text-xs text-emerald-600 dark:text-emerald-400">
              تم حفظ إعدادات المنصة بنجاح.
            </p>
          )}
          {updateMutation.isError && (
            <p className="text-xs text-destructive">
              تعذّر حفظ إعدادات المنصة. حاول مرة أخرى.
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
