"use client";

import * as React from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { AppIcons } from "@/constant/icons";
import {
  dashboardSettingsDefaultsByScope,
} from "@/components/pages/dashboard-settings/dashboard-settings.data";

type DashboardSettingsPageProps = {
  scope: "admin" | "org-owner" | "org-staff";
};

const scopeLabels = {
  admin: "إعدادات المنصة",
  "org-owner": "إعدادات المنظمة",
  "org-staff": "الإعدادات",
};

export function DashboardSettingsPage({ scope }: DashboardSettingsPageProps) {
  const defaults = dashboardSettingsDefaultsByScope[scope];

  const [accountName, setAccountName] = React.useState(defaults.accountName);
  const [accountEmail, setAccountEmail] = React.useState(defaults.accountEmail);
  const [accountPhone, setAccountPhone] = React.useState(defaults.accountPhone);
  const [recoveryEmail, setRecoveryEmail] = React.useState(defaults.recoveryEmail);
  const [twoFactorEnabled, setTwoFactorEnabled] = React.useState(
    defaults.twoFactorEnabled,
  );
  const [newPassword, setNewPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [bankName, setBankName] = React.useState(defaults.bankName);
  const [bankAccountNumber, setBankAccountNumber] = React.useState(
    defaults.bankAccountNumber,
  );
  const [iban, setIban] = React.useState(defaults.iban);

  return (
    <section className="flex flex-col flex-1 gap-6">
      <div>
        <h2 className="text-lg font-semibold text-foreground">
          {scopeLabels[scope]}
        </h2>
        <p className="mt-0.5 text-sm text-muted-foreground">
          تفاصيل الحساب والإشعارات
        </p>
      </div>

      <div className="space-y-6 rounded-xl border border-border bg-card p-4 shadow-sm sm:p-6">
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-foreground">معلومات الحساب</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="account-name">الاسم</Label>
              <Input
                id="account-name"
                value={accountName}
                onChange={(e) => setAccountName(e.target.value)}
                className="text-right"
                dir="rtl"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="account-email">البريد الإلكتروني</Label>
              <Input
                id="account-email"
                type="email"
                value={accountEmail}
                onChange={(e) => setAccountEmail(e.target.value)}
                className="text-right"
                dir="rtl"
              />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="account-phone">رقم الجوال</Label>
              <Input
                id="account-phone"
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
              <Label htmlFor="recovery-email">بريد الاسترداد</Label>
              <Input
                id="recovery-email"
                type="email"
                value={recoveryEmail}
                onChange={(e) => setRecoveryEmail(e.target.value)}
                className="max-w-md text-right"
                dir="rtl"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-password">كلمة مرور جديدة</Label>
              <Input
                id="new-password"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="max-w-md"
                dir="ltr"
                placeholder="********"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm-password">تأكيد كلمة المرور</Label>
              <Input
                id="confirm-password"
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
              <Label htmlFor="bank-name">اسم البنك</Label>
              <Input
                id="bank-name"
                value={bankName}
                onChange={(e) => setBankName(e.target.value)}
                className="text-right"
                dir="rtl"
                placeholder="للتبرعات المباشرة"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="bank-account-number">رقم الحساب البنكي</Label>
              <Input
                id="bank-account-number"
                value={bankAccountNumber}
                onChange={(e) => setBankAccountNumber(e.target.value)}
                className="text-right font-mono"
                dir="ltr"
                placeholder="000000000000"
              />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="iban">رقم الآيبان</Label>
              <Input
                id="iban"
                value={iban}
                onChange={(e) => setIban(e.target.value)}
                className="max-w-md text-right font-mono"
                dir="ltr"
                placeholder="SA00 0000 0000 0000 0000 0000"
              />
            </div>
          </div>
        </div>

        <div className="pt-2">
          <Button size="sm">
            <AppIcons.settings className="size-4" />
            حفظ التغييرات
          </Button>
        </div>
      </div>
    </section>
  );
}
