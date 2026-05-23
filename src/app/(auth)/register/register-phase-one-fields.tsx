import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type {
  RegisterInputChangeEvent,
  RegisterValues,
} from "@/app/(auth)/register/register-form.types";

type RegisterPhaseOneFieldsProps = {
  values: RegisterValues;
  onInputChange: (event: RegisterInputChangeEvent) => void;
};

export function RegisterPhaseOneFields({
  values,
  onInputChange,
}: RegisterPhaseOneFieldsProps) {
  return (
    <section className="space-y-4">
      <h3 className="text-sm font-semibold text-foreground">بيانات حساب المسؤول</h3>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="adminFullName">الاسم الكامل</Label>
          <Input
            id="adminFullName"
            name="adminFullName"
            value={values.adminFullName}
            onChange={onInputChange}
            placeholder="مثال: أحمد خالد"
            className="h-11 rounded-xl bg-background/85"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="adminEmail">البريد الإلكتروني</Label>
          <Input
            id="adminEmail"
            name="adminEmail"
            type="email"
            autoComplete="email"
            dir="ltr"
            value={values.adminEmail}
            onChange={onInputChange}
            placeholder="name@example.com"
            className="h-11 rounded-xl bg-background/85 text-left"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="adminPhone">رقم الجوال</Label>
          <Input
            id="adminPhone"
            name="adminPhone"
            type="tel"
            autoComplete="tel"
            dir="ltr"
            value={values.adminPhone}
            onChange={onInputChange}
            placeholder="+9665XXXXXXXX"
            className="h-11 rounded-xl bg-background/85 text-left"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">كلمة المرور</Label>
          <Input
            id="password"
            name="password"
            type="password"
            autoComplete="new-password"
            value={values.password}
            onChange={onInputChange}
            placeholder="••••••••"
            className="h-11 rounded-xl bg-background/85"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirmPassword">تأكيد كلمة المرور</Label>
          <Input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            autoComplete="new-password"
            value={values.confirmPassword}
            onChange={onInputChange}
            placeholder="••••••••"
            className="h-11 rounded-xl bg-background/85"
          />
        </div>
      </div>
    </section>
  );
}
