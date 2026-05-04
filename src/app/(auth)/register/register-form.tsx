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
  type RegisterPhase,
  type RegisterValues,
} from "@/app/(auth)/register/register-form.types";

export function RegisterForm() {
  const [phase, setPhase] = React.useState<RegisterPhase>("phase-1");
  const [values, setValues] = React.useState<RegisterValues>(
    INITIAL_REGISTER_VALUES,
  );
  const [organizationType, setOrganizationType] = React.useState<
    OrganizationType | ""
  >("");
  const [acceptTerms, setAcceptTerms] = React.useState(false);
  const [confirmAccuracy, setConfirmAccuracy] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState("");
  const [successMessage, setSuccessMessage] = React.useState("");

  const updateValue = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = event.target;
      setValues((currentValues) => ({
        ...currentValues,
        [name]: value,
      }));
    },
    [],
  );

  const validatePhaseOne = React.useCallback(() => {
    if (
      !values.adminFullName.trim() ||
      !values.adminEmail.trim() ||
      !values.adminPhone.trim() ||
      !values.password.trim() ||
      !values.confirmPassword.trim()
    ) {
      return "يرجى إكمال جميع حقول المرحلة الأولى.";
    }

    if (values.password !== values.confirmPassword) {
      return "كلمة المرور وتأكيد كلمة المرور غير متطابقين.";
    }

    return "";
  }, [values]);

  const validatePhaseTwo = React.useCallback(() => {
    if (
      !values.organizationNameAr.trim() ||
      !organizationType ||
      !values.registrationNumber.trim() ||
      !values.establishmentDate.trim() ||
      !values.city.trim() ||
      !values.shortAddress.trim() ||
      !values.organizationDescription.trim() ||
      !values.officialEmail.trim() ||
      !values.officialPhone.trim()
    ) {
      return "يرجى إكمال جميع الحقول الأساسية في المرحلة الثانية.";
    }

    if (!acceptTerms || !confirmAccuracy) {
      return "يجب الموافقة على الشروط والإقرار بصحة البيانات قبل الإرسال.";
    }

    return "";
  }, [acceptTerms, confirmAccuracy, organizationType, values]);

  const handleTabChange = React.useCallback(
    (value: string) => {
      const nextPhase = value as RegisterPhase;
      if (nextPhase === "phase-2") {
        const validationError = validatePhaseOne();
        if (validationError) {
          setErrorMessage(validationError);
          setSuccessMessage("");
          return;
        }
      }

      setErrorMessage("");
      setSuccessMessage("");
      setPhase(nextPhase);
    },
    [validatePhaseOne],
  );

  const handleNextPhase = React.useCallback(() => {
    handleTabChange("phase-2");
  }, [handleTabChange]);

  const handlePreviousPhase = React.useCallback(() => {
    setErrorMessage("");
    setSuccessMessage("");
    setPhase("phase-1");
  }, []);

  const handleSubmit = React.useCallback(
    (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      const validationError = validatePhaseTwo();

      if (validationError) {
        setErrorMessage(validationError);
        setSuccessMessage("");
        return;
      }

      setErrorMessage("");
      setSuccessMessage("تم تجهيز طلب التسجيل بنجاح. بانتظار ربط الإرسال مع الـ API.");
    },
    [validatePhaseTwo],
  );

  const isPhaseOne = phase === "phase-1";
  const isPhaseTwo = phase === "phase-2";

  return (
    <div
      dir="rtl"
      className={`w-full max-w-2xl text-right md:flex md:h-full md:min-h-0 md:max-h-full md:flex-col md:overflow-hidden ${
        isPhaseOne ? "md:justify-center" : ""
      }`}
    >
      <div className="space-y-2">
        <p className="text-xs font-medium tracking-wide text-primary">إنشاء حساب منظمة</p>
        <h2 className="text-2xl font-semibold text-foreground">تسجيل منظمة جديدة</h2>
        <p className="text-sm text-muted-foreground">
          النموذج مقسم إلى مرحلتين: المرحلة الأولى ثم المرحلة الثانية لضمان تجربة
          تسجيل أسهل.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className={`mt-6 space-y-6 md:flex md:min-h-0 md:flex-col md:space-y-4 ${
          isPhaseTwo ? "md:flex-1 md:overflow-hidden" : ""
        }`}
      >
        <Tabs
          dir="rtl"
          value={phase}
          onValueChange={handleTabChange}
          className={`gap-4 ${
            isPhaseTwo ? "md:flex md:min-h-0 md:flex-1 md:flex-col" : ""
          }`}
        >
          <TabsList className="grid h-auto w-full grid-cols-2 rounded-xl bg-muted/60 p-2">
            <TabsTrigger
              value="phase-1"
              className="rounded-lg py-2 text-xs font-medium data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              المرحلة الأولى
            </TabsTrigger>
            <TabsTrigger
              value="phase-2"
              className="rounded-lg py-2 text-xs font-medium data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              المرحلة الثانية
            </TabsTrigger>
          </TabsList>

          <TabsContent value="phase-1">
            <RegisterPhaseOneFields values={values} onInputChange={updateValue} />
          </TabsContent>
          <TabsContent value="phase-2" className="md:min-h-0 md:flex-1">
            <div className="md:h-full md:overflow-y-auto md:p-2">
              <RegisterPhaseTwoFields
                values={values}
                organizationType={organizationType}
                onOrganizationTypeChange={setOrganizationType}
                acceptTerms={acceptTerms}
                onAcceptTermsChange={setAcceptTerms}
                confirmAccuracy={confirmAccuracy}
                onConfirmAccuracyChange={setConfirmAccuracy}
                onInputChange={updateValue}
              />
            </div>
          </TabsContent>
        </Tabs>

        {errorMessage ? (
          <p className="rounded-xl border border-destructive/30 bg-destructive/10 px-3 py-2 text-xs text-destructive">
            {errorMessage}
          </p>
        ) : null}

        {successMessage ? (
          <p className="rounded-xl border border-emerald-300/60 bg-emerald-50 px-3 py-2 text-xs text-emerald-700">
            {successMessage}
          </p>
        ) : null}

        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="text-xs text-muted-foreground">
            لديك حساب بالفعل؟{" "}
            <Link href="/login" className="font-semibold text-primary hover:underline">
              تسجيل الدخول
            </Link>
          </div>

          <div className="flex items-center gap-2">
            {phase === "phase-2" ? (
              <Button type="button" variant="outline" onClick={handlePreviousPhase}>
                السابق
              </Button>
            ) : null}

            {phase === "phase-1" ? (
              <Button type="button" onClick={handleNextPhase}>
                التالي: المرحلة الثانية
              </Button>
            ) : (
              <Button type="submit">إرسال طلب التسجيل</Button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}
