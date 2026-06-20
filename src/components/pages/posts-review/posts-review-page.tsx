"use client";

import * as React from "react";

import { EmptyState, PaginationControls } from "@/components/shared";
import type { ModerationStatus } from "@/components/shared";
import { usePagination } from "@/hooks/use-pagination";
import { useDebounce } from "@/hooks/use-debounce";
import { DEFAULT_PAGE_SIZE, PAGE_SIZE_OPTIONS } from "@/constant/pagination";
import {
  reviewStatusLabels,
  type ReviewPostItem,
} from "@/components/pages/posts-review/static-data";
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

export function PostsReviewPage({ status }: PostsReviewPageProps) {
  const [organizationSearch, setOrganizationSearch] = React.useState("");
  const [sortBy, setSortBy] =
    React.useState<ReviewSortOption>("created_at_newest");
  const [pageSize, setPageSize] = React.useState<number>(DEFAULT_PAGE_SIZE);
  const [selectedPostForDetails, setSelectedPostForDetails] =
    React.useState<ReviewPostItem | null>(null);

  const debouncedOrgSearch = useDebounce(organizationSearch, 400);

  // Separate total state breaks the circular dependency between
  // usePagination (needs total) and the query (needs currentPage).
  const [apiTotal, setApiTotal] = React.useState(0);

  const pagination = usePagination({ totalItems: apiTotal, pageSize });
  const { setCurrentPage } = pagination;

  const { data, isLoading } = useAdminReviewPosts({
    page: pagination.currentPage,
    perPage: pageSize,
    sortBy,
    filter: {
      status,
      organizationName: debouncedOrgSearch || undefined,
    },
  });

  React.useEffect(() => {
    if (data?.meta.total !== undefined) {
      setApiTotal(data.meta.total);
    }
  }, [data?.meta.total]);

  React.useEffect(() => {
    setCurrentPage(1);
  }, [status, debouncedOrgSearch, sortBy, pageSize, setCurrentPage]);

  const approveMutation = useApprovePost();
  const rejectMutation = useRejectPost();

  const posts = data?.data ?? [];

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
        totalResults={apiTotal}
      />

      {!isLoading && posts.length === 0 ? (
        <EmptyState
          icon="posts"
          title={`لا توجد منشورات ضمن حالة ${reviewStatusLabels[status]}`}
          description="جرّب تغيير الفلتر أو طريقة الفرز لعرض نتائج إضافية."
        />
      ) : (
        <ReviewPostsTable
          posts={posts}
          onApprove={handleApprove}
          onReject={handleReject}
          onOpenDetails={setSelectedPostForDetails}
        />
      )}

      {selectedPostForDetails && (
        <PostDetailsDialog
          open={!!selectedPostForDetails}
          onOpenChange={(open) => !open && setSelectedPostForDetails(null)}
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
