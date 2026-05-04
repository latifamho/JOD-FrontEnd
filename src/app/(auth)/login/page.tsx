import type { Metadata } from "next";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const metadata: Metadata = {
  title: "تسجيل الدخول | منصة جود",
  description: "صفحة تسجيل الدخول إلى منصة جود",
};

export default function LoginPage() {
  return (
    <div className="w-full max-w-md md:self-center">
      <div className="space-y-2">
        <p className="text-xs font-medium tracking-wide text-primary">مرحبًا بك</p>
        <h2 className="text-2xl font-semibold text-foreground">تسجيل الدخول</h2>
        <p className="text-sm text-muted-foreground">
          أدخل بريدك الإلكتروني وكلمة المرور للوصول إلى لوحة التحكم.
        </p>
      </div>

      <form className="mt-8 space-y-5">
        <div className="space-y-2">
          <Label htmlFor="email">البريد الإلكتروني</Label>
          <Input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="name@example.com"
            required
            className="h-11 rounded-xl bg-background/85"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">كلمة المرور</Label>
          <Input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            placeholder="••••••••"
            required
            className="h-11 rounded-xl bg-background/85"
          />
        </div>

        <Button type="submit" className="h-11 w-full rounded-xl text-sm font-semibold">
          تسجيل الدخول
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
