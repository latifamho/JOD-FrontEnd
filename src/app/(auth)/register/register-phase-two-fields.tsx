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
  RegisterInputChangeEvent,
  RegisterValues,
} from "@/app/(auth)/register/register-form.types";

type RegisterPhaseTwoFieldsProps = {
  values: RegisterValues;
  organizationType: OrganizationType | "";
  onOrganizationTypeChange: (value: OrganizationType) => void;
  acceptTerms: boolean;
  onAcceptTermsChange: (checked: boolean) => void;
  confirmAccuracy: boolean;
  onConfirmAccuracyChange: (checked: boolean) => void;
  onInputChange: (event: RegisterInputChangeEvent) => void;
};

export function RegisterPhaseTwoFields({
  values,
  organizationType,
  onOrganizationTypeChange,
  acceptTerms,
  onAcceptTermsChange,
  confirmAccuracy,
  onConfirmAccuracyChange,
  onInputChange,
}: RegisterPhaseTwoFieldsProps) {
  return (
    <section className="space-y-5">
      <h3 className="text-sm font-semibold text-foreground">بيانات المنظمة والتوثيق</h3>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="organizationNameAr">اسم المنظمة (عربي)</Label>
          <Input
            id="organizationNameAr"
            name="organizationNameAr"
            value={values.organizationNameAr}
            onChange={onInputChange}
            placeholder="مثال: جمعية نبض الخير"
            className="h-11 rounded-xl bg-background/85"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="organizationNameEn">اسم المنظمة (إنجليزي) - اختياري</Label>
          <Input
            id="organizationNameEn"
            name="organizationNameEn"
            dir="ltr"
            value={values.organizationNameEn}
            onChange={onInputChange}
            placeholder="Organization Name"
            className="h-11 rounded-xl bg-background/85 text-left"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="organizationType">نوع المنظمة</Label>
          <Select
            dir="rtl"
            value={organizationType}
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
        </div>

        <div className="space-y-2">
          <Label htmlFor="registrationNumber">رقم السجل أو الترخيص</Label>
          <Input
            id="registrationNumber"
            name="registrationNumber"
            value={values.registrationNumber}
            onChange={onInputChange}
            placeholder="مثال: 1234567890"
            className="h-11 rounded-xl bg-background/85"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="establishmentDate">تاريخ التأسيس</Label>
          <Input
            id="establishmentDate"
            name="establishmentDate"
            type="date"
            value={values.establishmentDate}
            onChange={onInputChange}
            className="h-11 rounded-xl bg-background/85"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="city">المدينة</Label>
          <Input
            id="city"
            name="city"
            value={values.city}
            onChange={onInputChange}
            placeholder="مثال: الرياض"
            className="h-11 rounded-xl bg-background/85"
          />
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="shortAddress">العنوان المختصر</Label>
          <Input
            id="shortAddress"
            name="shortAddress"
            value={values.shortAddress}
            onChange={onInputChange}
            placeholder="الحي - الشارع - رقم المبنى"
            className="h-11 rounded-xl bg-background/85"
          />
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="organizationDescription">وصف مختصر للمنظمة</Label>
          <Textarea
            id="organizationDescription"
            name="organizationDescription"
            value={values.organizationDescription}
            onChange={onInputChange}
            placeholder="اذكر نبذة عن أنشطة المنظمة ومجالات عملها."
            className="min-h-28 rounded-xl bg-background/85"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="officialEmail">البريد الرسمي للمنظمة</Label>
          <Input
            id="officialEmail"
            name="officialEmail"
            type="email"
            dir="ltr"
            value={values.officialEmail}
            onChange={onInputChange}
            placeholder="org@example.com"
            className="h-11 rounded-xl bg-background/85 text-left"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="officialPhone">الهاتف الرسمي للمنظمة</Label>
          <Input
            id="officialPhone"
            name="officialPhone"
            type="tel"
            dir="ltr"
            value={values.officialPhone}
            onChange={onInputChange}
            placeholder="+966XXXXXXXXX"
            className="h-11 rounded-xl bg-background/85 text-left"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="website">الموقع الإلكتروني - اختياري</Label>
          <Input
            id="website"
            name="website"
            type="url"
            dir="ltr"
            value={values.website}
            onChange={onInputChange}
            placeholder="https://example.org"
            className="h-11 rounded-xl bg-background/85 text-left"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="socialMedia">حسابات التواصل - اختياري</Label>
          <Input
            id="socialMedia"
            name="socialMedia"
            dir="ltr"
            value={values.socialMedia}
            onChange={onInputChange}
            placeholder="X / Instagram / LinkedIn"
            className="h-11 rounded-xl bg-background/85 text-left"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="licenseDocument">وثيقة الترخيص أو السجل</Label>
          <Input
            id="licenseDocument"
            name="licenseDocument"
            type="file"
            accept=".pdf,.png,.jpg,.jpeg"
            className="h-11 rounded-xl bg-background/85"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="delegationDocument">هوية المفوض أو خطاب التفويض</Label>
          <Input
            id="delegationDocument"
            name="delegationDocument"
            type="file"
            accept=".pdf,.png,.jpg,.jpeg"
            className="h-11 rounded-xl bg-background/85"
          />
        </div>
      </div>

      <div className="space-y-3 rounded-xl border border-border/70 bg-muted/40 p-4">
        <div className="flex items-start gap-3">
          <Checkbox
            id="acceptTerms"
            checked={acceptTerms}
            onCheckedChange={(checked) => onAcceptTermsChange(Boolean(checked))}
          />
          <Label htmlFor="acceptTerms" className="text-sm leading-6">
            أوافق على الشروط والأحكام وسياسة الخصوصية.
          </Label>
        </div>

        <div className="flex items-start gap-3">
          <Checkbox
            id="confirmAccuracy"
            checked={confirmAccuracy}
            onCheckedChange={(checked) => onConfirmAccuracyChange(Boolean(checked))}
          />
          <Label htmlFor="confirmAccuracy" className="text-sm leading-6">
            أقر بأن جميع البيانات المرفوعة صحيحة وكاملة.
          </Label>
        </div>
      </div>
    </section>
  );
}
