"use client";

import * as React from "react";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ReviewStatusBadge } from "@/components/shared";
import { AppIcons } from "@/constant/icons";
import { formatUtcDate } from "@/lib/date";
import { RejectPostDialog } from "@/components/pages/posts-review/reject-post-dialog";
import {
  postTypeLabels,
  type ReviewPostItem,
} from "@/components/pages/posts-review/static-data";

type ReviewPostsTableProps = {
  posts: ReviewPostItem[];
  onApprove: (postId: string) => void;
  onReject: (postId: string, reason: string) => void;
  onOpenDetails: (post: ReviewPostItem) => void;
};

export function ReviewPostsTable({
  posts,
  onApprove,
  onReject,
  onOpenDetails,
}: ReviewPostsTableProps) {
  const hasNonPending = posts.some((p) => p.status !== "pending");

  return (
    <div className="rounded-md border border-border bg-card shadow-sm">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead className="w-[100px] text-right font-semibold text-muted-foreground">
              الحالة
            </TableHead>
            <TableHead className="min-w-[200px] text-right font-semibold text-muted-foreground">
              العنوان
            </TableHead>
            <TableHead className="min-w-[140px] text-right font-semibold text-muted-foreground">
              المنظمة
            </TableHead>
            <TableHead className="hidden min-w-[120px] text-right font-semibold text-muted-foreground md:table-cell">
              الكاتب
            </TableHead>
            <TableHead className="hidden w-[110px] text-right font-semibold text-muted-foreground lg:table-cell">
              النوع
            </TableHead>
            {hasNonPending && (
              <TableHead className="hidden min-w-[120px] text-right font-semibold text-muted-foreground lg:table-cell">
                راجعه
              </TableHead>
            )}
            <TableHead className="w-[110px] text-left font-semibold text-muted-foreground">
              {hasNonPending ? "تاريخ النشر" : "تاريخ الإرسال"}
            </TableHead>
            <TableHead className="w-[140px] text-center font-semibold text-muted-foreground">
              إجراءات
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {posts.map((post) => (
            <ReviewPostRow
              key={post.id}
              post={post}
              showReviewedBy={hasNonPending}
              onApprove={onApprove}
              onReject={onReject}
              onOpenDetails={onOpenDetails}
            />
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

type ReviewPostRowProps = {
  post: ReviewPostItem;
  showReviewedBy: boolean;
  onApprove: (postId: string) => void;
  onReject: (postId: string, reason: string) => void;
  onOpenDetails: (post: ReviewPostItem) => void;
};

function ReviewPostRow({
  post,
  showReviewedBy,
  onApprove,
  onReject,
  onOpenDetails,
}: ReviewPostRowProps) {
  const [rejectDialogOpen, setRejectDialogOpen] = React.useState(false);

  const dateToShow =
    post.status === "approved" && post.publishedAt
      ? post.publishedAt
      : post.submittedAt;

  return (
    <>
      <TableRow className="group">
        <TableCell className="align-middle text-right">
          <ReviewStatusBadge status={post.status} />
        </TableCell>
        <TableCell className="align-middle text-right">
          <div className="flex flex-col gap-0.5">
            <span className="font-medium text-foreground">{post.title}</span>
            <p className="line-clamp-1 text-xs text-muted-foreground">
              {post.summary}
            </p>
            {post.rejectionReason && (
              <p className="line-clamp-1 text-xs text-rose-600 dark:text-rose-400">
                سبب الرفض: {post.rejectionReason}
              </p>
            )}
          </div>
        </TableCell>
        <TableCell className="align-middle text-right text-sm">
          {post.organizationName}
        </TableCell>
        <TableCell className="hidden align-middle text-right text-sm md:table-cell">
          {post.authorName}
        </TableCell>
        <TableCell className="hidden align-middle text-right lg:table-cell">
          <span className="text-sm text-muted-foreground">
            {postTypeLabels[post.type]}
          </span>
        </TableCell>
        {showReviewedBy && (
          <TableCell className="hidden align-middle text-right text-sm text-muted-foreground lg:table-cell">
            {post.reviewedBy ?? "—"}
          </TableCell>
        )}
        <TableCell className="align-middle text-left text-xs text-muted-foreground">
          {formatUtcDate(dateToShow)}
        </TableCell>
        <TableCell className="align-middle">
          <div className="flex flex-wrap items-center justify-center gap-1">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="size-8"
                  onClick={() => onOpenDetails(post)}
                >
                  <AppIcons.profile className="size-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="text-xs">
                عرض التفاصيل
              </TooltipContent>
            </Tooltip>

            {post.status === "pending" && (
              <>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      type="button"
                      size="icon"
                      className="size-8 bg-emerald-600 text-white hover:bg-emerald-700"
                      onClick={() => onApprove(post.id)}
                    >
                      <AppIcons.posts className="size-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom" className="text-xs">
                    قبول
                  </TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="size-8"
                      onClick={() => setRejectDialogOpen(true)}
                    >
                      <AppIcons.reports className="size-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom" className="text-xs">
                    رفض
                  </TooltipContent>
                </Tooltip>
              </>
            )}
          </div>
        </TableCell>
      </TableRow>

      <RejectPostDialog
        open={rejectDialogOpen}
        onOpenChange={setRejectDialogOpen}
        postTitle={post.title}
        onConfirm={(reason) => {
          onReject(post.id, reason);
          setRejectDialogOpen(false);
        }}
      />
    </>
  );
}
