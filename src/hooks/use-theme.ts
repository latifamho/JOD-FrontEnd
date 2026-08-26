"use client";

import * as React from "react";

import {
  applyThemeMode,
  readStoredThemeMode,
  setStoredThemeMode,
  type ThemeMode,
} from "@/lib/theme";

export function useTheme() {
  const [themeMode, setThemeModeState] = React.useState<ThemeMode>("system");
  const [isReady, setIsReady] = React.useState(false);

  React.useEffect(() => {
    const stored = readStoredThemeMode();
    setThemeModeState(stored);
    applyThemeMode(stored);
    setIsReady(true);
  }, []);

  React.useEffect(() => {
    if (!isReady) return;

    setStoredThemeMode(themeMode);
    applyThemeMode(themeMode);

    if (themeMode !== "system") return;

    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = () => applyThemeMode("system");
    media.addEventListener("change", handleChange);
    return () => media.removeEventListener("change", handleChange);
  }, [themeMode, isReady]);

  const setThemeMode = React.useCallback((mode: ThemeMode) => {
    setThemeModeState(mode);
  }, []);

  return { themeMode, setThemeMode, isReady };
}
