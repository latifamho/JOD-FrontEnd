"use client";

import * as React from "react";

import { EmptyState, PaginationControls } from "@/components/shared";
import type { ModerationStatus } from "@/components/shared";
import { usePagination } from "@/hooks/use-pagination";
import { useQueryModal } from "@/hooks/use-query-modal";
import { useDebounce } from "@/hooks/use-debounce";
import { DEFAULT_PAGE_SIZE, PAGE_SIZE_OPTIONS } from "@/constant/pagination";
import {
  reviewStatusLabels,
  type ReviewPostType,
} from "@/components/pages/posts-review/posts-review.types";
import { PostDetailsDialog } from "@/components/pages/posts-review/post-details-dialog";
import { ReviewPostsTable } from "@/components/pages/posts-review/review-posts-table";
import {
  ReviewToolbar,
  type ReviewSortOption,
} from "@/components/pages/posts-review/review-toolbar";
import {
  useAdminReviewPosts,
  useApprovePost,
  useRejectPost,
} from "@/features/admin/posts/admin.posts.query";

type PostsReviewPageProps = {
  status: ModerationStatus;
};

const sortToApiSort: Record<ReviewSortOption, string> = {
  title_asc: "title",
  title_desc: "-title",
  created_at_newest: "-submittedAt",
  created_at_oldest: "submittedAt",
};

export function PostsReviewPage({ status }: PostsReviewPageProps) {
  const [organizationSearch, setOrganizationSearch] = React.useState("");
  const [typeFilter, setTypeFilter] = React.useState<"all" | ReviewPostType>("all");
  const [sortBy, setSortBy] =
    React.useState<ReviewSortOption>("created_at_newest");
  const [pageSize, setPageSize] = React.useState<number>(DEFAULT_PAGE_SIZE);
  const detailsModal = useQueryModal("post-details");

  const debouncedOrgSearch = useDebounce(organizationSearch, 400);

  // Separate total state breaks the circular dependency between
  // usePagination (needs total) and the query (needs currentPage).
  const [apiTotal, setApiTotal] = React.useState(0);

  const pagination = usePagination({ totalItems: apiTotal, pageSize });
  const { setCurrentPage } = pagination;

  const { data, isLoading, isError } = useAdminReviewPosts({
    page: pagination.currentPage,
    perPage: pageSize,
    sort: sortToApiSort[sortBy],
    filter: {
      status,
      organizationName: debouncedOrgSearch || undefined,
      type: typeFilter !== "all" ? typeFilter : undefined,
    },
  });

  React.useEffect(() => {
    if (data?.meta.total !== undefined) {
      setApiTotal(data.meta.total);
    }
  }, [data?.meta.total]);

  React.useEffect(() => {
    setCurrentPage(1);
  }, [status, debouncedOrgSearch, typeFilter, sortBy, pageSize, setCurrentPage]);

  const approveMutation = useApprovePost();
  const rejectMutation = useRejectPost();

  const posts = data?.data ?? [];
  const selectedPostForDetails =
    posts.find((post) => post.id === detailsModal.id) ?? null;

  const handleApprove = React.useCallback(
    (postId: string) => {
      approveMutation.mutate({ postId, body: {} });
    },
    [approveMutation],
  );

  const handleReject = React.useCallback(
    (postId: string, reason: string) => {
      rejectMutation.mutate({ postId, body: { reason } });
    },
    [rejectMutation],
  );

  return (
    <section className="flex flex-col flex-1 gap-4">
      <ReviewToolbar
        status={status}
        sortBy={sortBy}
        onSortByChange={setSortBy}
        organizationSearch={organizationSearch}
        onOrganizationSearchChange={setOrganizationSearch}
        typeFilter={typeFilter}
        onTypeFilterChange={setTypeFilter}
        totalResults={apiTotal}
      />

      {isError && (
        <p className="text-sm text-destructive">
          تعذّر تحميل المنشورات. حاول مرة أخرى.
        </p>
      )}

      {isLoading ? (
        <div className="rounded-md border border-border bg-card shadow-sm divide-y divide-border">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex items-center gap-4 px-4 py-3">
              <div className="h-4 w-16 rounded bg-muted animate-pulse" />
              <div className="flex-1 space-y-1.5">
                <div className="h-4 w-48 rounded bg-muted animate-pulse" />
                <div className="h-3 w-72 rounded bg-muted animate-pulse" />
              </div>
              <div className="h-3 w-20 rounded bg-muted animate-pulse" />
            </div>
          ))}
        </div>
      ) : posts.length === 0 ? (
        <EmptyState
          icon="posts"
          title={`لا توجد منشورات ضمن حالة ${reviewStatusLabels[status]}`}
          description="جرّب تغيير الفلتر أو طريقة الفرز لعرض نتائج إضافية."
        />
      ) : (
        <ReviewPostsTable
          posts={posts}
          approvingPostId={
            approveMutation.isPending ? approveMutation.variables?.postId : undefined
          }
          rejectingPostId={
            rejectMutation.isPending ? rejectMutation.variables?.postId : undefined
          }
          onApprove={handleApprove}
          onReject={handleReject}
          onOpenDetails={(post) => detailsModal.open({ id: post.id })}
        />
      )}

      {selectedPostForDetails && (
        <PostDetailsDialog
          open={detailsModal.isOpen}
          onOpenChange={detailsModal.onOpenChange}
          post={selectedPostForDetails}
        />
      )}

      <PaginationControls
        currentPage={pagination.currentPage}
        totalPages={pagination.totalPages}
        hasPreviousPage={pagination.hasPreviousPage}
        hasNextPage={pagination.hasNextPage}
        paginationRange={pagination.paginationRange}
        onPageChange={pagination.goToPage}
        onPreviousPage={pagination.goToPreviousPage}
        onNextPage={pagination.goToNextPage}
        pageSize={pageSize}
        onPageSizeChange={setPageSize}
        pageSizeOptions={PAGE_SIZE_OPTIONS}
      />
    </section>
  );
}
