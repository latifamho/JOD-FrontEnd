import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PasswordInput } from "@/components/ui/password-input";
import { Badge } from "@/components/ui/badge";
import { AppIcons } from "@/constant/icons";
import type {
  RegisterFieldErrors,
  RegisterFounderFieldName,
  RegisterValues,
} from "@/app/(auth)/register/register-form.types";

type Props = {
  values: RegisterValues;
  errors: RegisterFieldErrors;
  disabled: boolean;
  onFounderChange: (index: number, field: RegisterFounderFieldName, value: string) => void;
  onFounderPhoneChange: (index: number, value: string) => void;
  onAddFounder: () => void;
  onRemoveFounder: (index: number) => void;
};

export function RegisterPhaseOneFields({
  values,
  errors,
  disabled,
  onFounderChange,
  onFounderPhoneChange,
  onAddFounder,
  onRemoveFounder,
}: Props) {
  return (
    <section className="space-y-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold text-foreground">حسابات مؤسسي المنظمة</h3>
          <p className="mt-1 max-w-xl text-xs leading-5 text-muted-foreground">
            أضف مؤسسًا واحدًا على الأقل. لكل مؤسس حساب دخول مستقل، ويُعتبر أول حساب هو المؤسس الرئيسي ومقدم طلب التسجيل.
          </p>
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={disabled || values.founders.length >= 10}
          onClick={onAddFounder}
        >
          <Plus className="size-4" />
          إضافة مؤسس
        </Button>
      </div>

      <div className="space-y-4">
        {values.founders.map((founder, index) => {
          const founderErrors = errors.founders?.[index] ?? {};
          return (
            <div key={founder.id} className="rounded-2xl border border-border/70 bg-muted/20 p-4 shadow-xs">
              <div className="mb-4 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-semibold text-foreground">المؤسس {index + 1}</p>
                  {index === 0 ? <Badge variant="secondary">المؤسس الرئيسي</Badge> : null}
                </div>
                {index > 0 ? (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="text-destructive hover:text-destructive"
                    disabled={disabled}
                    onClick={() => onRemoveFounder(index)}
                  >
                    <AppIcons.Trash className="size-4" />
                    إزالة
                  </Button>
                ) : null}
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <Field className="md:col-span-2" label="الاسم الكامل" error={founderErrors.name}>
                  <Input
                    value={founder.name}
                    onChange={(event) => onFounderChange(index, "name", event.target.value)}
                    disabled={disabled}
                    aria-invalid={Boolean(founderErrors.name)}
                    placeholder="مثال: أحمد خالد"
                    className="h-11 rounded-xl bg-background/85"
                  />
                </Field>

                <Field label="البريد الإلكتروني" error={founderErrors.email}>
                  <Input
                    type="email"
                    dir="ltr"
                    value={founder.email}
                    onChange={(event) => onFounderChange(index, "email", event.target.value)}
                    disabled={disabled}
                    aria-invalid={Boolean(founderErrors.email)}
                    placeholder="founder@example.org"
                    className="h-11 rounded-xl bg-background/85 text-left"
                  />
                </Field>

                <Field label="رقم الموبايل" error={founderErrors.phone}>
                  <div dir="ltr" className={`flex h-11 items-center overflow-hidden rounded-xl border bg-background/85 ${founderErrors.phone ? "border-destructive" : "border-input"}`}>
                    <div className="flex h-full shrink-0 items-center gap-2 border-e border-border bg-muted/40 px-3 text-sm font-medium text-foreground"><span aria-hidden>🇸🇾</span><span>+963</span></div>
                    <Input
                      type="tel"
                      inputMode="numeric"
                      maxLength={9}
                      value={founder.phone.replace(/^\+963/, "")}
                      onChange={(event) => onFounderPhoneChange(index, event.target.value)}
                      disabled={disabled}
                      aria-invalid={Boolean(founderErrors.phone)}
                      placeholder="9XXXXXXXX"
                      className="h-full rounded-none border-0 bg-transparent text-left shadow-none focus-visible:ring-0"
                    />
                  </div>
                </Field>

                <Field label="كلمة المرور" error={founderErrors.password}>
                  <PasswordInput
                    autoComplete="new-password"
                    value={founder.password}
                    onChange={(event) => onFounderChange(index, "password", event.target.value)}
                    disabled={disabled}
                    aria-invalid={Boolean(founderErrors.password)}
                    placeholder="••••••••"
                    className="h-11 rounded-xl bg-background/85"
                  />
                </Field>

                <Field label="تأكيد كلمة المرور" error={founderErrors.passwordConfirmation}>
                  <PasswordInput
                    autoComplete="new-password"
                    value={founder.passwordConfirmation}
                    onChange={(event) => onFounderChange(index, "passwordConfirmation", event.target.value)}
                    disabled={disabled}
                    aria-invalid={Boolean(founderErrors.passwordConfirmation)}
                    placeholder="••••••••"
                    className="h-11 rounded-xl bg-background/85"
                  />
                </Field>
              </div>
            </div>
          );
        })}
      </div>

      <p className="text-[11px] leading-5 text-muted-foreground">
        يمكن إضافة حتى 10 مؤسسين أثناء التسجيل. جميعهم يحصلون على صلاحيات مؤسس المنظمة نفسها بعد قبول الطلب.
      </p>
    </section>
  );
}

function Field({ label, error, className, children }: { label: string; error?: string; className?: string; children: React.ReactNode }) {
  return <div className={`space-y-2 ${className ?? ""}`}><Label>{label}</Label>{children}{error ? <p className="text-xs text-destructive">{error}</p> : null}</div>;
}
