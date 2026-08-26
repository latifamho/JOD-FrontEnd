"use client";

import { useQueryDisclosure } from "@/hooks/use-query-modal";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ReviewStatusBadge, TableRowActions } from "@/components/shared";
import { AppIcons } from "@/constant/icons";
import { formatUtcDateOrDash } from "@/lib/date";
import { displayOrDash } from "@/lib/text";
import { RejectPostDialog } from "@/components/pages/posts-review/reject-post-dialog";
import {
  postAudienceLabels,
  postTypeLabels,
  publisherTypeLabels,
  type ReviewPostItem,
} from "@/components/pages/posts-review/posts-review.types";

type ReviewPostsTableProps = {
  posts: ReviewPostItem[];
  approvingPostId?: string;
  rejectingPostId?: string;
  onApprove: (postId: string) => void;
  onReject: (postId: string, rejectionReason: string) => void;
  onOpenDetails: (post: ReviewPostItem) => void;
  onEdit?: (post: ReviewPostItem) => void;
};

export function ReviewPostsTable({
  posts,
  approvingPostId,
  rejectingPostId,
  onApprove,
  onReject,
  onOpenDetails,
  onEdit,
}: ReviewPostsTableProps) {
  const hasNonPending = posts.some((post) => post.status !== "pending");

  return (
    <div className="rounded-md border border-border bg-card shadow-sm">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead className="w-[100px] text-right font-semibold text-muted-foreground">الحالة</TableHead>
            <TableHead className="min-w-[200px] text-right font-semibold text-muted-foreground">العنوان</TableHead>
            <TableHead className="min-w-[150px] text-right font-semibold text-muted-foreground">الناشر</TableHead>
            <TableHead className="hidden min-w-[120px] text-right font-semibold text-muted-foreground md:table-cell">التصنيف</TableHead>
            <TableHead className="hidden w-[90px] text-right font-semibold text-muted-foreground lg:table-cell">الجمهور</TableHead>
            <TableHead className="hidden w-[110px] text-right font-semibold text-muted-foreground lg:table-cell">النوع</TableHead>
            {hasNonPending ? (
              <TableHead className="hidden min-w-[120px] text-right font-semibold text-muted-foreground lg:table-cell">راجعه</TableHead>
            ) : null}
            <TableHead className="w-[110px] text-left font-semibold text-muted-foreground">
              {hasNonPending ? "تاريخ النشر" : "تاريخ الإرسال"}
            </TableHead>
            <TableHead className="w-14 text-center font-semibold text-muted-foreground">إجراءات</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {posts.map((post) => (
            <ReviewPostRow
              key={post.id}
              post={post}
              showReviewedBy={hasNonPending}
              approvingPostId={approvingPostId}
              rejectingPostId={rejectingPostId}
              onApprove={onApprove}
              onReject={onReject}
              onOpenDetails={onOpenDetails}
              onEdit={onEdit}
            />
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

function ReviewPostRow({
  post,
  showReviewedBy,
  approvingPostId,
  rejectingPostId,
  onApprove,
  onReject,
  onOpenDetails,
  onEdit,
}: {
  post: ReviewPostItem;
  showReviewedBy: boolean;
  approvingPostId?: string;
  rejectingPostId?: string;
  onApprove: (postId: string) => void;
  onReject: (postId: string, rejectionReason: string) => void;
  onOpenDetails: (post: ReviewPostItem) => void;
  onEdit?: (post: ReviewPostItem) => void;
}) {
  const [rejectDialogOpen, setRejectDialogOpen] = useQueryDisclosure(`post-reject-${post.id}`);
  const isApproving = approvingPostId === post.id;
  const isRejecting = rejectingPostId === post.id;
  const isMutating = isApproving || isRejecting;
  const dateToShow = post.status === "approved" && post.publishedAt ? post.publishedAt : post.submittedAt;
  const title = post.title ?? "بدون عنوان";
  const canEdit =
    post.status === "approved" &&
    post.type === "general" &&
    !post.organizationName &&
    Boolean(onEdit);

  return (
    <>
      <TableRow className="group">
        <TableCell className="align-middle text-right"><ReviewStatusBadge status={post.status} /></TableCell>
        <TableCell className="align-middle text-right">
          <div className="flex flex-col gap-0.5">
            <span className="font-medium text-foreground">{title}</span>
            <p className="line-clamp-1 text-xs text-muted-foreground">{displayOrDash(post.summary)}</p>
            {post.rejectionReason ? (
              <p className="line-clamp-1 text-xs text-rose-600 dark:text-rose-400">سبب الرفض السابق: {post.rejectionReason}</p>
            ) : null}
          </div>
        </TableCell>
        <TableCell className="align-middle text-right text-sm">
          <div className="flex flex-col gap-0.5">
            <span>{displayOrDash(post.publisher?.name ?? post.organizationName ?? post.authorName)}</span>
            <span className="text-xs text-muted-foreground">{post.publisher ? publisherTypeLabels[post.publisher.type] : "—"}</span>
          </div>
        </TableCell>
        <TableCell className="hidden align-middle text-right text-sm md:table-cell">{displayOrDash(post.category?.name)}</TableCell>
        <TableCell className="hidden align-middle text-right text-sm lg:table-cell">{postAudienceLabels[post.audience ?? "general"]}</TableCell>
        <TableCell className="hidden align-middle text-right lg:table-cell">
          <span className="text-sm text-muted-foreground">{postTypeLabels[post.type] ?? post.type}</span>
        </TableCell>
        {showReviewedBy ? (
          <TableCell className="hidden align-middle text-right text-sm text-muted-foreground lg:table-cell">{displayOrDash(post.reviewedBy)}</TableCell>
        ) : null}
        <TableCell className="align-middle text-left text-xs text-muted-foreground">{formatUtcDateOrDash(dateToShow)}</TableCell>
        <TableCell className="align-middle">
          <TableRowActions
            loading={isMutating}
            actions={[
              {
                id: "details",
                label: "عرض التفاصيل",
                icon: <AppIcons.eye className="size-4" />,
                onSelect: () => onOpenDetails(post),
              },
              {
                id: "edit",
                label: "تعديل المنشور",
                icon: <AppIcons.PencilLine className="size-4" />,
                onSelect: () => onEdit?.(post),
                hidden: !canEdit,
              },
              {
                id: "approve",
                label: "قبول",
                icon: <AppIcons.posts className="size-4" />,
                onSelect: () => onApprove(post.id),
                hidden: post.status !== "pending",
              },
              {
                id: "reject",
                label: "رفض",
                icon: <AppIcons.reports className="size-4" />,
                onSelect: () => setRejectDialogOpen(true),
                destructive: true,
                separatorBefore: true,
                hidden: post.status !== "pending",
              },
            ]}
          />
        </TableCell>
      </TableRow>

      <RejectPostDialog
        open={rejectDialogOpen}
        onOpenChange={setRejectDialogOpen}
        postTitle={title}
        onConfirm={(reason) => onReject(post.id, reason)}
      />
    </>
  );
}
