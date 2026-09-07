"use client";

import * as React from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";

import { Logo } from "@/components/base/logo";
import { ThemeToggle } from "@/components/pages/landing/theme-toggle";
import { Button } from "@/components/ui/button";
import { getAuthenticatedLanding } from "@/features/shared/auth.services/auth.utils";
import { useAuth } from "@/providers/AuthProvider";

const NAV_LINKS = [
  { href: "#hero", label: "الرئيسية" },
  { href: "#how-it-works", label: "كيف تعمل المنصة" },
  { href: "#features", label: "المميزات" },
  { href: "#impact", label: "الأثر" },
  { href: "#audience", label: "لمن جود؟" },
] as const;

export function LandingHeader() {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const { user, dashboardContext, isAuthenticated, isLoading } = useAuth();
  const showAuthenticatedActions = isAuthenticated && dashboardContext !== null;
  const dashboardHref = dashboardContext ? getAuthenticatedLanding(dashboardContext) : "/dashboard";
  const organizationName = dashboardContext?.organization?.name ?? user?.organizationName;
  const dashboardLabel = dashboardContext?.profile.dashboardRole === "admin"
    ? "الذهاب للوحة التحكم"
    : organizationName
      ? `الذهاب للوحة ${organizationName}`
      : "الذهاب للوحة المنظمة";
  const avatarLetter = user?.name?.trim().charAt(0) || "ج";

  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 lg:px-8">
        <Link href="#hero" className="flex items-center gap-2">
          <Logo className="size-10" imageClassName="size-10" />
          <span className="text-lg font-bold text-foreground">جود</span>
        </Link>

        <nav className="hidden items-center gap-8 lg:flex">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          <ThemeToggle />
          <div className="mx-1 h-6 w-px bg-border" />
          {showAuthenticatedActions ? (
            <>
              <div
                className="flex size-9 items-center justify-center rounded-full bg-gradient-to-br from-primary/70 to-primary text-sm font-semibold text-primary-foreground shadow-sm"
                title={user?.name ?? "الملف الشخصي"}
                aria-label={user?.name ?? "الملف الشخصي"}
              >
                {avatarLetter}
              </div>
              <Button asChild>
                <Link href={dashboardHref}>{dashboardLabel}</Link>
              </Button>
            </>
          ) : !isLoading ? (
            <>
              <Button variant="ghost" asChild>
                <Link href="/login">تسجيل الدخول</Link>
              </Button>
              <Button asChild>
                <Link href="/register">سجّل منظمتك</Link>
              </Button>
            </>
          ) : null}
        </div>

        <div className="flex items-center gap-1 lg:hidden">
          <ThemeToggle />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => setIsMenuOpen((open) => !open)}
          >
            {isMenuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
            <span className="sr-only">فتح القائمة</span>
          </Button>
        </div>
      </div>

      {isMenuOpen && (
        <div className="animate-in fade-in slide-in-from-top-4 border-t border-border/60 bg-background px-4 py-4 duration-300 lg:hidden">
          <nav className="flex flex-col gap-1">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setIsMenuOpen(false)}
                className="rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-primary"
              >
                {link.label}
              </a>
            ))}
          </nav>
          <div className="mt-3 flex flex-col gap-2 border-t border-border/60 pt-3">
            {showAuthenticatedActions ? (
              <>
                <div className="flex items-center gap-2 rounded-lg border border-border/60 bg-muted/30 px-3 py-2">
                  <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary/70 to-primary text-sm font-semibold text-primary-foreground shadow-sm">
                    {avatarLetter}
                  </div>
                  <div className="min-w-0 text-right">
                    <p className="truncate text-sm font-semibold text-foreground">{user?.name}</p>
                    <p className="truncate text-xs text-muted-foreground">{user?.email}</p>
                  </div>
                </div>
                <Button asChild onClick={() => setIsMenuOpen(false)}>
                  <Link href={dashboardHref}>{dashboardLabel}</Link>
                </Button>
              </>
            ) : !isLoading ? (
              <>
                <Button variant="outline" asChild onClick={() => setIsMenuOpen(false)}>
                  <Link href="/login">تسجيل الدخول</Link>
                </Button>
                <Button asChild onClick={() => setIsMenuOpen(false)}>
                  <Link href="/register">سجّل منظمتك</Link>
                </Button>
              </>
            ) : null}
          </div>
        </div>
      )}
    </header>
  );
}
