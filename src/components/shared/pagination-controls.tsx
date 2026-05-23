"use client";

import { AppIcons } from "@/constant/icons";
import { PAGE_SIZE_OPTIONS } from "@/constant/pagination";
import { PAGINATION_DOTS, type PaginationItem } from "@/hooks/use-pagination";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem as PaginationSlotItem,
  PaginationLink,
} from "@/components/ui/pagination";

type PaginationControlsProps = {
  currentPage: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
  paginationRange: PaginationItem[];
  onPageChange: (page: number) => void;
  onPreviousPage: () => void;
  onNextPage: () => void;
  pageSize: number;
  onPageSizeChange: (pageSize: number) => void;
  pageSizeOptions?: readonly number[];
  className?: string;
};

export function PaginationControls({
  currentPage,
  totalPages,
  hasPreviousPage,
  hasNextPage,
  paginationRange,
  onPageChange,
  onPreviousPage,
  onNextPage,
  pageSize,
  onPageSizeChange,
  pageSizeOptions = PAGE_SIZE_OPTIONS,
  className,
}: PaginationControlsProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-between gap-3 px-4 py-3 sm:flex-row",
        className,
      )}
    >
      <div className="flex w-full flex-wrap items-center justify-between gap-3 sm:w-auto sm:justify-start">
        <p className="text-xs text-muted-foreground">
          الصفحة {currentPage} من {totalPages}
        </p>

        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">حجم الصفحة</span>
          <Select
            dir="rtl"
            value={String(pageSize)}
            onValueChange={(value) => onPageSizeChange(Number(value))}
          >
            <SelectTrigger className="h-8 w-20 text-right text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent align="start" position="popper" className="text-right">
              {pageSizeOptions.map((size) => (
                <SelectItem
                  key={`page-size-${size}`}
                  value={String(size)}
                  className="text-right text-xs"
                >
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <Pagination className="mx-0 w-auto justify-end">
        <PaginationContent>
          <PaginationSlotItem>
            <PaginationLink
              href="#"
              aria-label="الصفحة السابقة"
              onClick={(event) => {
                event.preventDefault();
                onPreviousPage();
              }}
              className={cn(
                "size-8",
                !hasPreviousPage && "pointer-events-none opacity-45",
              )}
            >
              <AppIcons.chevronRight className="size-4" />
            </PaginationLink>
          </PaginationSlotItem>

          {paginationRange.map((item, index) => {
            if (item === PAGINATION_DOTS) {
              return (
                <PaginationSlotItem key={`ellipsis-${index}`}>
                  <PaginationEllipsis />
                </PaginationSlotItem>
              );
            }

            const active = currentPage === item;
            return (
              <PaginationSlotItem key={`page-${item}`}>
                <PaginationLink
                  href="#"
                  isActive={active}
                  aria-label={`الانتقال إلى الصفحة ${item}`}
                  onClick={(event) => {
                    event.preventDefault();
                    onPageChange(item);
                  }}
                  className={cn(
                    "size-8",
                    active && "bg-primary text-primary-foreground hover:bg-primary/90",
                  )}
                >
                  {item}
                </PaginationLink>
              </PaginationSlotItem>
            );
          })}

          <PaginationSlotItem>
            <PaginationLink
              href="#"
              aria-label="الصفحة التالية"
              onClick={(event) => {
                event.preventDefault();
                onNextPage();
              }}
              className={cn(
                "size-8",
                !hasNextPage && "pointer-events-none opacity-45",
              )}
            >
              <AppIcons.chevronLeft className="size-4" />
            </PaginationLink>
          </PaginationSlotItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}
