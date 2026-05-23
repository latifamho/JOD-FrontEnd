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
  const [accountName, setAccountName] = React.useState(
    platformSettingsDefaultsData.accountName,
  );
  const [accountEmail, setAccountEmail] = React.useState(
    platformSettingsDefaultsData.accountEmail,
  );
  const [accountPhone, setAccountPhone] = React.useState(
    platformSettingsDefaultsData.accountPhone,
  );
  const [recoveryEmail, setRecoveryEmail] = React.useState(
    platformSettingsDefaultsData.recoveryEmail,
  );
  const [twoFactorEnabled, setTwoFactorEnabled] = React.useState(
    platformSettingsDefaultsData.twoFactorEnabled,
  );
  const [newPassword, setNewPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [bankName, setBankName] = React.useState(
    platformSettingsDefaultsData.bankName,
  );
  const [bankAccountNumber, setBankAccountNumber] = React.useState(
    platformSettingsDefaultsData.bankAccountNumber,
  );
  const [iban, setIban] = React.useState(platformSettingsDefaultsData.iban);

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
