"use client";

import * as React from "react";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";

import { Button } from "@/components/ui/button";
import { EmptyState, PaginationControls } from "@/components/shared";
import { AppIcons } from "@/constant/icons";
import { DEFAULT_PAGE_SIZE, PAGE_SIZE_OPTIONS } from "@/constant/pagination";
import { usePagination } from "@/hooks/use-pagination";
import { useAuth } from "@/providers/AuthProvider";
import {
  isCampaignRelatedPostType,
  normalizePostStatus,
} from "@/components/pages/organization-posts-management/helpers";
import { DeletePostDialog } from "@/components/pages/organization-posts-management/delete-post-dialog";
import {
  EMPTY_POST_FORM_VALUES,
  PostFormSheet,
  type PostFormValues,
} from "@/components/pages/organization-posts-management/post-form-sheet";
import { PostDetailsSheet } from "@/components/pages/organization-posts-management/post-details-sheet";
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
  useUpdateOrgPost,
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
  const canEdit = can("org.posts.update");
  const canPublish = can("org.posts.publish");
  const canArchive = can("org.posts.archive");
  const canRestore = can("org.posts.restore");
  const canDelete = can("org.posts.delete");
  const searchParams = useSearchParams();

  const [pageSize, setPageSize] = React.useState<number>(DEFAULT_PAGE_SIZE);
  const [apiTotal, setApiTotal] = React.useState(0);

  const [typeFilter, setTypeFilter] = React.useState<
    "all" | OrganizationPostItem["type"]
  >("all");
  const [sortBy, setSortBy] = React.useState<PostsSortOption>("updated_newest");

  const [formOpen, setFormOpen] = React.useState(false);
  const [formMode, setFormMode] = React.useState<"create" | "edit">("create");
  const [editingPostId, setEditingPostId] = React.useState<string | null>(null);
  const [formInitialValues, setFormInitialValues] =
    React.useState<PostFormValues>(EMPTY_POST_FORM_VALUES);

  const [detailsSheetOpen, setDetailsSheetOpen] = React.useState(false);
  const [detailsPostId, setDetailsPostId] = React.useState<string | null>(null);
  const [detailsPost, setDetailsPost] = React.useState<OrganizationPostItem | null>(null);

  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [deletePostId, setDeletePostId] = React.useState<string | null>(null);
  const [deletePostTitle, setDeletePostTitle] = React.useState("");

  const handledNavigationAction = React.useRef<string | null>(null);

  const pagination = usePagination({ totalItems: apiTotal, pageSize });
  const { setCurrentPage } = pagination;

  const { data, isError, refetch } = useOrgPosts({
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

  const createMutation = useCreateOrgPost();
  const updateMutation = useUpdateOrgPost();
  const publishMutation = usePublishOrgPost();
  const archiveMutation = useArchiveOrgPost();
  const restoreMutation = useRestoreOrgPost();
  const deleteMutation = useDeleteOrgPost();

  const openCreateSheet = React.useCallback(() => {
    setFormMode("create");
    setEditingPostId(null);
    setFormInitialValues(EMPTY_POST_FORM_VALUES);
    setFormOpen(true);
  }, []);

  const openEditSheet = React.useCallback(
    (postId: string) => {
      const post = posts.find((p) => p.id === postId);
      if (!post) return;

      setFormMode("edit");
      setEditingPostId(post.id);
      setFormInitialValues({
        title: post.title,
        summary: post.summary,
        type: post.type,
        status: normalizePostStatus(post.status),
        authorName: post.authorName,
        location: post.location,
        campaignTitle: post.campaignTitle ?? "",
      });
      setFormOpen(true);
    },
    [posts],
  );

  React.useEffect(() => {
    const action = searchParams.get("action");
    const postId = searchParams.get("postId");
    const actionKey = `${action ?? "none"}:${postId ?? ""}`;

    if (handledNavigationAction.current === actionKey) return;

    if (action === "create") {
      handledNavigationAction.current = actionKey;
      openCreateSheet();
      return;
    }

    if (action === "edit" && postId) {
      handledNavigationAction.current = actionKey;
      openEditSheet(postId);
    }
  }, [openCreateSheet, openEditSheet, searchParams]);

  const openDetails = React.useCallback(
    (postId: string) => {
      const post = posts.find((p) => p.id === postId);
      setDetailsPostId(postId);
      setDetailsPost(post ?? null);
      setDetailsSheetOpen(true);
    },
    [posts],
  );

  const handleSaveForm = React.useCallback(
    (values: PostFormValues) => {
      const campaignTitle = isCampaignRelatedPostType(values.type)
        ? values.campaignTitle || undefined
        : undefined;

      if (formMode === "create") {
        createMutation.mutate(
          {
            title: values.title,
            summary: values.summary,
            type: values.type,
            status: values.status,
            authorName: values.authorName,
            location: values.location,
            campaignTitle,
          },
          { onSuccess: () => setFormOpen(false) },
        );
        return;
      }

      if (!editingPostId) return;

      updateMutation.mutate(
        {
          postId: editingPostId,
          body: {
            title: values.title,
            summary: values.summary,
            type: values.type,
            status: values.status,
            authorName: values.authorName,
            location: values.location,
            campaignTitle,
          },
        },
        {
          onSuccess: () => {
            setFormOpen(false);
            setEditingPostId(null);
          },
        },
      );
    },
    [formMode, editingPostId, createMutation, updateMutation],
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
    (postId: string) => {
      const post = posts.find((p) => p.id === postId);
      setDeletePostId(postId);
      setDeletePostTitle(post?.title ?? "-");
      setDeleteDialogOpen(true);
    },
    [posts],
  );

  const handleDeletePost = React.useCallback(() => {
    if (!deletePostId) return;
    deleteMutation.mutate(deletePostId, {
      onSuccess: () => {
        if (detailsPostId === deletePostId) {
          setDetailsSheetOpen(false);
          setDetailsPostId(null);
          setDetailsPost(null);
        }
        setDeletePostId(null);
        setDeleteDialogOpen(false);
      },
    });
  }, [deletePostId, detailsPostId, deleteMutation]);

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

      {posts.length === 0 ? (
        <EmptyState
          icon="posts"
          title="لا توجد بوستات مطابقة"
          description="جرّب تغيير الفلاتر لعرض نتائج إضافية."
        />
      ) : (
        <PostsTable
          rows={posts}
          onOpenDetails={openDetails}
          onEditPost={openEditSheet}
          onWorkflowAction={handleWorkflowAction}
          onDeletePost={openDeleteDialog}
          canEdit={canEdit}
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
        open={formOpen}
        mode={formMode}
        initialValues={formInitialValues}
        onOpenChange={(nextOpen) => {
          setFormOpen(nextOpen);
          if (!nextOpen) setEditingPostId(null);
        }}
        onSubmit={handleSaveForm}
      />

      <PostDetailsSheet
        open={detailsSheetOpen}
        post={detailsPost}
        onOpenChange={(nextOpen) => {
          setDetailsSheetOpen(nextOpen);
          if (!nextOpen) {
            setDetailsPostId(null);
            setDetailsPost(null);
          }
        }}
      />

      <DeletePostDialog
        open={deleteDialogOpen}
        postTitle={deletePostTitle}
        onOpenChange={(nextOpen) => {
          setDeleteDialogOpen(nextOpen);
          if (!nextOpen) setDeletePostId(null);
        }}
        onConfirm={handleDeletePost}
      />
    </section>
  );
}
