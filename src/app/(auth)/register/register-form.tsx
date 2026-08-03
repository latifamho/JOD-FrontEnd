"use client";

import * as React from "react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RegisterPhaseOneFields } from "@/app/(auth)/register/register-phase-one-fields";
import { RegisterPhaseTwoFields } from "@/app/(auth)/register/register-phase-two-fields";
import {
  INITIAL_REGISTER_VALUES,
  type OrganizationType,
  type RegisterFieldErrors,
  type RegisterFieldName,
  type RegisterPhase,
  type RegisterValues,
} from "@/app/(auth)/register/register-form.types";
import { useRegisterOrganization } from "@/features/shared/auth.services/auth.query";
import { AuthFlowError } from "@/features/shared/auth.services/auth.utils";
import { normalizeApiError } from "@/lib/api-errors";

const phaseOneFields = new Set<RegisterFieldName>([
  "ownerName",
  "ownerEmail",
  "ownerPhone",
  "password",
  "passwordConfirmation",
]);

const registrationFieldAliases: Record<string, RegisterFieldName> = {
  password_confirmation: "passwordConfirmation",
  location: "shortAddress",
};

export function RegisterForm() {
  const [phase, setPhase] = React.useState<RegisterPhase>("phase-1");
  const [values, setValues] = React.useState<RegisterValues>(INITIAL_REGISTER_VALUES);
  const [acceptTerms, setAcceptTerms] = React.useState(false);
  const [confirmAccuracy, setConfirmAccuracy] = React.useState(false);
  const [errors, setErrors] = React.useState<RegisterFieldErrors>({});
  const registerMutation = useRegisterOrganization();

  const updateValue = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = event.target;
      const field = name as RegisterFieldName;
      setValues((current) => ({ ...current, [field]: value }));
      setErrors((current) => ({ ...current, [field]: undefined, root: undefined }));
    },
    [],
  );

  function validatePhaseOne(): RegisterFieldErrors {
    const next: RegisterFieldErrors = {};
    if (!values.ownerName.trim()) next.ownerName = "الاسم الكامل مطلوب.";
    if (!values.ownerEmail.trim()) next.ownerEmail = "البريد الإلكتروني مطلوب.";
    else if (!/^\S+@\S+\.\S+$/.test(values.ownerEmail)) {
      next.ownerEmail = "صيغة البريد الإلكتروني غير صحيحة.";
    }
    if (!values.ownerPhone.trim()) next.ownerPhone = "رقم الجوال مطلوب.";
    if (values.password.length < 8) {
      next.password = "كلمة المرور يجب أن تكون 8 أحرف على الأقل.";
    }
    if (values.password !== values.passwordConfirmation) {
      next.passwordConfirmation = "تأكيد كلمة المرور غير متطابق.";
    }
    return next;
  }

  function validatePhaseTwo(): RegisterFieldErrors {
    const next: RegisterFieldErrors = {};
    if (!values.companyName.trim()) next.companyName = "اسم المنظمة مطلوب.";
    if (!values.organizationType) next.organizationType = "نوع المنظمة مطلوب.";
    if (!values.registrationNumber.trim()) {
      next.registrationNumber = "رقم السجل أو الترخيص مطلوب.";
    }
    if (!values.companyEmail.trim()) next.companyEmail = "البريد الرسمي مطلوب.";
    else if (!/^\S+@\S+\.\S+$/.test(values.companyEmail)) {
      next.companyEmail = "صيغة البريد الرسمي غير صحيحة.";
    }
    if (!values.companyPhone.trim()) next.companyPhone = "الهاتف الرسمي مطلوب.";
    if (!values.city.trim()) next.city = "المدينة مطلوبة.";
    if (!values.shortAddress.trim()) next.shortAddress = "العنوان المختصر مطلوب.";
    if (values.website && !/^https?:\/\//i.test(values.website)) {
      next.website = "ابدأ رابط الموقع بـ http:// أو https://";
    }
    if (!acceptTerms || !confirmAccuracy) {
      next.root = "يجب الموافقة على الشروط والإقرار بصحة البيانات قبل الإرسال.";
    }
    return next;
  }

  function moveToPhaseTwo() {
    const validationErrors = validatePhaseOne();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setErrors({});
    setPhase("phase-2");
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const validationErrors = {
      ...validatePhaseOne(),
      ...validatePhaseTwo(),
    };

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      const hasPhaseOneError = Object.keys(validationErrors).some((field) =>
        phaseOneFields.has(field as RegisterFieldName),
      );
      if (hasPhaseOneError) setPhase("phase-1");
      return;
    }

    setErrors({});
    registerMutation.mutate(
      {
        companyName: values.companyName.trim(),
        companyEmail: values.companyEmail.trim(),
        companyPhone: values.companyPhone.trim(),
        organizationType: values.organizationType,
        registrationNumber: values.registrationNumber.trim(),
        location: [values.city.trim(), values.shortAddress.trim()]
          .filter(Boolean)
          .join(" - "),
        ownerName: values.ownerName.trim(),
        ownerEmail: values.ownerEmail.trim(),
        ownerPhone: values.ownerPhone.trim(),
        password: values.password,
        password_confirmation: values.passwordConfirmation,
        description: values.description.trim() || undefined,
        website: values.website.trim() || undefined,
        establishmentDate: values.establishmentDate || undefined,
      },
      {
        onError: (error) => {
          if (error instanceof AuthFlowError) {
            setErrors({ root: error.message });
            return;
          }

          const normalized = normalizeApiError<RegisterFieldName>(error, {
            fieldAliases: registrationFieldAliases,
          });
          const fieldErrors: RegisterFieldErrors = {
            ...normalized.fieldErrors,
            root: normalized.message,
          };
          setErrors(fieldErrors);

          const hasPhaseOneError = Object.keys(normalized.fieldErrors).some((field) =>
            phaseOneFields.has(field as RegisterFieldName),
          );
          if (hasPhaseOneError) setPhase("phase-1");
        },
      },
    );
  }

  return (
    <div
      dir="rtl"
      className="w-full max-w-2xl text-right md:flex md:h-full md:min-h-0 md:max-h-full md:flex-col md:overflow-hidden"
    >
      <div className="space-y-2">
        <p className="text-xs font-medium tracking-wide text-primary">انضم إلى جود</p>
        <h2 className="text-2xl font-semibold text-foreground">تسجيل منظمة جديدة</h2>
        <p className="text-sm leading-6 text-muted-foreground">
          خطوتان بسيطتان تفصلان منظمتك عن تقديم طلب الانضمام والمراجعة.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="mt-6 space-y-5 md:flex md:min-h-0 md:flex-1 md:flex-col md:overflow-hidden"
      >
        <Tabs
          dir="rtl"
          value={phase}
          onValueChange={(value) => {
            if (value === "phase-2") moveToPhaseTwo();
            else {
              setErrors((current) => ({ ...current, root: undefined }));
              setPhase("phase-1");
            }
          }}
          className="gap-4 md:flex md:min-h-0 md:flex-1 md:flex-col"
        >
          <TabsList className="grid h-auto w-full grid-cols-2 rounded-xl bg-muted/60 p-2">
            <TabsTrigger value="phase-1" className="rounded-lg py-2 text-xs font-medium">
              1. حساب المالك
            </TabsTrigger>
            <TabsTrigger value="phase-2" className="rounded-lg py-2 text-xs font-medium">
              2. بيانات المنظمة
            </TabsTrigger>
          </TabsList>

          <div className="md:min-h-0 md:flex-1 md:overflow-y-auto md:px-1">
            <TabsContent value="phase-1">
              <RegisterPhaseOneFields
                values={values}
                errors={errors}
                disabled={registerMutation.isPending}
                onInputChange={updateValue}
              />
            </TabsContent>

            <TabsContent value="phase-2">
              <RegisterPhaseTwoFields
                values={values}
                errors={errors}
                disabled={registerMutation.isPending}
                acceptTerms={acceptTerms}
                confirmAccuracy={confirmAccuracy}
                onOrganizationTypeChange={(organizationType: OrganizationType) => {
                  setValues((current) => ({ ...current, organizationType }));
                  setErrors((current) => ({
                    ...current,
                    organizationType: undefined,
                    root: undefined,
                  }));
                }}
                onAcceptTermsChange={(checked) => {
                  setAcceptTerms(checked);
                  setErrors((current) => ({ ...current, root: undefined }));
                }}
                onConfirmAccuracyChange={(checked) => {
                  setConfirmAccuracy(checked);
                  setErrors((current) => ({ ...current, root: undefined }));
                }}
                onInputChange={updateValue}
              />
            </TabsContent>
          </div>
        </Tabs>

        {errors.root ? (
          <p
            role="alert"
            className="rounded-xl border border-destructive/30 bg-destructive/10 px-3 py-2 text-xs leading-5 text-destructive"
          >
            {errors.root}
          </p>
        ) : null}

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border pt-4">
          <p className="text-xs text-muted-foreground">
            لديك حساب بالفعل؟{" "}
            <Link href="/login" className="font-semibold text-primary hover:underline">
              تسجيل الدخول
            </Link>
          </p>

          <div className="flex items-center gap-2">
            {phase === "phase-2" ? (
              <Button
                type="button"
                variant="outline"
                disabled={registerMutation.isPending}
                onClick={() => setPhase("phase-1")}
              >
                السابق
              </Button>
            ) : null}

            {phase === "phase-1" ? (
              <Button
                type="button"
                disabled={registerMutation.isPending}
                onClick={moveToPhaseTwo}
              >
                التالي: بيانات المنظمة
              </Button>
            ) : (
              <Button type="submit" disabled={registerMutation.isPending}>
                {registerMutation.isPending
                  ? "جارٍ إرسال الطلب..."
                  : "إرسال طلب التسجيل"}
              </Button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}
