const HAS_TIMEZONE_PATTERN = /(Z|[+-]\d{2}:\d{2})$/i;
const EMPTY_DATE_PLACEHOLDER = "-";

function toUtcDate(input: string | null | undefined): Date | null {
  if (!input) return null;
  const normalizedInput = HAS_TIMEZONE_PATTERN.test(input) ? input : `${input}Z`;
  const date = new Date(normalizedInput);
  return Number.isNaN(date.getTime()) ? null : date;
}

function toTwoDigits(value: number): string {
  return String(value).padStart(2, "0");
}

export function toUtcTimestamp(input: string | null | undefined): number {
  return toUtcDate(input)?.getTime() ?? 0;
}

export function formatUtcDate(input: string | null | undefined): string {
  const date = toUtcDate(input);
  if (!date) return EMPTY_DATE_PLACEHOLDER;
  const year = date.getUTCFullYear();
  const month = toTwoDigits(date.getUTCMonth() + 1);
  const day = toTwoDigits(date.getUTCDate());
  return `${year}/${month}/${day}`;
}

export function formatUtcDateTime(input: string | null | undefined): string {
  const date = toUtcDate(input);
  if (!date) return EMPTY_DATE_PLACEHOLDER;
  const datePart = formatUtcDate(input);
  const hours = toTwoDigits(date.getUTCHours());
  const minutes = toTwoDigits(date.getUTCMinutes());
  return `${datePart} ${hours}:${minutes}`;
}

export function formatUtcDateOrDash(input: string | null | undefined): string {
  return formatUtcDate(input);
}

export function formatUtcDateTimeOrDash(input: string | null | undefined): string {
  return formatUtcDateTime(input);
}
