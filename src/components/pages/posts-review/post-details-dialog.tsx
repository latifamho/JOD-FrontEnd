"use client";

import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { ReviewStatusBadge } from "@/components/shared";
import { formatUtcDateTime } from "@/lib/date";
import {
  postTypeLabels,
  type ReviewPostItem,
} from "@/components/pages/posts-review/static-data";

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
          <div className="flex flex-wrap items-center gap-2">
            <ReviewStatusBadge status={post.status} />
            <Badge variant="outline">{postTypeLabels[post.type]}</Badge>
            <Badge variant="outline">{post.id}</Badge>
          </div>

          <div className="grid gap-3 rounded-lg border border-border bg-muted/40 p-4 sm:grid-cols-2">
            <div>
              <p className="text-xs text-muted-foreground">الجهة الناشرة</p>
              <p className="text-sm font-medium">{post.organizationName}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">كاتب المنشور</p>
              <p className="text-sm font-medium">{post.authorName}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">الموقع</p>
              <p className="text-sm font-medium">{post.location}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">تاريخ الإرسال للمراجعة</p>
              <p className="text-sm font-medium">{formatUtcDateTime(post.submittedAt)}</p>
            </div>
          </div>

          <div className="rounded-lg border border-border p-4">
            <p className="mb-2 text-xs text-muted-foreground">محتوى المنشور</p>
            <p className="text-sm leading-7 text-foreground">{post.summary}</p>
          </div>

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
      </SheetContent>
    </Sheet>
  );
}
