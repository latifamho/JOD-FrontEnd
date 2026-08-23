"use client";

import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { ReviewStatusBadge } from "@/components/shared";
import { formatUtcDateTime, formatUtcDateTimeOrDash } from "@/lib/date";
import { displayOrDash } from "@/lib/text";
import {
  postTypeLabels,
  type ReviewPostItem,
} from "@/components/pages/posts-review/posts-review.types";
import { useAdminPostDetail } from "@/features/admin/posts/admin.posts.query";

type PostDetailsDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  post: ReviewPostItem;
};

export function PostDetailsDialog({
  open,
  onOpenChange,
  post,
}: PostDetailsDialogProps) {
  const { data: detailData, isLoading } = useAdminPostDetail(
    open ? post.id : null,
  );

  const detail = detailData?.data;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        dir="rtl"
        className="w-[95vw] border-border p-0 sm:max-w-2xl"
      >
        <SheetHeader className="border-b border-border pe-12 text-right">
          <SheetTitle className="text-right text-xl">{post.title}</SheetTitle>
        </SheetHeader>

        <div className="space-y-4 overflow-y-auto p-4">
          {isLoading ? (
            <div className="space-y-4" aria-label="جاري تحميل تفاصيل المنشور">
              <div className="flex gap-2">
                <div className="h-6 w-20 animate-pulse rounded-full bg-muted" />
                <div className="h-6 w-24 animate-pulse rounded-full bg-muted" />
              </div>
              <div className="grid gap-3 rounded-lg border border-border bg-muted/20 p-4 sm:grid-cols-2">
                {Array.from({ length: 6 }).map((_, index) => (
                  <div key={index} className="space-y-2">
                    <div className="h-3 w-20 animate-pulse rounded bg-muted" />
                    <div className="h-4 w-32 animate-pulse rounded bg-muted" />
                  </div>
                ))}
              </div>
              <div className="space-y-3 rounded-lg border border-border p-4">
                <div className="h-3 w-24 animate-pulse rounded bg-muted" />
                <div className="h-4 w-full animate-pulse rounded bg-muted" />
                <div className="h-4 w-5/6 animate-pulse rounded bg-muted" />
                <div className="h-4 w-2/3 animate-pulse rounded bg-muted" />
              </div>
            </div>
          ) : null}

          <div className={isLoading ? "hidden" : "contents"}>
          <div className="flex flex-wrap items-center gap-2">
            <ReviewStatusBadge status={post.status} />
            <Badge variant="outline">{postTypeLabels[post.type]}</Badge>
          </div>

          <div className="grid gap-3 rounded-lg border border-border bg-muted/40 p-4 sm:grid-cols-2">
            <div>
              <p className="text-xs text-muted-foreground">الجهة الناشرة</p>
              <p className="text-sm font-medium">
                {displayOrDash(post.organizationName)}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">كاتب المنشور</p>
              <p className="text-sm font-medium">
                {displayOrDash(post.authorName)}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">الموقع</p>
              <p className="text-sm font-medium">
                {displayOrDash(post.location)}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">
                تاريخ الإرسال للمراجعة
              </p>
              <p className="text-sm font-medium">
                {formatUtcDateTime(post.submittedAt)}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">تاريخ النشر</p>
              <p className="text-sm font-medium">
                {formatUtcDateTimeOrDash(post.publishedAt)}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">راجعه</p>
              <p className="text-sm font-medium">
                {displayOrDash(post.reviewedBy)}
              </p>
            </div>
            {(detail?.campaignTitle ?? post.campaignTitle) && (
              <div>
                <p className="text-xs text-muted-foreground">الحملة المرتبطة</p>
                <p className="text-sm font-medium">
                  {displayOrDash(detail?.campaignTitle ?? post.campaignTitle)}
                </p>
              </div>
            )}
            {detail && (
              <>
                <div>
                  <p className="text-xs text-muted-foreground">تاريخ الإنشاء</p>
                  <p className="text-sm font-medium">
                    {formatUtcDateTime(detail.createdAt)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">آخر تحديث</p>
                  <p className="text-sm font-medium">
                    {formatUtcDateTime(detail.updatedAt)}
                  </p>
                </div>
              </>
            )}
          </div>

          {isLoading ? (
            <div className="space-y-3">
              <div className="h-24 rounded-lg bg-muted animate-pulse" />
              <div className="h-10 rounded-lg bg-muted animate-pulse" />
            </div>
          ) : (
            <>
              <div className="rounded-lg border border-border p-4">
                <p className="mb-2 text-xs text-muted-foreground">
                  محتوى المنشور
                </p>
                <p className="text-sm leading-7 text-foreground">
                  {detail?.body ?? post.summary}
                </p>
              </div>

              {detail && (detail.images?.length ?? 0) > 0 && (
                <div className="rounded-lg border border-border p-4">
                  <p className="mb-3 text-xs text-muted-foreground">
                    الصور المرفقة
                  </p>
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                    {detail?.images?.map((url, i) => (
                      <img
                        key={i}
                        src={url}
                        alt={`صورة ${i + 1}`}
                        className="aspect-video w-full rounded-md object-cover border border-border"
                      />
                    ))}
                  </div>
                </div>
              )}

              {detail && (
                <div className="grid grid-cols-3 gap-3 text-center">
                  <div className="rounded-lg border border-border bg-muted/30 p-3">
                    <p className="text-lg font-bold text-foreground">
                      {detail.viewsCount}
                    </p>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      المشاهدات
                    </p>
                  </div>
                  <div className="rounded-lg border border-border bg-muted/30 p-3">
                    <p className="text-lg font-bold text-foreground">
                      {detail.reactionsCount}
                    </p>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      التفاعلات
                    </p>
                  </div>
                  <div className="rounded-lg border border-border bg-muted/30 p-3">
                    <p className="text-lg font-bold text-foreground">
                      {detail.applicationsCount}
                    </p>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      المتقدمون
                    </p>
                  </div>
                </div>
              )}
            </>
          )}

          {post.rejectionReason && (
            <div className="rounded-lg border border-rose-200/70 bg-rose-50/80 p-4 dark:border-rose-500/40 dark:bg-rose-500/10">
              <p className="mb-1 text-xs font-semibold text-rose-700 dark:text-rose-200">
                سبب الرفض السابق
              </p>
              <p className="text-sm text-rose-700 dark:text-rose-100">
                {post.rejectionReason}
              </p>
            </div>
          )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
