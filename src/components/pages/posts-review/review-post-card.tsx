"use client";

import * as React from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ReviewStatusBadge } from "@/components/shared";
import { AppIcons } from "@/constant/icons";
import { formatUtcDate } from "@/lib/date";
import { displayOrDash } from "@/lib/text";
import {
  postTypeLabels,
  type ReviewPostItem,
} from "@/components/pages/posts-review/posts-review.types";
import { PostDetailsDialog } from "@/components/pages/posts-review/post-details-dialog";
import { RejectPostDialog } from "@/components/pages/posts-review/reject-post-dialog";

type ReviewPostCardProps = {
  post: ReviewPostItem;
  onApprove: (postId: string) => void;
  onReject: (postId: string, reason: string) => void;
};

export function ReviewPostCard({
  post,
  onApprove,
  onReject,
}: ReviewPostCardProps) {
  const [detailsOpen, setDetailsOpen] = React.useState(false);
  const [rejectDialogOpen, setRejectDialogOpen] = React.useState(false);

  return (
    <>
      <article className="rounded-xl border border-border bg-background p-4 shadow-xs">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-2">
            <ReviewStatusBadge status={post.status} />
            <Badge variant="outline">{postTypeLabels[post.type]}</Badge>
            <Badge variant="outline">{post.id}</Badge>
          </div>
          <p className="text-xs text-muted-foreground">
            {post.status === "approved" && post.publishedAt
              ? `نُشر: ${formatUtcDate(post.publishedAt)}`
              : `أرسلت للمراجعة: ${formatUtcDate(post.submittedAt)}`}
          </p>
        </div>

        <h3 className="mb-2 text-base font-semibold text-foreground">
          {post.title}
        </h3>
        <p className="line-clamp-2 text-sm leading-6 text-muted-foreground">
          {post.summary}
        </p>

        <div className="mt-4 grid gap-2 rounded-lg border border-border/70 bg-muted/35 p-3 text-xs text-muted-foreground sm:grid-cols-3">
          <p>
            <span className="font-semibold text-foreground">الجهة:</span>{" "}
            {displayOrDash(post.organizationName)}
          </p>
          <p>
            <span className="font-semibold text-foreground">الكاتب:</span>{" "}
            {displayOrDash(post.authorName)}
          </p>
          <p>
            <span className="font-semibold text-foreground">المدينة:</span>{" "}
            {displayOrDash(post.location)}
          </p>
        </div>

        {post.rejectionReason && (
          <div className="mt-3 rounded-lg border border-rose-200/70 bg-rose-50/80 p-3 text-xs text-rose-700 dark:border-rose-500/40 dark:bg-rose-500/10 dark:text-rose-100">
            <p className="font-semibold">سبب الرفض:</p>
            <p className="mt-1 line-clamp-2">{post.rejectionReason}</p>
          </div>
        )}

        <div className="mt-4 flex flex-wrap items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setDetailsOpen(true)}
          >
            <AppIcons.profile className="size-4" />
            عرض التفاصيل
          </Button>

          {post.status === "pending" && (
            <>
              <Button
                type="button"
                size="sm"
                className="bg-emerald-600 text-white hover:bg-emerald-700"
                onClick={() => onApprove(post.id)}
              >
                <AppIcons.posts className="size-4" />
                قبول
              </Button>
              <Button
                type="button"
                size="sm"
                variant="destructive"
                onClick={() => setRejectDialogOpen(true)}
              >
                <AppIcons.reports className="size-4" />
                رفض
              </Button>
            </>
          )}
        </div>
      </article>

      <PostDetailsDialog
        open={detailsOpen}
        onOpenChange={setDetailsOpen}
        post={post}
      />

      <RejectPostDialog
        open={rejectDialogOpen}
        onOpenChange={setRejectDialogOpen}
        postTitle={post.title}
        onConfirm={(reason) => onReject(post.id, reason)}
      />
    </>
  );
}
