"use client";

import * as React from "react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { dashboardProfileDefaultsByScope } from "@/components/pages/dashboard-profile/dashboard-profile.data";
import type { DashboardProfileScope } from "@/components/pages/dashboard-profile/dashboard-profile.types";

type DashboardProfilePageProps = {
  scope: DashboardProfileScope;
};

const scopeLabels = {
  admin: "الملف الشخصي للأدمن",
  "org-owner": "ملف المنظمة",
  "org-staff": "الملف الشخصي",
};

export function DashboardProfilePage({ scope }: DashboardProfilePageProps) {
  const defaults = dashboardProfileDefaultsByScope[scope];
  const [name, setName] = React.useState(defaults.name);
  const [email, setEmail] = React.useState(defaults.email);

  return (
    <section className="flex flex-col flex-1 gap-6">
      <div>
        <h2 className="text-lg font-semibold text-foreground">
          {scopeLabels[scope]}
        </h2>
        <p className="mt-0.5 text-sm text-muted-foreground">
          عرض وتعديل البيانات الأساسية
        </p>
      </div>

      <div className="space-y-6 rounded-xl border border-border bg-card p-4 shadow-sm sm:p-6">
        <div className="flex flex-wrap items-center gap-2">
          {defaults.showVerifiedBadge && (
            <Badge variant="secondary">موثّق</Badge>
          )}
          {defaults.showOrgBadge && (
            <Badge variant="outline">مؤسسة موثقة</Badge>
          )}
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="profile-name">الاسم</Label>
            <Input
              id="profile-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="text-right"
              dir="rtl"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="profile-email">البريد الإلكتروني</Label>
            <Input
              id="profile-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="text-right"
              dir="rtl"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
