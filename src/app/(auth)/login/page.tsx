"use client";

import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PasswordInput } from "@/components/ui/password-input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useLogin } from "@/features/shared/auth.services/auth.query";
import { AuthFlowError } from "@/features/shared/auth.services/auth.utils";
import type { LoginAccountType } from "@/features/shared/auth.services/auth.type";
import { normalizeApiError } from "@/lib/api-errors";

const loginSchema = z.object({
  accountType: z.enum(["admin", "organization"]),
  email: z
    .string()
    .min(1, "البريد الإلكتروني مطلوب")
    .email("البريد الإلكتروني غير صحيح"),
  password: z
    .string()
    .min(1, "كلمة المرور مطلوبة")
    .min(8, "كلمة المرور يجب أن تكون 8 أحرف على الأقل"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const accountOptions: Array<{
  value: LoginAccountType;
  title: string;
  description: string;
}> = [
  {
    value: "admin",
    title: "إدارة المنصة",
    description: "للوصول إلى لوحة إدارة جود ومراجعة المنظمات والمحتوى.",
  },
  {
    value: "organization",
    title: "حساب منظمة",
    description: "لمالك المنظمة أو أحد موظفيها المعتمدين.",
  },
];

export default function LoginPage() {
  const { mutate: submitLogin, isPending } = useLogin();
  const {
    register,
    handleSubmit,
    setError,
    clearErrors,
    setValue,
    watch,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { accountType: "organization" },
  });

  const accountType = watch("accountType");

  const onSubmit = (values: LoginFormValues) => {
    clearErrors();
    submitLogin(values, {
      onError: (error) => {
        if (error instanceof AuthFlowError) {
          setError("root", { type: "server", message: error.message });
          return;
        }

        const normalized = normalizeApiError<keyof LoginFormValues>(error, {
          isLogin: true,
        });
        Object.entries(normalized.fieldErrors).forEach(([field, message]) => {
          if (message) {
            setError(field as keyof LoginFormValues, {
              type: "server",
              message,
            });
          }
        });
        setError("root", { type: "server", message: normalized.message });
      },
    });
  };

  return (
    <div className="w-full max-w-lg md:self-center">
      <div className="space-y-2">
        <p className="text-xs font-medium tracking-wide text-primary">مرحبًا بك</p>
        <h2 className="text-2xl font-semibold text-foreground">تسجيل الدخول</h2>
        <p className="text-sm leading-6 text-muted-foreground">
          اختر نوع الحساب أولاً حتى نوجّه طلب الدخول إلى المسار الصحيح.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-7 space-y-5">
        <div className="space-y-2">
          <Label htmlFor="accountType">نوع الحساب</Label>
          <Select
            dir="rtl"
            value={accountType}
            disabled={isPending}
            onValueChange={(value) => {
              setValue("accountType", value as LoginAccountType, {
                shouldDirty: true,
                shouldValidate: true,
              });
              clearErrors("root");
            }}
          >
            <SelectTrigger
              id="accountType"
              className="h-11 w-full rounded-xl bg-background/85"
            >
              <SelectValue placeholder="اختر نوع الحساب" />
            </SelectTrigger>
            <SelectContent align="start" position="popper">
              {accountOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <input type="hidden" {...register("accountType")} />
          <p className="text-xs leading-5 text-muted-foreground">
            {accountOptions.find((option) => option.value === accountType)?.description}
          </p>
          {errors.accountType ? (
            <p className="text-xs text-destructive">{errors.accountType.message}</p>
          ) : null}
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">البريد الإلكتروني</Label>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="name@example.com"
            disabled={isPending}
            className="h-11 rounded-xl bg-background/85"
            {...register("email")}
          />
          {errors.email ? (
            <p className="text-xs text-destructive">{errors.email.message}</p>
          ) : null}
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">كلمة المرور</Label>
          <PasswordInput
            id="password"
            autoComplete="current-password"
            placeholder="••••••••"
            disabled={isPending}
            className="h-11 rounded-xl bg-background/85"
            {...register("password")}
          />
          {errors.password ? (
            <p className="text-xs text-destructive">{errors.password.message}</p>
          ) : null}
        </div>

        {errors.root ? (
          <div
            role="alert"
            className="rounded-xl border border-destructive/30 bg-destructive/5 px-3 py-2 text-xs leading-5 text-destructive"
          >
            {errors.root.message}
          </div>
        ) : null}

        <Button
          type="submit"
          disabled={isPending}
          className="h-11 w-full rounded-xl text-sm font-semibold"
        >
          {isPending ? "جارٍ تسجيل الدخول..." : "تسجيل الدخول"}
        </Button>

        <p className="text-center text-xs text-muted-foreground">
          لا تملك حساب منظمة؟{" "}
          <Link href="/register" className="font-semibold text-primary hover:underline">
            إنشاء حساب جديد
          </Link>
        </p>
      </form>
    </div>
  );
}
