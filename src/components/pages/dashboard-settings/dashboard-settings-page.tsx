"use client";

import * as React from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AppIcons } from "@/constant/icons";
import {
  orgOwnerBankSettingsDefaults,
  orgStaffBankSettingsDefaults,
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
  const bankDefaults =
    scope === "org-owner"
      ? orgOwnerBankSettingsDefaults
      : scope === "org-staff"
        ? orgStaffBankSettingsDefaults
        : { bankName: "", iban: "" };

  const [bankName, setBankName] = React.useState(bankDefaults.bankName);
  const [iban, setIban] = React.useState(bankDefaults.iban);

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
        {(scope === "org-owner" || scope === "org-staff") && (
          <>
            <div className="space-y-2">
              <Label htmlFor="bank-name">اسم البنك</Label>
              <Input
                id="bank-name"
                value={bankName}
                onChange={(e) => setBankName(e.target.value)}
                className="max-w-md text-right"
                dir="rtl"
                placeholder="للتبرعات المباشرة"
              />
            </div>
            <div className="space-y-2">
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
          </>
        )}

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
