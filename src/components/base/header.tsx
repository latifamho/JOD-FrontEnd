"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { CheckIcon, ChevronDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { SIDEBAR_TOGGLE_EVENT } from "@/constant/events";
import { AppIcons } from "@/constant/icons";
import {
  dashboardRoleLabels,
  getPageTitle,
  getRoleFromPath,
  getRoleSettingsRoute,
  type DashboardRole,
} from "@/constant/routes";
import { useLogout } from "@/features/shared/auth.services/auth.query";
import { useAuth } from "@/providers/AuthProvider";
import { cn } from "@/lib/utils";

type ThemeMode = "light" | "dark" | "system";

const THEME_STORAGE_KEY = "jod:theme-mode";

function getSystemThemeIsDark() {
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
}

function applyThemeMode(themeMode: ThemeMode) {
  const isDark =
    themeMode === "dark" || (themeMode === "system" && getSystemThemeIsDark());
  document.documentElement.classList.toggle("dark", isDark);
}

const THEME_CHOICES: {
  mode: ThemeMode;
  label: string;
  Icon: typeof AppIcons.themeLight;
}[] = [
  { mode: "light", label: "فاتح", Icon: AppIcons.themeLight },
  { mode: "dark", label: "داكن", Icon: AppIcons.themeDark },
  { mode: "system", label: "حسب النظام", Icon: AppIcons.themeSystem },
];

export function Header() {
  const pathname = usePathname();
  const role = getRoleFromPath(pathname);
  const pageTitle = getPageTitle(pathname);

  const { user } = useAuth();
  const logoutMutation = useLogout();

  const [themeMode, setThemeMode] = React.useState<ThemeMode>("system");

  const displayName = user?.name ?? dashboardRoleLabels[role];
  const displayEmail = user?.email ?? "";
  const avatarLetter = displayName.charAt(0);
  const settingsRoute = getRoleSettingsRoute(role);

  const ThemeIcon =
    THEME_CHOICES.find((t) => t.mode === themeMode)?.Icon ?? AppIcons.themeSystem;

  React.useEffect(() => {
    const storedTheme = window.localStorage.getItem(THEME_STORAGE_KEY);
    const safeThemeMode: ThemeMode =
      storedTheme === "light" ||
      storedTheme === "dark" ||
      storedTheme === "system"
        ? storedTheme
        : "system";

    setThemeMode(safeThemeMode);
    applyThemeMode(safeThemeMode);
  }, []);

  React.useEffect(() => {
    window.localStorage.setItem(THEME_STORAGE_KEY, themeMode);
    applyThemeMode(themeMode);

    if (themeMode !== "system") {
      return;
    }

    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const handleThemeChange = () => applyThemeMode("system");

    media.addEventListener("change", handleThemeChange);
    return () => media.removeEventListener("change", handleThemeChange);
  }, [themeMode]);

  return (
    <header className="sticky top-0 z-30 border-b border-border/50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center justify-between px-4 lg:px-6">
        <div className="flex min-w-0 items-center gap-3">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() =>
              window.dispatchEvent(new Event(SIDEBAR_TOGGLE_EVENT))
            }
          >
            <AppIcons.menu className="size-5" />
            <span className="sr-only">فتح القائمة</span>
          </Button>

          <div className="min-w-0">
            <p className="truncate text-xs text-muted-foreground">
              {dashboardRoleLabels[role]}
            </p>
            <h1 className="truncate text-sm font-semibold text-foreground sm:text-base">
              {pageTitle}
            </h1>
          </div>
        </div>

        <DropdownMenu dir="rtl">
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="group h-10 gap-2 rounded-full px-1.5 ring-1 ring-transparent transition-all duration-200 hover:ring-border/60 data-[state=open]:bg-accent data-[state=open]:ring-border/60 sm:px-2"
            >
              {/* Avatar with status dot */}
              <div className="relative">
                <div className="flex size-8 items-center justify-center rounded-full bg-gradient-to-br from-primary/70 to-primary text-sm font-semibold text-primary-foreground shadow-sm">
                  {avatarLetter}
                </div>
                <span className="absolute bottom-0 end-0 size-2 rounded-full bg-emerald-500 ring-1 ring-background" />
              </div>

              {/* Name + role label */}
              <div className="hidden text-right sm:block">
                <p className="text-xs font-semibold leading-4 text-foreground">
                  {displayName}
                </p>
              </div>

              {/* Chevron indicator */}
              <ChevronDown className="hidden size-3.5 text-muted-foreground transition-transform duration-200 group-data-[state=open]:rotate-180 sm:block" />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            className="w-72 max-w-[calc(100vw-1rem)] overflow-hidden p-0 text-right"
            align="end"
            side="bottom"
            sideOffset={8}
            collisionPadding={12}
          >
            {/* Profile banner */}
            <div className="bg-gradient-to-bl from-primary/15 via-primary/5 to-transparent px-4 pb-3 pt-4">
              <div className="flex items-center gap-3">
                <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary/70 to-primary text-lg font-bold text-primary-foreground shadow-md ring-2 ring-background">
                  {avatarLetter}
                </div>
                <div className="min-w-0 flex-1 text-right">
                  <p className="truncate text-sm font-semibold text-foreground">
                    {displayName}
                  </p>
                  <p className="truncate text-xs text-muted-foreground">
                    {displayEmail}
                  </p>
                </div>
              </div>
            </div>

            <div className="p-1">
              {settingsRoute ? (
                <>
                  <DropdownMenuItem asChild>
                    <Link href={settingsRoute} className="cursor-pointer py-2">
                      <div className="flex size-7 shrink-0 items-center justify-center rounded-md bg-muted">
                        <AppIcons.settings className="size-3.5 text-muted-foreground" />
                      </div>
                      الإعدادات
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                </>
              ) : null}

              <DropdownMenuSub>
                <DropdownMenuSubTrigger className="cursor-pointer py-2">
                  <div className="flex size-7 shrink-0 items-center justify-center rounded-md bg-muted">
                    <ThemeIcon className="size-3.5 text-muted-foreground" />
                  </div>
                  المظهر
                  <span className="text-[10px] text-muted-foreground">
                    {THEME_CHOICES.find((t) => t.mode === themeMode)?.label}
                  </span>
                </DropdownMenuSubTrigger>
                <DropdownMenuSubContent
                  className="min-w-44 text-right"
                  sideOffset={4}
                  alignOffset={-4}
                >
                  {THEME_CHOICES.map(({ mode, label, Icon }) => (
                    <DropdownMenuItem
                      key={mode}
                      className={cn(
                        "cursor-pointer",
                        themeMode === mode && "bg-primary/10 text-primary",
                      )}
                      onSelect={() => setThemeMode(mode)}
                    >
                      <Icon className="size-4" />
                      {label}
                      {themeMode === mode && (
                        <CheckIcon className="ms-auto size-3.5 text-primary" />
                      )}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuSubContent>
              </DropdownMenuSub>

              <DropdownMenuSeparator />

              <DropdownMenuItem
                variant="destructive"
                className="group/logout cursor-pointer py-2"
                disabled={logoutMutation.isPending}
                onSelect={() => logoutMutation.mutate()}
              >
                <div className="flex size-7 shrink-0 items-center justify-center rounded-md bg-destructive/10 transition-colors group-focus/logout:bg-destructive/20">
                  <AppIcons.logout className="size-3.5 text-destructive" />
                </div>
                تسجيل الخروج
              </DropdownMenuItem>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
