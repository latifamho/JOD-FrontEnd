export function normalizeText(value: string): string {
  return value.trim().toLowerCase();
}

const EMPTY_VALUE_PLACEHOLDER = "-";

/**
 * Formats an API-sourced value for display, falling back to "-" when the
 * value is null, undefined, or an empty/whitespace-only string.
 */
export function displayOrDash(
  value: string | number | null | undefined,
): string {
  if (value === null || value === undefined) {
    return EMPTY_VALUE_PLACEHOLDER;
  }

  if (typeof value === "string" && value.trim() === "") {
    return EMPTY_VALUE_PLACEHOLDER;
  }

  return String(value);
}
