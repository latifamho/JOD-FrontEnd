"use client";

import Image from "next/image";
import Link from "next/link";

import notFoundImage from "@/assets/images/404.png";
import { Button } from "@/components/ui/button";
import {
  getDashboardHomeByRole,
  type DashboardRole,
} from "@/constant/routes";
import { useAuth } from "@/providers/AuthProvider";

function toRouteRole(
  role: "admin" | "org_owner" | "org_staff",
): DashboardRole {
  if (role === "admin") return "admin";
  return role === "org_owner" ? "organization_owner" : "organization_staff";
}

export default function NotFound() {
  const { dashboardRole, isAuthenticated, isLoading } = useAuth();
  const homeHref = dashboardRole
    ? getDashboardHomeByRole(toRouteRole(dashboardRole))
    : "/login";

  return (
    <main
      dir="rtl"
      className="flex min-h-screen items-center justify-center bg-background px-4 py-10 sm:px-6"
    >
      <section className="mx-auto flex w-full max-w-3xl flex-col items-center text-center">
        <Image
          src={notFoundImage}
          alt="الصفحة غير موجودة"
          priority
          sizes="(max-width: 640px) 92vw, 620px"
          className="h-auto w-full max-w-[620px] object-contain"
        />

        <div className="-mt-2 max-w-xl space-y-3 sm:-mt-6">
          <p className="text-sm font-semibold text-primary">خطأ 404</p>
          <h1 className="text-2xl font-bold text-foreground sm:text-3xl">
            الصفحة غير موجودة
          </h1>
          <p className="text-sm leading-7 text-muted-foreground sm:text-base">
            الرابط الذي تحاول الوصول إليه غير موجود، أو تم حذفه، أو لم يعد متاحاً.
          </p>
        </div>

        <div className="mt-6 flex min-h-10 items-center justify-center">
          {isLoading ? (
            <div
              aria-label="جاري تجهيز رابط العودة"
              className="h-10 w-48 animate-pulse rounded-md bg-muted"
            />
          ) : (
            <Button asChild size="lg">
              <Link href={homeHref}>
                {isAuthenticated ? "العودة إلى لوحة التحكم" : "العودة إلى تسجيل الدخول"}
              </Link>
            </Button>
          )}
        </div>
      </section>
    </main>
  );
}
