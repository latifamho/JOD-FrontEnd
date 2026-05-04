export const PAGE_SIZE_OPTIONS = [9, 12, 18, 24] as const;

export const DEFAULT_PAGE_SIZE = PAGE_SIZE_OPTIONS[0];

export type PageSizeOption = (typeof PAGE_SIZE_OPTIONS)[number];
