"use client";

import { Monitor, Moon, Sun } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTheme } from "@/hooks/use-theme";
import type { ThemeMode } from "@/lib/theme";
import { cn } from "@/lib/utils";

const THEME_CHOICES: ReadonlyArray<{
  mode: ThemeMode;
  label: string;
  Icon: typeof Sun;
}> = [
  { mode: "light", label: "فاتح", Icon: Sun },
  { mode: "dark", label: "داكن", Icon: Moon },
  { mode: "system", label: "حسب النظام", Icon: Monitor },
];

type ThemeToggleProps = {
  readonly className?: string;
};

export function ThemeToggle({ className }: ThemeToggleProps) {
  const { themeMode, setThemeMode } = useTheme();

  const ActiveIcon =
    THEME_CHOICES.find((choice) => choice.mode === themeMode)?.Icon ?? Monitor;

  return (
    <DropdownMenu dir="rtl">
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className={cn(
            "rounded-full text-muted-foreground hover:text-primary",
            className,
          )}
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
