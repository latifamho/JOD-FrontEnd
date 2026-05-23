"use client";

import * as React from "react";
import { useSearchParams } from "next/navigation";

import { Button } from "@/components/ui/button";
import { EmptyState, PaginationControls } from "@/components/shared";
import { AppIcons } from "@/constant/icons";
import { DEFAULT_PAGE_SIZE, PAGE_SIZE_OPTIONS } from "@/constant/pagination";
import { usePagination } from "@/hooks/use-pagination";
import { toUtcTimestamp } from "@/lib/date";
import {
  createNextPostId,
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
  PostsSortOption,
} from "@/components/pages/organization-posts-management/posts-filters";
import { PostsTable } from "@/components/pages/organization-posts-management/posts-table";
import {
  organizationPostStatusLabels,
  organizationPostsStaticData,
  type OrganizationPostItem,
  type OrganizationPostStatus,
} from "@/components/pages/organization-posts-management/static-data";

type WorkflowAction = "publish" | "archive" | "restore";

type OrganizationPostsManagementPageProps = {
  status: "all" | OrganizationPostStatus;
};

export function OrganizationPostsManagementPage({
  status,
}: OrganizationPostsManagementPageProps) {
  const searchParams = useSearchParams();
  const [posts, setPosts] = React.useState<OrganizationPostItem[]>(() =>
    organizationPostsStaticData.map((post) => ({
      ...post,
      status: normalizePostStatus(post.status),
    })),
  );
  const [pageSize, setPageSize] = React.useState<number>(DEFAULT_PAGE_SIZE);

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

  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [deletePostId, setDeletePostId] = React.useState<string | null>(null);
  const handledNavigationAction = React.useRef<string | null>(null);

  const statusScopedPosts = React.useMemo(
    () =>
      posts.filter((post) =>
        status === "all" ? true : normalizePostStatus(post.status) === status,
      ),
    [posts, status],
  );

  const filteredPosts = React.useMemo(() => {
    const filtered = statusScopedPosts.filter((post) => {
      if (typeFilter !== "all" && post.type !== typeFilter) {
        return false;
      }

      return true;
    });

    return filtered.sort((firstPost, secondPost) => {
      if (sortBy === "updated_oldest") {
        return toUtcTimestamp(firstPost.updatedAt) - toUtcTimestamp(secondPost.updatedAt);
      }

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

      return toUtcTimestamp(secondPost.updatedAt) - toUtcTimestamp(firstPost.updatedAt);
    });
  }, [sortBy, statusScopedPosts, typeFilter]);

  const pagination = usePagination({
    totalItems: filteredPosts.length,
    pageSize,
  });
  const { setCurrentPage } = pagination;

  React.useEffect(() => {
    setCurrentPage(1);
  }, [pageSize, setCurrentPage, sortBy, status, typeFilter]);

  const currentPagePosts = React.useMemo(
    () => filteredPosts.slice(pagination.startIndex, pagination.endIndex),
    [filteredPosts, pagination.endIndex, pagination.startIndex],
  );

  const detailsPost = React.useMemo(
    () => (detailsPostId ? posts.find((post) => post.id === detailsPostId) ?? null : null),
    [detailsPostId, posts],
  );

  const deleteTargetPost = React.useMemo(
    () => (deletePostId ? posts.find((post) => post.id === deletePostId) ?? null : null),
    [deletePostId, posts],
  );

  const openCreateSheet = React.useCallback(() => {
    setFormMode("create");
    setEditingPostId(null);
    setFormInitialValues(EMPTY_POST_FORM_VALUES);
    setFormOpen(true);
  }, []);

  const openEditSheet = React.useCallback(
    (postId: string) => {
      const post = posts.find((candidate) => candidate.id === postId);
      if (!post) {
        return;
      }

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

    if (handledNavigationAction.current === actionKey) {
      return;
    }

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

  const openDetails = React.useCallback((postId: string) => {
    setDetailsPostId(postId);
    setDetailsSheetOpen(true);
  }, []);

  const handleSaveForm = React.useCallback(
    (values: PostFormValues) => {
      const now = new Date().toISOString();
      const campaignTitle = isCampaignRelatedPostType(values.type)
        ? values.campaignTitle || undefined
        : undefined;

      if (formMode === "create") {
        const nextPost: OrganizationPostItem = {
          id: createNextPostId(posts),
          title: values.title,
          summary: values.summary,
          type: values.type,
          status: values.status,
          authorName: values.authorName,
          location: values.location,
          campaignTitle,
          createdAt: now,
          updatedAt: now,
          publishedAt: values.status === "published" ? now : undefined,
          viewsCount: 0,
          reactionsCount: 0,
          applicationsCount: values.type === "job_opportunity" ? 0 : 0,
        };

        setPosts((currentPosts) => [nextPost, ...currentPosts]);
        return;
      }

      if (!editingPostId) {
        return;
      }

      setPosts((currentPosts) =>
        currentPosts.map((post) => {
          if (post.id !== editingPostId) {
            return post;
          }

          return {
            ...post,
            title: values.title,
            summary: values.summary,
            type: values.type,
            status: values.status,
            authorName: values.authorName,
            location: values.location,
            campaignTitle,
            updatedAt: now,
            publishedAt:
              values.status === "published"
                ? post.publishedAt ?? now
                : values.status === "archived"
                  ? post.publishedAt
                  : undefined,
          };
        }),
      );
    },
    [editingPostId, formMode, posts],
  );

  const handleWorkflowAction = React.useCallback(
    (postId: string, action: WorkflowAction) => {
      const now = new Date().toISOString();

      setPosts((currentPosts) =>
        currentPosts.map((post) => {
          if (post.id !== postId) {
            return post;
          }

          if (action === "publish") {
            return {
              ...post,
              status: "published",
              updatedAt: now,
              publishedAt: post.publishedAt ?? now,
            };
          }

          if (action === "archive") {
            return {
              ...post,
              status: "archived",
              updatedAt: now,
            };
          }

          return {
            ...post,
            status: "draft",
            updatedAt: now,
          };
        }),
      );
    },
    [],
  );

  const openDeleteDialog = React.useCallback((postId: string) => {
    setDeletePostId(postId);
    setDeleteDialogOpen(true);
  }, []);

  const handleDeletePost = React.useCallback(() => {
    if (!deletePostId) {
      return;
    }

    setPosts((currentPosts) => currentPosts.filter((post) => post.id !== deletePostId));

    if (detailsPostId === deletePostId) {
      setDetailsSheetOpen(false);
      setDetailsPostId(null);
    }

    setDeletePostId(null);
  }, [deletePostId, detailsPostId]);

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
            {filteredPosts.length}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button type="button" onClick={openCreateSheet}>
            إضافة بوست جديد
            <AppIcons.posts className="size-4" />
          </Button>
        </div>
      </div>

      <PostsFilters
        typeFilter={typeFilter}
        onTypeFilterChange={setTypeFilter}
        sortBy={sortBy}
        onSortByChange={setSortBy}
      />

      {currentPagePosts.length === 0 ? (
        <EmptyState
          icon="posts"
          title="لا توجد بوستات مطابقة"
          description="جرّب تغيير الفلاتر لعرض نتائج إضافية."
        />
      ) : (
        <PostsTable
          rows={currentPagePosts}
          onOpenDetails={openDetails}
          onEditPost={openEditSheet}
          onWorkflowAction={handleWorkflowAction}
          onDeletePost={openDeleteDialog}
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
          if (!nextOpen) {
            setEditingPostId(null);
          }
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
          }
        }}
      />

      <DeletePostDialog
        open={deleteDialogOpen}
        postTitle={deleteTargetPost?.title ?? "-"}
        onOpenChange={(nextOpen) => {
          setDeleteDialogOpen(nextOpen);
          if (!nextOpen) {
            setDeletePostId(null);
          }
        }}
        onConfirm={handleDeletePost}
      />
    </section>
  );
}
