"use client";

import * as React from "react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RegisterPhaseOneFields } from "@/app/(auth)/register/register-phase-one-fields";
import { RegisterPhaseTwoFields } from "@/app/(auth)/register/register-phase-two-fields";
import {
  createEmptyFounder,
  INITIAL_REGISTER_VALUES,
  type RegisterFieldErrors,
  type RegisterFieldName,
  type RegisterFounderErrors,
  type RegisterFounderFieldName,
  type RegisterPhase,
  type RegisterValues,
} from "@/app/(auth)/register/register-form.types";
import { useRegisterOrganization } from "@/features/shared/auth.services/auth.query";
import { AuthFlowError } from "@/features/shared/auth.services/auth.utils";
import { useMediaUploadQueue } from "@/hooks/use-media-upload-queue";
import { normalizeApiError } from "@/lib/api-errors";

const SYRIAN_MOBILE_PATTERN = /^\+9639\d{8}$/;
const SYRIA_PREFIX = "+963";
const FOUNDER_ERROR_PATTERN = /^founders\.(\d+)\.(name|email|phone|password|passwordConfirmation)$/;

function newFounderId(): string {
  return `founder-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export function RegisterForm() {
  const [phase, setPhase] = React.useState<RegisterPhase>("phase-1");
  const [values, setValues] = React.useState<RegisterValues>(INITIAL_REGISTER_VALUES);
  const [acceptTerms, setAcceptTerms] = React.useState(false);
  const [confirmAccuracy, setConfirmAccuracy] = React.useState(false);
  const [errors, setErrors] = React.useState<RegisterFieldErrors>({});
  const logoQueue = useMediaUploadQueue(1);
  const registerMutation = useRegisterOrganization();

  const updateValue = React.useCallback((event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    const field = name as RegisterFieldName;
    setValues((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined, root: undefined }));
  }, []);

  const updateCompanyPhone = React.useCallback((value: string) => {
    const digits = value.replace(/\D/g, "").slice(0, 9);
    setValues((current) => ({ ...current, companyPhone: digits ? `${SYRIA_PREFIX}${digits}` : "" }));
    setErrors((current) => ({ ...current, companyPhone: undefined, root: undefined }));
  }, []);

  const updateFounder = React.useCallback((index: number, field: RegisterFounderFieldName, value: string) => {
    setValues((current) => ({
      ...current,
      founders: current.founders.map((founder, founderIndex) => founderIndex === index ? { ...founder, [field]: value } : founder),
    }));
    setErrors((current) => {
      const founderErrors = [...(current.founders ?? [])];
      founderErrors[index] = { ...(founderErrors[index] ?? {}), [field]: undefined };
      return { ...current, founders: founderErrors, root: undefined };
    });
  }, []);

  const updateFounderPhone = React.useCallback((index: number, value: string) => {
    const digits = value.replace(/\D/g, "").slice(0, 9);
    updateFounder(index, "phone", digits ? `${SYRIA_PREFIX}${digits}` : "");
  }, [updateFounder]);

  const addFounder = React.useCallback(() => {
    setValues((current) => current.founders.length >= 10 ? current : { ...current, founders: [...current.founders, createEmptyFounder(newFounderId())] });
  }, []);

  const removeFounder = React.useCallback((index: number) => {
    if (index === 0) return;
    setValues((current) => ({ ...current, founders: current.founders.filter((_, founderIndex) => founderIndex !== index) }));
    setErrors((current) => ({ ...current, founders: current.founders?.filter((_, founderIndex) => founderIndex !== index), root: undefined }));
  }, []);

  function validatePhaseOne(): RegisterFieldErrors {
    const founderErrors: RegisterFounderErrors[] = values.founders.map(() => ({}));
    const normalizedEmails = values.founders.map((founder) => founder.email.trim().toLowerCase());
    const phones = values.founders.map((founder) => founder.phone.trim());

    values.founders.forEach((founder, index) => {
      if (!founder.name.trim()) founderErrors[index].name = "الاسم الكامل مطلوب.";
      if (!founder.email.trim()) founderErrors[index].email = "البريد الإلكتروني مطلوب.";
      else if (!/^\S+@\S+\.\S+$/.test(founder.email)) founderErrors[index].email = "صيغة البريد الإلكتروني غير صحيحة.";
      else if (normalizedEmails.filter((email) => email === normalizedEmails[index]).length > 1) founderErrors[index].email = "البريد الإلكتروني مكرر بين المؤسسين.";

      if (!founder.phone.trim()) founderErrors[index].phone = "رقم الموبايل مطلوب.";
      else if (!SYRIAN_MOBILE_PATTERN.test(founder.phone)) founderErrors[index].phone = "أدخل رقم موبايل سوري صحيحاً بعد +963 بصيغة 9XXXXXXXX.";
      else if (phones.filter((phone) => phone === phones[index]).length > 1) founderErrors[index].phone = "رقم الموبايل مكرر بين المؤسسين.";

      if (founder.password.length < 8) founderErrors[index].password = "كلمة المرور يجب أن تكون 8 أحرف على الأقل.";
      if (founder.password !== founder.passwordConfirmation) founderErrors[index].passwordConfirmation = "تأكيد كلمة المرور غير متطابق.";
    });

    return founderErrors.some((founder) => Object.keys(founder).length > 0) ? { founders: founderErrors } : {};
  }

  function validatePhaseTwo(): RegisterFieldErrors {
    const next: RegisterFieldErrors = {};
    if (!values.companyName.trim()) next.companyName = "اسم المنظمة مطلوب.";
    if (!values.organizationNumber.trim()) next.organizationNumber = "رقم المنظمة مطلوب.";
    if (!values.registrationNumber.trim()) next.registrationNumber = "رقم السجل أو الترخيص مطلوب.";
    if (!values.bankAccountNumber.trim()) next.bankAccountNumber = "رقم الحساب البنكي مطلوب.";
    if (!values.companyEmail.trim()) next.companyEmail = "البريد الرسمي مطلوب.";
    else if (!/^\S+@\S+\.\S+$/.test(values.companyEmail)) next.companyEmail = "صيغة البريد الرسمي غير صحيحة.";
    if (!values.companyPhone.trim()) next.companyPhone = "رقم الموبايل الرسمي مطلوب.";
    else if (!SYRIAN_MOBILE_PATTERN.test(values.companyPhone)) next.companyPhone = "أدخل رقم موبايل سوري صحيحاً بعد +963 بصيغة 9XXXXXXXX.";
    if (!values.location.trim()) next.location = "الموقع مطلوب.";
    if (values.website && !/^https?:\/\//i.test(values.website)) next.website = "ابدأ رابط الموقع بـ http:// أو https://";
    if (!logoQueue.items[0]?.file) next.logo = "شعار المنظمة مطلوب ويجب رفعه قبل إرسال الطلب.";
    if (!acceptTerms || !confirmAccuracy) next.root = "يجب الموافقة على الشروط والإقرار بصحة البيانات قبل الإرسال.";
    return next;
  }

  function moveToPhaseTwo() {
    const validationErrors = validatePhaseOne();
    if (validationErrors.founders) { setErrors(validationErrors); return; }
    setErrors({});
    setPhase("phase-2");
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const phaseOneErrors = validatePhaseOne();
    const phaseTwoErrors = validatePhaseTwo();
    const validationErrors: RegisterFieldErrors = { ...phaseTwoErrors, founders: phaseOneErrors.founders };
    if (phaseOneErrors.founders || Object.keys(phaseTwoErrors).length > 0) {
      setErrors(validationErrors);
      if (phaseOneErrors.founders) setPhase("phase-1");
      return;
    }

    const logoFile = logoQueue.items[0]?.file;
    if (!logoFile) { setErrors({ logo: "شعار المنظمة مطلوب ويجب رفعه قبل إرسال الطلب." }); setPhase("phase-2"); return; }

    setErrors({});
    registerMutation.mutate({
      data: {
        companyName: values.companyName.trim(),
        organizationNumber: values.organizationNumber.trim(),
        registrationNumber: values.registrationNumber.trim(),
        bankAccountNumber: values.bankAccountNumber.trim(),
        companyEmail: values.companyEmail.trim(),
        companyPhone: values.companyPhone.trim(),
        location: values.location.trim(),
        website: values.website.trim() || undefined,
        founders: values.founders.map((founder) => ({
          name: founder.name.trim(),
          email: founder.email.trim().toLowerCase(),
          phone: founder.phone.trim(),
          password: founder.password,
          password_confirmation: founder.passwordConfirmation,
        })),
      },
      logoFile,
    }, {
      onError: (error) => {
        if (error instanceof AuthFlowError) { setErrors({ root: error.message }); return; }
        const normalized = normalizeApiError<string>(error);
        const nextErrors: RegisterFieldErrors = { root: normalized.message };
        const nestedFounderErrors: RegisterFounderErrors[] = values.founders.map(() => ({}));
        let hasFounderError = false;

        Object.entries(normalized.fieldErrors).forEach(([field, message]) => {
          const match = field.match(FOUNDER_ERROR_PATTERN);
          if (match) {
            const index = Number(match[1]);
            const founderField = match[2] as RegisterFounderFieldName;
            if (nestedFounderErrors[index] && message) {
              nestedFounderErrors[index][founderField] = message;
              hasFounderError = true;
            }
            return;
          }
          if (message && field in values && field !== "founders") {
            nextErrors[field as RegisterFieldName] = message;
          }
          if (field === "logo" && message) nextErrors.logo = message;
        });

        if (hasFounderError) {
          nextErrors.founders = nestedFounderErrors;
          setPhase("phase-1");
        }
        setErrors(nextErrors);
      },
    });
  }

  return (
    <div dir="rtl" className="w-full max-w-2xl text-right md:flex md:h-full md:min-h-0 md:max-h-full md:flex-col md:overflow-hidden">
      <div className="space-y-2"><p className="text-xs font-medium tracking-wide text-primary">انضم إلى جود</p><h2 className="text-2xl font-semibold text-foreground">تسجيل منظمة جديدة</h2><p className="text-sm leading-6 text-muted-foreground">أنشئ حسابات المؤسسين ثم أدخل البيانات الرسمية للمنظمة لإرسال طلب الانضمام.</p></div>
      <form noValidate onSubmit={handleSubmit} className="mt-6 space-y-5 md:flex md:min-h-0 md:flex-1 md:flex-col md:overflow-hidden">
        <Tabs dir="rtl" value={phase} onValueChange={(value) => { if (value === "phase-2") moveToPhaseTwo(); else { setErrors((current) => ({ ...current, root: undefined })); setPhase("phase-1"); } }} className="gap-4 md:flex md:min-h-0 md:flex-1 md:flex-col">
          <TabsList className="grid h-auto w-full grid-cols-2 rounded-xl bg-muted/60 p-2"><TabsTrigger value="phase-1" className="rounded-lg py-2 text-xs font-medium">1. حسابات المؤسسين</TabsTrigger><TabsTrigger value="phase-2" className="rounded-lg py-2 text-xs font-medium">2. بيانات المنظمة</TabsTrigger></TabsList>
          <div className="md:min-h-0 md:flex-1 md:overflow-y-auto md:px-1">
            <TabsContent value="phase-1"><RegisterPhaseOneFields values={values} errors={errors} disabled={registerMutation.isPending} onFounderChange={updateFounder} onFounderPhoneChange={updateFounderPhone} onAddFounder={addFounder} onRemoveFounder={removeFounder} /></TabsContent>
            <TabsContent value="phase-2"><RegisterPhaseTwoFields values={values} errors={errors} disabled={registerMutation.isPending} acceptTerms={acceptTerms} confirmAccuracy={confirmAccuracy} logoItems={logoQueue.items} logoError={errors.logo} onLogoFilesSelected={(files) => { logoQueue.reset(); logoQueue.addFiles(files.slice(0, 1)); setErrors((current) => ({ ...current, logo: undefined, root: undefined })); }} onRemoveLogo={logoQueue.removeItem} onAcceptTermsChange={(checked) => { setAcceptTerms(checked); setErrors((current) => ({ ...current, root: undefined })); }} onConfirmAccuracyChange={(checked) => { setConfirmAccuracy(checked); setErrors((current) => ({ ...current, root: undefined })); }} onInputChange={updateValue} onCompanyPhoneChange={updateCompanyPhone} /></TabsContent>
          </div>
        </Tabs>
        {errors.root ? <p role="alert" className="rounded-xl border border-destructive/30 bg-destructive/10 px-3 py-2 text-xs leading-5 text-destructive">{errors.root}</p> : null}
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border pt-4"><p className="text-xs text-muted-foreground">لديك حساب بالفعل؟ <Link href="/login" className="font-semibold text-primary hover:underline">تسجيل الدخول</Link></p><div className="flex items-center gap-2">{phase === "phase-2" ? <Button type="button" variant="outline" disabled={registerMutation.isPending} onClick={() => setPhase("phase-1")}>السابق</Button> : null}{phase === "phase-1" ? <Button type="button" disabled={registerMutation.isPending} onClick={(event) => { event.preventDefault(); event.stopPropagation(); moveToPhaseTwo(); }}>التالي: بيانات المنظمة</Button> : <Button type="submit" disabled={registerMutation.isPending}>{registerMutation.isPending ? "جارٍ إنشاء الحسابات ورفع الشعار..." : "إرسال طلب التسجيل"}</Button>}</div></div>
      </form>
    </div>
  );
}
