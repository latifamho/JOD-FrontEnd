"use client";

import * as React from "react";
import { Suspense } from "react";
import { usePathname, useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { EmptyState, ListLoadingSkeleton, PaginationControls } from "@/components/shared";
import { AppIcons } from "@/constant/icons";
import { DEFAULT_PAGE_SIZE, PAGE_SIZE_OPTIONS } from "@/constant/pagination";
import { routePaths } from "@/constant/routes";
import { usePagination } from "@/hooks/use-pagination";
import { useQueryModal } from "@/hooks/use-query-modal";
import { useAuth } from "@/providers/AuthProvider";
import {
  isCampaignRelatedPostType,
} from "@/components/pages/organization-posts-management/helpers";
import { DeletePostDialog } from "@/components/pages/organization-posts-management/delete-post-dialog";
import {
  EMPTY_POST_FORM_VALUES,
  PostFormSheet,
  type PostFormValues,
} from "@/components/pages/organization-posts-management/post-form-sheet";
import {
  PostsFilters,
  type PostsSortOption,
} from "@/components/pages/organization-posts-management/posts-filters";
import { PostsTable } from "@/components/pages/organization-posts-management/posts-table";
import {
  organizationPostStatusLabels,
  type OrganizationPostItem,
  type OrganizationPostStatus,
} from "@/components/pages/organization-posts-management/static-data";
import {
  useOrgPosts,
  useCreateOrgPost,
  usePublishOrgPost,
  useArchiveOrgPost,
  useRestoreOrgPost,
  useDeleteOrgPost,
} from "@/features/org/posts/org.posts.query";

type WorkflowAction = "publish" | "archive" | "restore";

type OrganizationPostsManagementPageProps = {
  status: "all" | OrganizationPostStatus;
};

const sortToApiSort: Record<PostsSortOption, string> = {
  updated_newest: "-updatedAt",
  updated_oldest: "updatedAt",
  title_asc: "title",
  title_desc: "-title",
};

export function OrganizationPostsManagementPage({
  status,
}: OrganizationPostsManagementPageProps) {
  return (
    <Suspense fallback={null}>
      <OrganizationPostsManagementPageContent status={status} />
    </Suspense>
  );
}

function OrganizationPostsManagementPageContent({
  status,
}: OrganizationPostsManagementPageProps) {
  const { can } = useAuth();
  const canCreate = can("org.posts.create");
  const canPublish = can("org.posts.publish");
  const canArchive = can("org.posts.archive");
  const canRestore = can("org.posts.restore");
  const canDelete = can("org.posts.delete");
  const pathname = usePathname();
  const router = useRouter();

  const [pageSize, setPageSize] = React.useState<number>(DEFAULT_PAGE_SIZE);
  const [apiTotal, setApiTotal] = React.useState(0);

  const [typeFilter, setTypeFilter] = React.useState<
    "all" | OrganizationPostItem["type"]
  >("all");
  const [sortBy, setSortBy] = React.useState<PostsSortOption>("updated_newest");

  const formModal = useQueryModal("post-create", {
    permission: "org.posts.create",
  });
  const deleteModal = useQueryModal("post-delete", {
    permission: "org.posts.delete",
  });

  const pagination = usePagination({ totalItems: apiTotal, pageSize });
  const { setCurrentPage } = pagination;

  const { data, isLoading, isError, refetch } = useOrgPosts({
    page: pagination.currentPage,
    perPage: pageSize,
    sort: sortToApiSort[sortBy],
    filter: {
      status: status !== "all" ? status : undefined,
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
  }, [pageSize, sortBy, status, typeFilter, setCurrentPage]);

  const posts = data?.data ?? [];
  const deletePostId = deleteModal.id;
  const deletePostTitle =
    posts.find((post) => post.id === deletePostId)?.title ?? "-";

  const createMutation = useCreateOrgPost();
  const publishMutation = usePublishOrgPost();
  const archiveMutation = useArchiveOrgPost();
  const restoreMutation = useRestoreOrgPost();
  const deleteMutation = useDeleteOrgPost();

  const workflowPendingPostIds = [
    publishMutation.isPending ? publishMutation.variables : undefined,
    archiveMutation.isPending ? archiveMutation.variables : undefined,
    restoreMutation.isPending ? restoreMutation.variables : undefined,
  ].filter((postId): postId is string => typeof postId === "string");

  const openCreateSheet = React.useCallback(() => {
    formModal.open();
  }, [formModal]);

  const openDetails = React.useCallback(
    (postId: string) => {
      const detailsRoute = pathname.startsWith(routePaths.dashboardScope.orgStaffRoot)
        ? routePaths.organizationStaffScope.postDetails(postId)
        : routePaths.organizationOwnerScope.postDetails(postId);

      router.push(detailsRoute);
    },
    [pathname, router],
  );

  const handleSaveForm = React.useCallback(
    (values: PostFormValues) => {
      const campaignTitle = isCampaignRelatedPostType(values.type)
        ? values.campaignTitle || undefined
        : undefined;

      createMutation.mutate(
        {
          title: values.title,
          summary: values.summary,
          type: values.type,
          status: values.status,
          location: values.location,
          campaignTitle,
        },
        { onSuccess: () => formModal.close() },
      );
    },
    [createMutation, formModal],
  );

  const handleWorkflowAction = React.useCallback(
    (postId: string, action: WorkflowAction) => {
      if (action === "publish") {
        publishMutation.mutate(postId);
      } else if (action === "archive") {
        archiveMutation.mutate(postId);
      } else {
        restoreMutation.mutate(postId);
      }
    },
    [publishMutation, archiveMutation, restoreMutation],
  );

  const openDeleteDialog = React.useCallback(
    (postId: string) => deleteModal.open({ id: postId }),
    [deleteModal],
  );

  const handleDeletePost = React.useCallback(() => {
    if (!deletePostId) return;
    deleteMutation.mutate(deletePostId, {
      onSuccess: () => deleteModal.close(),
    });
  }, [deletePostId, deleteMutation, deleteModal]);

  const pageTitle =
    status === "all"
      ? "إدارة البوستات"
      : `إدارة البوستات - ${organizationPostStatusLabels[status]}`;

  return (
    <section className="flex flex-1 flex-col gap-4">
      <div className="flex flex-col gap-4 sm:flex-row md:items-start sm:justify-between">
        <div>
          <h2 className="text-sm font-semibold text-foreground sm:text-base">
            {pageTitle}
          </h2>
          <p className="mt-1 text-xs text-muted-foreground">
            إدارة بوستات المنظمة المتعلقة بالحملات والفرص والمحتوى العام. النتائج الحالية:{" "}
            {apiTotal}
          </p>
        </div>
        {canCreate ? (
          <div className="flex flex-wrap gap-2">
            <Button type="button" onClick={openCreateSheet}>
              إضافة منشور جديد
              <AppIcons.posts className="size-4" />
            </Button>
          </div>
        ) : null}
      </div>

      <PostsFilters
        typeFilter={typeFilter}
        onTypeFilterChange={setTypeFilter}
        sortBy={sortBy}
        onSortByChange={setSortBy}
      />

      {isError && (
        <div className="flex items-center gap-3 rounded-md border border-destructive/30 bg-destructive/5 px-4 py-3">
          <p className="flex-1 text-sm text-destructive">
            تعذّر تحميل البوستات. حاول مرة أخرى.
          </p>
          <Button type="button" size="sm" variant="outline" onClick={() => refetch()}>
            إعادة المحاولة
          </Button>
        </div>
      )}

      {isLoading ? (
        <ListLoadingSkeleton />
      ) : posts.length === 0 ? (
        <EmptyState
          icon="posts"
          title="لا توجد بوستات مطابقة"
          description="جرّب تغيير الفلاتر لعرض نتائج إضافية."
        />
      ) : (
        <PostsTable
          rows={posts}
          onOpenDetails={openDetails}
          onWorkflowAction={handleWorkflowAction}
          onDeletePost={openDeleteDialog}
          workflowPendingPostIds={workflowPendingPostIds}
          canPublish={canPublish}
          canArchive={canArchive}
          canRestore={canRestore}
          canDelete={canDelete}
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

      <PostFormSheet
        open={formModal.isOpen}
        mode="create"
        initialValues={EMPTY_POST_FORM_VALUES}
        isSubmitting={createMutation.isPending}
        onOpenChange={formModal.onOpenChange}
        onSubmit={handleSaveForm}
      />


      <DeletePostDialog
        open={deleteModal.isOpen}
        postTitle={deletePostTitle}
        isDeleting={deleteMutation.isPending}
        onOpenChange={deleteModal.onOpenChange}
        onConfirm={handleDeletePost}
      />
    </section>
  );
}
