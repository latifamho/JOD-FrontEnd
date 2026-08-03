import { cn } from "@/lib/utils";

type LoadingSkeletonProps = {
  className?: string;
};

type RepeatedLoadingSkeletonProps = LoadingSkeletonProps & {
  count?: number;
};

function Pulse({ className }: LoadingSkeletonProps) {
  return <div aria-hidden className={cn("animate-pulse rounded bg-muted", className)} />;
}

export function ListLoadingSkeleton({ count = 6, className }: RepeatedLoadingSkeletonProps) {
  return (
    <div
      role="status"
      aria-label="جاري تحميل البيانات"
      className={cn(
        "w-full min-w-0 self-stretch divide-y divide-border overflow-hidden rounded-md border border-border bg-card shadow-sm",
        className,
      )}
    >
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="flex items-center gap-4 px-4 py-3">
          <Pulse className="size-9 shrink-0 rounded-full" />
          <div className="min-w-0 flex-1 space-y-2">
            <Pulse className="h-4 w-2/5" />
            <Pulse className="h-3 w-3/5" />
          </div>
          <Pulse className="h-6 w-20 shrink-0 rounded-full" />
        </div>
      ))}
      <span className="sr-only">جاري التحميل...</span>
    </div>
  );
}

export function CardGridLoadingSkeleton({ count = 6, className }: RepeatedLoadingSkeletonProps) {
  return (
    <div
      role="status"
      aria-label="جاري تحميل البطاقات"
      className={cn("grid w-full min-w-0 self-stretch gap-4 sm:grid-cols-2 lg:grid-cols-3", className)}
    >
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="space-y-3 rounded-xl border border-border bg-card p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <Pulse className="size-10 shrink-0 rounded-lg" />
            <div className="flex-1 space-y-2">
              <Pulse className="h-4 w-2/3" />
              <Pulse className="h-6 w-1/3" />
            </div>
          </div>
          <Pulse className="h-3 w-4/5" />
        </div>
      ))}
      <span className="sr-only">جاري التحميل...</span>
    </div>
  );
}

export function DetailsLoadingSkeleton({ className }: LoadingSkeletonProps) {
  return (
    <div role="status" aria-label="جاري تحميل التفاصيل" className={cn("w-full min-w-0 self-stretch space-y-4 p-4", className)}>
      <div className="flex flex-wrap gap-2">
        <Pulse className="h-6 w-20 rounded-full" />
        <Pulse className="h-6 w-24 rounded-full" />
        <Pulse className="h-6 w-16 rounded-full" />
      </div>
      <div className="grid gap-3 rounded-lg border border-border p-4 sm:grid-cols-2">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="space-y-2">
            <Pulse className="h-3 w-20" />
            <Pulse className="h-4 w-3/4" />
          </div>
        ))}
      </div>
      <Pulse className="h-32 w-full rounded-lg" />
      <Pulse className="h-24 w-full rounded-lg" />
      <span className="sr-only">جاري تحميل التفاصيل...</span>
    </div>
  );
}

export function FormLoadingSkeleton({ count = 5, className }: RepeatedLoadingSkeletonProps) {
  return (
    <div
      role="status"
      aria-label="جاري تحميل النموذج"
      className={cn("grid w-full min-w-0 self-stretch gap-4 sm:grid-cols-2", className)}
    >
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="space-y-2">
          <Pulse className="h-3 w-24" />
          <Pulse className="h-10 w-full" />
        </div>
      ))}
      <span className="sr-only">جاري تحميل النموذج...</span>
    </div>
  );
}
