"use client";

import * as React from "react";

import { EmptyState, PaginationControls } from "@/components/shared";
import type { ModerationStatus } from "@/components/shared";
import { usePagination } from "@/hooks/use-pagination";
import { toUtcTimestamp } from "@/lib/date";
import { DEFAULT_PAGE_SIZE, PAGE_SIZE_OPTIONS } from "@/constant/pagination";
import {
  reviewPostsStaticData,
  reviewStatusLabels,
  type ReviewPostItem,
} from "@/components/pages/posts-review/static-data";
import { PostDetailsDialog } from "@/components/pages/posts-review/post-details-dialog";
import { ReviewPostsTable } from "@/components/pages/posts-review/review-posts-table";
import {
  ReviewToolbar,
  type ReviewSortOption,
} from "@/components/pages/posts-review/review-toolbar";

type PostsReviewPageProps = {
  status: ModerationStatus;
};

export function PostsReviewPage({ status }: PostsReviewPageProps) {
  const [posts, setPosts] = React.useState<ReviewPostItem[]>(
    reviewPostsStaticData,
  );
  const [organizationFilter, setOrganizationFilter] = React.useState("all");
  const [sortBy, setSortBy] =
    React.useState<ReviewSortOption>("created_at_newest");
  const [pageSize, setPageSize] = React.useState<number>(DEFAULT_PAGE_SIZE);
  const [selectedPostForDetails, setSelectedPostForDetails] =
    React.useState<ReviewPostItem | null>(null);

  const organizationOptions = React.useMemo(() => {
    const scopedOrganizations = posts
      .filter((post) => post.status === status)
      .map((post) => post.organizationName);
    const uniqueOrganizations = Array.from(new Set(scopedOrganizations));

    return uniqueOrganizations.sort((firstOrg, secondOrg) =>
      firstOrg.localeCompare(secondOrg, "ar", { sensitivity: "base" }),
    );
  }, [posts, status]);

  React.useEffect(() => {
    if (
      organizationFilter !== "all" &&
      !organizationOptions.includes(organizationFilter)
    ) {
      setOrganizationFilter("all");
    }
  }, [organizationFilter, organizationOptions]);

  const filteredPosts = React.useMemo(() => {
    const filtered = posts.filter((post) => {
      if (post.status !== status) {
        return false;
      }

      if (
        organizationFilter !== "all" &&
        post.organizationName !== organizationFilter
      ) {
        return false;
      }

      return true;
    });

    return filtered.sort((firstPost, secondPost) => {
      if (sortBy === "title_asc") {
        return firstPost.title.localeCompare(secondPost.title, "ar", {
          sensitivity: "base",
        });
      }

      if (sortBy === "title_desc") {
        return secondPost.title.localeCompare(firstPost.title, "ar", {
          sensitivity: "base",
        });
      }

      const firstDate = toUtcTimestamp(firstPost.submittedAt);
      const secondDate = toUtcTimestamp(secondPost.submittedAt);

      return sortBy === "created_at_oldest"
        ? firstDate - secondDate
        : secondDate - firstDate;
    });
  }, [organizationFilter, posts, sortBy, status]);

  const pagination = usePagination({
    totalItems: filteredPosts.length,
    pageSize,
  });
  const { setCurrentPage } = pagination;

  React.useEffect(() => {
    setCurrentPage(1);
  }, [organizationFilter, pageSize, setCurrentPage, sortBy, status]);

  const currentPagePosts = React.useMemo(
    () => filteredPosts.slice(pagination.startIndex, pagination.endIndex),
    [filteredPosts, pagination.endIndex, pagination.startIndex],
  );

  const handleApprove = React.useCallback((postId: string) => {
    setPosts((currentPosts) =>
      currentPosts.map((post) =>
        post.id === postId
          ? {
              ...post,
              status: "approved",
              reviewedBy: "فريق مراجعة المحتوى",
              rejectionReason: undefined,
            }
          : post,
      ),
    );
  }, []);

  const handleReject = React.useCallback((postId: string, reason: string) => {
    setPosts((currentPosts) =>
      currentPosts.map((post) =>
        post.id === postId
          ? {
              ...post,
              status: "rejected",
              reviewedBy: "فريق مراجعة المحتوى",
              rejectionReason: reason,
            }
          : post,
      ),
    );
  }, []);

  return (
    <section className="flex flex-col flex-1 gap-4">
      <ReviewToolbar
        status={status}
        sortBy={sortBy}
        onSortByChange={setSortBy}
        organizationFilter={organizationFilter}
        organizations={organizationOptions}
        onOrganizationFilterChange={setOrganizationFilter}
        totalResults={filteredPosts.length}
      />

      {currentPagePosts.length === 0 ? (
        <EmptyState
          icon="posts"
          title={`لا توجد منشورات ضمن حالة ${reviewStatusLabels[status]}`}
          description="جرّب تغيير الفلتر أو طريقة الفرز لعرض نتائج إضافية."
        />
      ) : (
        <ReviewPostsTable
          posts={currentPagePosts}
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
