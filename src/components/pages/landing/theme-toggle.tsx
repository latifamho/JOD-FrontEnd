"use client";

import * as React from "react";
import { Monitor, Moon, Sun } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

type ThemeMode = "light" | "dark" | "system";

const THEME_STORAGE_KEY = "jod:theme-mode";

const THEME_CHOICES: ReadonlyArray<{
  mode: ThemeMode;
  label: string;
  Icon: typeof Sun;
}> = [
  { mode: "light", label: "فاتح", Icon: Sun },
  { mode: "dark", label: "داكن", Icon: Moon },
  { mode: "system", label: "حسب النظام", Icon: Monitor },
];

function getSystemThemeIsDark() {
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
}

function applyThemeMode(themeMode: ThemeMode) {
  const isDark =
    themeMode === "dark" || (themeMode === "system" && getSystemThemeIsDark());
  document.documentElement.classList.toggle("dark", isDark);
}

function readStoredThemeMode(): ThemeMode {
  const storedTheme = window.localStorage.getItem(THEME_STORAGE_KEY);
  if (storedTheme === "light" || storedTheme === "dark" || storedTheme === "system") {
    return storedTheme;
  }
  return "system";
}

type ThemeToggleProps = {
  readonly className?: string;
};

export function ThemeToggle({ className }: ThemeToggleProps) {
  const [themeMode, setThemeMode] = React.useState<ThemeMode>(() =>
    typeof window === "undefined" ? "system" : readStoredThemeMode(),
  );

  React.useEffect(() => {
    window.localStorage.setItem(THEME_STORAGE_KEY, themeMode);
    applyThemeMode(themeMode);

    if (themeMode !== "system") return;

    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = () => applyThemeMode("system");

    media.addEventListener("change", handleChange);
    return () => media.removeEventListener("change", handleChange);
  }, [themeMode]);

  const ActiveIcon =
    THEME_CHOICES.find((choice) => choice.mode === themeMode)?.Icon ?? Monitor;

  return (
    <DropdownMenu dir="rtl">
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className={cn("rounded-full text-muted-foreground hover:text-primary", className)}
        >
          <ActiveIcon className="size-4.5" />
          <span className="sr-only">تبديل المظهر</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-40 text-right">
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
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
