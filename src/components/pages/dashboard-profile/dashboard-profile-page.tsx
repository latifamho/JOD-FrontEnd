"use client";

import * as React from "react";
import { useMutation } from "@tanstack/react-query";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authServices } from "@/features/shared/auth.services/auth.service";
import { normalizeApiError } from "@/lib/api-errors";
import { setUser } from "@/lib/cookies";
import { useAuth } from "@/providers/AuthProvider";

export function DashboardProfilePage() {
  const { user, updateUser } = useAuth();
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [profileError, setProfileError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!user) return;
    setName(user.name);
    setEmail(user.email);
    setPhone(user.phone ?? "");
  }, [user]);

  const updateProfileMutation = useMutation({
    mutationFn: () => authServices.updateProfile({ name: name.trim(), email: email.trim(), phone: phone.trim() }),
    onSuccess: (response) => {
      setProfileError(null);
      setUser(response.data);
      updateUser(response.data);
    },
    onError: (error) => setProfileError(normalizeApiError(error).message),
  });

  return (
    <section className="flex flex-1 flex-col gap-6">
      <div>
        <h2 className="text-lg font-semibold text-foreground">الملف الشخصي للأدمن</h2>
        <p className="mt-0.5 text-sm text-muted-foreground">عرض وتعديل بيانات حساب إدارة المنصة.</p>
      </div>

      <div className="space-y-6 rounded-xl border border-border bg-card p-4 shadow-sm sm:p-6">
        <Badge variant="secondary">حساب إدارة</Badge>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="profile-name">الاسم</Label>
            <Input id="profile-name" value={name} onChange={(event) => setName(event.target.value)} disabled={updateProfileMutation.isPending} dir="rtl" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="profile-email">البريد الإلكتروني</Label>
            <Input id="profile-email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} disabled={updateProfileMutation.isPending} dir="rtl" />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="profile-phone">رقم الهاتف</Label>
            <Input id="profile-phone" value={phone} onChange={(event) => setPhone(event.target.value)} disabled={updateProfileMutation.isPending} dir="rtl" />
          </div>
        </div>
        {profileError ? <p className="text-sm text-destructive">{profileError}</p> : null}
        <Button
          type="button"
          disabled={updateProfileMutation.isPending || !name.trim() || !email.trim() || !phone.trim()}
          onClick={() => updateProfileMutation.mutate()}
        >
          {updateProfileMutation.isPending ? "جاري الحفظ..." : "حفظ التغييرات"}
        </Button>
      </div>
    </section>
  );
}
