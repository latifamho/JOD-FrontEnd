import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import type {
  OrganizationType,
  RegisterFieldErrors,
  RegisterInputChangeEvent,
  RegisterValues,
} from "@/app/(auth)/register/register-form.types";

type RegisterPhaseTwoFieldsProps = {
  values: RegisterValues;
  errors: RegisterFieldErrors;
  disabled: boolean;
  acceptTerms: boolean;
  confirmAccuracy: boolean;
  onOrganizationTypeChange: (value: OrganizationType) => void;
  onAcceptTermsChange: (checked: boolean) => void;
  onConfirmAccuracyChange: (checked: boolean) => void;
  onInputChange: (event: RegisterInputChangeEvent) => void;
};

export function RegisterPhaseTwoFields({
  values,
  errors,
  disabled,
  acceptTerms,
  confirmAccuracy,
  onOrganizationTypeChange,
  onAcceptTermsChange,
  onConfirmAccuracyChange,
  onInputChange,
}: RegisterPhaseTwoFieldsProps) {
  return (
    <section className="space-y-5">
      <div>
        <h3 className="text-sm font-semibold text-foreground">بيانات المنظمة</h3>
        <p className="mt-1 text-xs leading-5 text-muted-foreground">
          أدخل البيانات الرسمية المطابقة للسجل أو الترخيص لتسهيل عملية المراجعة.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Field label="اسم المنظمة" error={errors.companyName}>
          <Input
            id="companyName"
            name="companyName"
            value={values.companyName}
            onChange={onInputChange}
            disabled={disabled}
            placeholder="مثال: جمعية نبض الخير"
            className="h-11 rounded-xl bg-background/85"
          />
        </Field>

        <Field label="نوع المنظمة" error={errors.organizationType}>
          <Select
            dir="rtl"
            value={values.organizationType}
            disabled={disabled}
            onValueChange={(value) => onOrganizationTypeChange(value as OrganizationType)}
          >
            <SelectTrigger id="organizationType" className="h-11 w-full rounded-xl">
              <SelectValue placeholder="اختر نوع المنظمة" />
            </SelectTrigger>
            <SelectContent align="start" position="popper" className="text-right">
              <SelectItem value="association">جمعية</SelectItem>
              <SelectItem value="foundation">مؤسسة</SelectItem>
              <SelectItem value="initiative">مبادرة</SelectItem>
            </SelectContent>
          </Select>
        </Field>

        <Field label="رقم السجل أو الترخيص" error={errors.registrationNumber}>
          <Input
            id="registrationNumber"
            name="registrationNumber"
            value={values.registrationNumber}
            onChange={onInputChange}
            disabled={disabled}
            placeholder="مثال: 1234567890"
            className="h-11 rounded-xl bg-background/85"
          />
        </Field>

        <Field label="تاريخ التأسيس" error={errors.establishmentDate}>
          <Input
            id="establishmentDate"
            name="establishmentDate"
            type="date"
            max={new Date().toISOString().slice(0, 10)}
            value={values.establishmentDate}
            onChange={onInputChange}
            disabled={disabled}
            className="h-11 rounded-xl bg-background/85"
          />
        </Field>

        <Field label="البريد الرسمي" error={errors.companyEmail}>
          <Input
            id="companyEmail"
            name="companyEmail"
            type="email"
            dir="ltr"
            value={values.companyEmail}
            onChange={onInputChange}
            disabled={disabled}
            placeholder="org@example.com"
            className="h-11 rounded-xl bg-background/85 text-left"
          />
        </Field>

        <Field label="الهاتف الرسمي" error={errors.companyPhone}>
          <Input
            id="companyPhone"
            name="companyPhone"
            type="tel"
            dir="ltr"
            value={values.companyPhone}
            onChange={onInputChange}
            disabled={disabled}
            placeholder="+966XXXXXXXXX"
            className="h-11 rounded-xl bg-background/85 text-left"
          />
        </Field>

        <Field label="المدينة" error={errors.city}>
          <Input
            id="city"
            name="city"
            value={values.city}
            onChange={onInputChange}
            disabled={disabled}
            placeholder="مثال: الرياض"
            className="h-11 rounded-xl bg-background/85"
          />
        </Field>

        <Field label="العنوان المختصر" error={errors.shortAddress}>
          <Input
            id="shortAddress"
            name="shortAddress"
            value={values.shortAddress}
            onChange={onInputChange}
            disabled={disabled}
            placeholder="الحي - الشارع - رقم المبنى"
            className="h-11 rounded-xl bg-background/85"
          />
        </Field>

        <Field className="md:col-span-2" label="وصف مختصر" error={errors.description}>
          <Textarea
            id="description"
            name="description"
            value={values.description}
            onChange={onInputChange}
            disabled={disabled}
            placeholder="نبذة عن أنشطة المنظمة ومجالات عملها."
            className="min-h-28 rounded-xl bg-background/85"
          />
        </Field>

        <Field className="md:col-span-2" label="الموقع الإلكتروني - اختياري" error={errors.website}>
          <Input
            id="website"
            name="website"
            type="url"
            dir="ltr"
            value={values.website}
            onChange={onInputChange}
            disabled={disabled}
            placeholder="https://example.org"
            className="h-11 rounded-xl bg-background/85 text-left"
          />
        </Field>
      </div>

      <div className="space-y-3 rounded-2xl border border-border/70 bg-muted/40 p-4">
        <CheckRow
          id="acceptTerms"
          checked={acceptTerms}
          disabled={disabled}
          onChange={onAcceptTermsChange}
          label="أوافق على الشروط والأحكام وسياسة الخصوصية."
        />
        <CheckRow
          id="confirmAccuracy"
          checked={confirmAccuracy}
          disabled={disabled}
          onChange={onConfirmAccuracyChange}
          label="أقر بأن جميع البيانات المدخلة صحيحة وكاملة."
        />
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

function CheckRow({
  id,
  checked,
  disabled,
  onChange,
  label,
}: {
  id: string;
  checked: boolean;
  disabled: boolean;
  onChange: (checked: boolean) => void;
  label: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <Checkbox
        id={id}
        checked={checked}
        disabled={disabled}
        onCheckedChange={(value) => onChange(Boolean(value))}
      />
      <Label htmlFor={id} className="text-sm leading-6">
        {label}
      </Label>
    </div>
  );
}
