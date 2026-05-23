"use client";

import * as React from "react";

export const PAGINATION_DOTS = "dots" as const;

export type PaginationItem = number | typeof PAGINATION_DOTS;

type UsePaginationOptions = {
  totalItems: number;
  pageSize?: number;
  initialPage?: number;
  siblingCount?: number;
};

function createRange(start: number, end: number): number[] {
  const length = end - start + 1;
  return Array.from({ length }, (_, index) => start + index);
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

export function usePagination({
  totalItems,
  pageSize = 10,
  initialPage = 1,
  siblingCount = 1,
}: UsePaginationOptions) {
  const safeTotalItems = Math.max(0, totalItems);
  const safePageSize = Math.max(1, pageSize);
  const totalPages = Math.max(1, Math.ceil(safeTotalItems / safePageSize));

  const [currentPage, setCurrentPage] = React.useState(
    clamp(initialPage, 1, totalPages),
  );

  React.useEffect(() => {
    setCurrentPage((previousPage) => clamp(previousPage, 1, totalPages));
  }, [totalPages]);

  const hasPreviousPage = currentPage > 1;
  const hasNextPage = currentPage < totalPages;

  const goToPage = React.useCallback(
    (page: number) => {
      setCurrentPage(clamp(page, 1, totalPages));
    },
    [totalPages],
  );

  const goToPreviousPage = React.useCallback(() => {
    setCurrentPage((previousPage) => clamp(previousPage - 1, 1, totalPages));
  }, [totalPages]);

  const goToNextPage = React.useCallback(() => {
    setCurrentPage((previousPage) => clamp(previousPage + 1, 1, totalPages));
  }, [totalPages]);

  const startIndex = (currentPage - 1) * safePageSize;
  const endIndex = Math.min(startIndex + safePageSize, safeTotalItems);

  const paginationRange = React.useMemo(() => {
    const totalPageNumbers = siblingCount + 5;

    if (totalPageNumbers >= totalPages) {
      return createRange(1, totalPages) as PaginationItem[];
    }

    const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
    const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPages);

    const shouldShowLeftDots = leftSiblingIndex > 2;
    const shouldShowRightDots = rightSiblingIndex < totalPages - 2;

    const firstPageIndex = 1;
    const lastPageIndex = totalPages;

    if (!shouldShowLeftDots && shouldShowRightDots) {
      const leftItemCount = 3 + 2 * siblingCount;
      const leftRange = createRange(1, leftItemCount);
      return [...leftRange, PAGINATION_DOTS, totalPages];
    }

    if (shouldShowLeftDots && !shouldShowRightDots) {
      const rightItemCount = 3 + 2 * siblingCount;
      const rightRange = createRange(totalPages - rightItemCount + 1, totalPages);
      return [firstPageIndex, PAGINATION_DOTS, ...rightRange];
    }

    const middleRange = createRange(leftSiblingIndex, rightSiblingIndex);
    return [
      firstPageIndex,
      PAGINATION_DOTS,
      ...middleRange,
      PAGINATION_DOTS,
      lastPageIndex,
    ];
  }, [currentPage, siblingCount, totalPages]);

  return {
    currentPage,
    totalPages,
    hasPreviousPage,
    hasNextPage,
    startIndex,
    endIndex,
    paginationRange,
    goToPage,
    goToPreviousPage,
    goToNextPage,
    setCurrentPage,
  };
}

