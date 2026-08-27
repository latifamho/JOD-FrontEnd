"use client";
import * as React from "react";
import { EmptyState, PaginationControls } from "@/components/shared";
import type { ModerationStatus } from "@/components/shared";
import { usePagination } from "@/hooks/use-pagination";
import { useQueryModal } from "@/hooks/use-query-modal";
import { useDebounce } from "@/hooks/use-debounce";
import { DEFAULT_PAGE_SIZE, PAGE_SIZE_OPTIONS } from "@/constant/pagination";
import { reviewStatusLabels, type ReviewPostType } from "./posts-review.types";
import { PostDetailsDialog } from "./post-details-dialog";
import { ReviewPostsTable } from "./review-posts-table";
import { ReviewToolbar, type ReviewSortOption } from "./review-toolbar";
import { useAdminReviewPosts, useBlockPost, usePublishPost } from "@/features/admin/posts/admin.posts.query";

type Props = { status: ModerationStatus };
const sortToApiSort: Record<ReviewSortOption, string> = { title_asc: "title", title_desc: "-title", created_at_newest: "-createdAt", created_at_oldest: "createdAt" };
export function PostsReviewPage({ status }: Props) {
  const [organizationSearch, setOrganizationSearch] = React.useState(""); const [typeFilter, setTypeFilter] = React.useState<"all" | ReviewPostType>("all"); const [sortBy, setSortBy] = React.useState<ReviewSortOption>("created_at_newest"); const [pageSize, setPageSize] = React.useState<number>(DEFAULT_PAGE_SIZE); const detailsModal = useQueryModal("post-details"); const debouncedSearch = useDebounce(organizationSearch, 400); const [apiTotal, setApiTotal] = React.useState(0); const pagination = usePagination({ totalItems: apiTotal, pageSize }); const { setCurrentPage } = pagination;
  const { data, isLoading, isError } = useAdminReviewPosts({ page: pagination.currentPage, perPage: pageSize, status, type: typeFilter !== "all" ? typeFilter : undefined, search: debouncedSearch || undefined, sort: sortToApiSort[sortBy] });
  React.useEffect(() => { if (data?.meta.total === undefined) return; const timer = window.setTimeout(() => setApiTotal(data.meta.total), 0); return () => window.clearTimeout(timer); }, [data?.meta.total]);
  React.useEffect(() => { setCurrentPage(1); }, [status, debouncedSearch, typeFilter, sortBy, pageSize, setCurrentPage]);
  const publishMutation = usePublishPost(); const blockMutation = useBlockPost(); const posts = data?.data ?? []; const selected = posts.find((post) => post.id === detailsModal.id) ?? null;
  return <section className="flex flex-1 flex-col gap-4">
    <ReviewToolbar status={status} sortBy={sortBy} onSortByChange={setSortBy} organizationSearch={organizationSearch} onOrganizationSearchChange={setOrganizationSearch} typeFilter={typeFilter} onTypeFilterChange={setTypeFilter} totalResults={apiTotal} />
    {isError ? <p className="text-sm text-destructive">تعذّر تحميل المنشورات. حاول مرة أخرى.</p> : null}
    {isLoading ? <div className="h-48 animate-pulse rounded-md border bg-muted/30" /> : posts.length === 0 ? <EmptyState icon="posts" title={`لا توجد منشورات ضمن حالة ${reviewStatusLabels[status]}`} description="جرّب تغيير البحث أو الفلتر أو طريقة الفرز لعرض نتائج إضافية." /> : <ReviewPostsTable posts={posts} publishingPostId={publishMutation.isPending ? publishMutation.variables?.postId : undefined} blockingPostId={blockMutation.isPending ? blockMutation.variables?.postId : undefined} onPublish={(postId) => publishMutation.mutate({ postId })} onBlock={(postId, blockReason) => blockMutation.mutate({ postId, blockReason })} onOpenDetails={(post) => detailsModal.open({ id: post.id })} />}
    {selected ? <PostDetailsDialog open={detailsModal.isOpen} onOpenChange={detailsModal.onOpenChange} post={selected} /> : null}
    <PaginationControls currentPage={pagination.currentPage} totalPages={pagination.totalPages} hasPreviousPage={pagination.hasPreviousPage} hasNextPage={pagination.hasNextPage} paginationRange={pagination.paginationRange} onPageChange={pagination.goToPage} onPreviousPage={pagination.goToPreviousPage} onNextPage={pagination.goToNextPage} pageSize={pageSize} onPageSizeChange={setPageSize} pageSizeOptions={PAGE_SIZE_OPTIONS} />
  </section>;
}
