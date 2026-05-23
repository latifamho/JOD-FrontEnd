const HAS_TIMEZONE_PATTERN = /(Z|[+-]\d{2}:\d{2})$/i;

function toUtcDate(input: string): Date {
  const normalizedInput = HAS_TIMEZONE_PATTERN.test(input) ? input : `${input}Z`;
  return new Date(normalizedInput);
}

function toTwoDigits(value: number): string {
  return String(value).padStart(2, "0");
}

export function toUtcTimestamp(input: string): number {
  return toUtcDate(input).getTime();
}

export function formatUtcDate(input: string): string {
  const date = toUtcDate(input);
  const year = date.getUTCFullYear();
  const month = toTwoDigits(date.getUTCMonth() + 1);
  const day = toTwoDigits(date.getUTCDate());

  return `${year}/${month}/${day}`;
}

export function formatUtcDateTime(input: string): string {
  const date = toUtcDate(input);
  const datePart = formatUtcDate(input);
  const hours = toTwoDigits(date.getUTCHours());
  const minutes = toTwoDigits(date.getUTCMinutes());

  return `${datePart} ${hours}:${minutes}`;
}

