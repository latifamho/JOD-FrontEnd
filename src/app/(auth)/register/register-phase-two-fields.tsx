import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MediaUploadField } from "@/components/shared";
import type { MediaUploadQueueItem } from "@/hooks/use-media-upload-queue";
import type { RegisterFieldErrors, RegisterInputChangeEvent, RegisterValues } from "@/app/(auth)/register/register-form.types";

type RegisterPhaseTwoFieldsProps = {
  values: RegisterValues;
  errors: RegisterFieldErrors;
  disabled: boolean;
  acceptTerms: boolean;
  confirmAccuracy: boolean;
  logoItems: MediaUploadQueueItem[];
  onLogoFilesSelected: (files: File[]) => void;
  onRemoveLogo: (id: string) => void;
  onAcceptTermsChange: (checked: boolean) => void;
  onConfirmAccuracyChange: (checked: boolean) => void;
  onInputChange: (event: RegisterInputChangeEvent) => void;
};

export function RegisterPhaseTwoFields({ values, errors, disabled, acceptTerms, confirmAccuracy, logoItems, onLogoFilesSelected, onRemoveLogo, onAcceptTermsChange, onConfirmAccuracyChange, onInputChange }: RegisterPhaseTwoFieldsProps) {
  return (
    <section className="space-y-5">
      <div><h3 className="text-sm font-semibold text-foreground">بيانات المنظمة</h3><p className="mt-1 text-xs leading-5 text-muted-foreground">أدخل البيانات الرسمية المطابقة لسجلات المنظمة.</p></div>
      <div className="grid gap-4 md:grid-cols-2">
        <Field label="اسم المنظمة" error={errors.companyName}><Input id="companyName" name="companyName" value={values.companyName} onChange={onInputChange} disabled={disabled} aria-invalid={Boolean(errors.companyName)} className="h-11 rounded-xl bg-background/85" /></Field>
        <Field label="رقم المنظمة" error={errors.organizationNumber}><Input id="organizationNumber" name="organizationNumber" value={values.organizationNumber} onChange={onInputChange} disabled={disabled} aria-invalid={Boolean(errors.organizationNumber)} className="h-11 rounded-xl bg-background/85" /></Field>
        <Field label="رقم السجل أو الترخيص" error={errors.registrationNumber}><Input id="registrationNumber" name="registrationNumber" value={values.registrationNumber} onChange={onInputChange} disabled={disabled} aria-invalid={Boolean(errors.registrationNumber)} className="h-11 rounded-xl bg-background/85" /></Field>
        <Field label="رقم الحساب البنكي" error={errors.bankAccountNumber}><Input id="bankAccountNumber" name="bankAccountNumber" dir="ltr" value={values.bankAccountNumber} onChange={onInputChange} disabled={disabled} aria-invalid={Boolean(errors.bankAccountNumber)} className="h-11 rounded-xl bg-background/85 text-left" /></Field>
        <Field label="البريد الرسمي" error={errors.companyEmail}><Input id="companyEmail" name="companyEmail" type="email" dir="ltr" value={values.companyEmail} onChange={onInputChange} disabled={disabled} aria-invalid={Boolean(errors.companyEmail)} className="h-11 rounded-xl bg-background/85 text-left" /></Field>
        <Field label="الهاتف الرسمي" error={errors.companyPhone}><Input id="companyPhone" name="companyPhone" type="tel" dir="ltr" value={values.companyPhone} onChange={onInputChange} disabled={disabled} aria-invalid={Boolean(errors.companyPhone)} className="h-11 rounded-xl bg-background/85 text-left" /></Field>
        <Field className="md:col-span-2" label="الموقع / العنوان" error={errors.location}><Input id="location" name="location" value={values.location} onChange={onInputChange} disabled={disabled} aria-invalid={Boolean(errors.location)} className="h-11 rounded-xl bg-background/85" /></Field>
        <Field className="md:col-span-2" label="الموقع الإلكتروني - اختياري" error={errors.website}><Input id="website" name="website" type="url" dir="ltr" value={values.website} onChange={onInputChange} disabled={disabled} aria-invalid={Boolean(errors.website)} placeholder="https://example.org" className="h-11 rounded-xl bg-background/85 text-left" /></Field>
        <div className="md:col-span-2"><MediaUploadField label="شعار المنظمة - اختياري" items={logoItems} maxItems={1} multiple={false} disabled={disabled} onFilesSelected={onLogoFilesSelected} onRemoveQueued={onRemoveLogo} /></div>
      </div>
      <div className="space-y-3 rounded-2xl border border-border/70 bg-muted/40 p-4">
        <CheckRow id="acceptTerms" checked={acceptTerms} disabled={disabled} onChange={onAcceptTermsChange} label="أوافق على الشروط والأحكام وسياسة الخصوصية." />
        <CheckRow id="confirmAccuracy" checked={confirmAccuracy} disabled={disabled} onChange={onConfirmAccuracyChange} label="أقر بأن جميع البيانات المدخلة صحيحة وكاملة." />
      </div>
    </section>
  );
}

function Field({ label, error, className, children }: { label: string; error?: string; className?: string; children: React.ReactNode }) {
  return <div className={`space-y-2 ${className ?? ""}`}><Label>{label}</Label>{children}{error ? <p className="text-xs text-destructive">{error}</p> : null}</div>;
}

function CheckRow({ id, checked, disabled, onChange, label }: { id: string; checked: boolean; disabled: boolean; onChange: (checked: boolean) => void; label: string }) {
  return <div className="flex items-start gap-3"><Checkbox id={id} checked={checked} disabled={disabled} onCheckedChange={(value) => onChange(Boolean(value))} /><Label htmlFor={id} className="text-sm leading-6">{label}</Label></div>;
}
