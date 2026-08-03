import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PasswordInput } from "@/components/ui/password-input";
import type {
  RegisterFieldErrors,
  RegisterInputChangeEvent,
  RegisterValues,
} from "@/app/(auth)/register/register-form.types";

type RegisterPhaseOneFieldsProps = {
  values: RegisterValues;
  errors: RegisterFieldErrors;
  disabled: boolean;
  onInputChange: (event: RegisterInputChangeEvent) => void;
};

export function RegisterPhaseOneFields({
  values,
  errors,
  disabled,
  onInputChange,
}: RegisterPhaseOneFieldsProps) {
  return (
    <section className="space-y-4">
      <div>
        <h3 className="text-sm font-semibold text-foreground">بيانات مالك المنظمة</h3>
        <p className="mt-1 text-xs leading-5 text-muted-foreground">
          سيُنشأ هذا الحساب كمالك للمنظمة وبصلاحيات الإدارة الكاملة بعد الموافقة.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Field className="md:col-span-2" label="الاسم الكامل" error={errors.ownerName}>
          <Input
            id="ownerName"
            name="ownerName"
            value={values.ownerName}
            onChange={onInputChange}
            disabled={disabled}
            placeholder="مثال: أحمد خالد"
            className="h-11 rounded-xl bg-background/85"
          />
        </Field>

        <Field label="البريد الإلكتروني" error={errors.ownerEmail}>
          <Input
            id="ownerEmail"
            name="ownerEmail"
            type="email"
            autoComplete="email"
            dir="ltr"
            value={values.ownerEmail}
            onChange={onInputChange}
            disabled={disabled}
            placeholder="owner@example.com"
            className="h-11 rounded-xl bg-background/85 text-left"
          />
        </Field>

        <Field label="رقم الجوال" error={errors.ownerPhone}>
          <Input
            id="ownerPhone"
            name="ownerPhone"
            type="tel"
            autoComplete="tel"
            dir="ltr"
            value={values.ownerPhone}
            onChange={onInputChange}
            disabled={disabled}
            placeholder="+9665XXXXXXXX"
            className="h-11 rounded-xl bg-background/85 text-left"
          />
        </Field>

        <Field label="كلمة المرور" error={errors.password}>
          <PasswordInput
            id="password"
            name="password"
            autoComplete="new-password"
            value={values.password}
            onChange={onInputChange}
            disabled={disabled}
            placeholder="••••••••"
            className="h-11 rounded-xl bg-background/85"
          />
        </Field>

        <Field label="تأكيد كلمة المرور" error={errors.passwordConfirmation}>
          <PasswordInput
            id="passwordConfirmation"
            name="passwordConfirmation"
            autoComplete="new-password"
            value={values.passwordConfirmation}
            onChange={onInputChange}
            disabled={disabled}
            placeholder="••••••••"
            className="h-11 rounded-xl bg-background/85"
          />
        </Field>
      </div>
    </section>
  );
}

function Field({
  label,
  error,
  className,
  children,
}: {
  label: string;
  error?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={`space-y-2 ${className ?? ""}`}>
      <Label>{label}</Label>
      {children}
      {error ? <p className="text-xs text-destructive">{error}</p> : null}
    </div>
  );
}
