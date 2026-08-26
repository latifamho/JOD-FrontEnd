export type ThemeMode = "light" | "dark" | "system";

export const THEME_STORAGE_KEY = "jod:theme-mode";

export function getSystemThemeIsDark(): boolean {
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
}

export function resolveIsDark(themeMode: ThemeMode): boolean {
  return (
    themeMode === "dark" ||
    (themeMode === "system" && getSystemThemeIsDark())
  );
}

export function applyThemeMode(themeMode: ThemeMode): void {
  document.documentElement.classList.toggle("dark", resolveIsDark(themeMode));
}

export function readStoredThemeMode(): ThemeMode {
  try {
    const storedTheme = window.localStorage.getItem(THEME_STORAGE_KEY);
    if (
      storedTheme === "light" ||
      storedTheme === "dark" ||
      storedTheme === "system"
    ) {
      return storedTheme;
    }
  } catch {
    // ignore storage access errors
  }
  return "system";
}

export function setStoredThemeMode(themeMode: ThemeMode): void {
  try {
    window.localStorage.setItem(THEME_STORAGE_KEY, themeMode);
  } catch {
    // ignore storage access errors
  }
}

/** Inline boot script — keeps landing ↔ dashboard theme in sync before React hydrates. */
export const THEME_BOOT_SCRIPT = `(function(){try{var k=${JSON.stringify(THEME_STORAGE_KEY)};var m=localStorage.getItem(k);var dark=m==="dark"||(m!=="light"&&window.matchMedia("(prefers-color-scheme: dark)").matches);document.documentElement.classList.toggle("dark",dark);}catch(e){}})();`;
