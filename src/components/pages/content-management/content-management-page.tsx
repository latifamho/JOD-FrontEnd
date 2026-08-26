"use client";

import * as React from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ContentTable } from "@/components/pages/content-management/content-table";
import { ContentFormSheet } from "@/components/pages/content-management/content-form-sheet";
import {
  articleStatusLabels,
  type ArticleStatus,
} from "@/components/pages/content-management/content-management.types";
import { AppIcons } from "@/constant/icons";
import { EmptyState, PaginationControls } from "@/components/shared";
import { DEFAULT_PAGE_SIZE, PAGE_SIZE_OPTIONS } from "@/constant/pagination";
import { usePagination } from "@/hooks/use-pagination";
import { useQueryModal } from "@/hooks/use-query-modal";
import {
  useAdminArticles,
  useDeleteArticle,
} from "@/features/admin/articles/admin.articles.query";
import { displayOrDash } from "@/lib/text";

export function ContentManagementPage() {
  const [pageSize, setPageSize] = React.useState<number>(DEFAULT_PAGE_SIZE);
  const [apiTotal, setApiTotal] = React.useState(0);
  const [searchFilter, setSearchFilter] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState<"all" | ArticleStatus>("all");
  const deleteModal = useQueryModal("article-delete");
  const contentForm = useQueryModal("content-form");
  const deleteTargetId = deleteModal.id;

  const pagination = usePagination({ totalItems: apiTotal, pageSize });
  const { setCurrentPage } = pagination;

  const { data, isLoading, isFetching, isError, refetch } = useAdminArticles({
    page: pagination.currentPage,
    perPage: pageSize,
    sort: "-createdAt",
    filter: {
      search: searchFilter.trim() || undefined,
      status: statusFilter !== "all" ? statusFilter : undefined,
    },
  });

  React.useEffect(() => {
    if (data?.meta.total !== undefined) {
      setApiTotal(data.meta.total);
    }
  }, [data?.meta.total]);

  React.useEffect(() => {
    setCurrentPage(1);
  }, [pageSize, searchFilter, statusFilter, setCurrentPage]);

  const articles = data?.data ?? [];
  const showTableLoading = isLoading || (isFetching && !isLoading);
  const deleteMutation = useDeleteArticle();

  const deleteTarget = deleteTargetId
    ? (articles.find((a) => a.id === deleteTargetId) ?? null)
    : null;

  const handleEdit = React.useCallback(
    (id: string) => {
      contentForm.open({ mode: "edit", id });
    },
    [contentForm],
  );

  const handleResetFilters = React.useCallback(() => {
    setSearchFilter("");
    setStatusFilter("all");
  }, []);

  const handleDelete = React.useCallback(() => {
    if (!deleteTargetId) return;
    deleteMutation.mutate(deleteTargetId, {
      onSuccess: () => {
        // success toast from api interceptor
        deleteModal.close();
      },
    });
  }, [deleteTargetId, deleteMutation]);

  return (
    <section className="flex flex-col flex-1 gap-4">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-base font-semibold text-foreground">
            إدارة المحتوى والمدونة
          </h2>
          <p className="mt-0.5 text-xs text-muted-foreground">
            {apiTotal} مقال
          </p>
        </div>
        <Button
          size="sm"
          className="w-fit"
          disabled={showTableLoading}
          onClick={() => contentForm.open({ mode: "create" })}
        >
          <AppIcons.content className="size-4" />
          مقال جديد
        </Button>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <Input
          dir="rtl"
          autoComplete="off"
          disabled={showTableLoading}
          placeholder="بحث بالعنوان..."
          value={searchFilter}
          onChange={(e) => setSearchFilter(e.target.value)}
          className="min-w-[160px] flex-1 text-right text-xs sm:max-w-xs"
        />
        <Select
          dir="rtl"
          disabled={showTableLoading}
          value={statusFilter}
          onValueChange={(value) =>
            setStatusFilter(value as "all" | ArticleStatus)
          }
        >
          <SelectTrigger className="w-full min-w-[140px] flex-1 text-right text-xs sm:max-w-[180px]">
            <SelectValue placeholder="الحالة" />
          </SelectTrigger>
          <SelectContent align="start" position="popper" className="text-right">
            <SelectItem value="all" className="text-right text-xs">
              كل الحالات
            </SelectItem>
            {(Object.keys(articleStatusLabels) as ArticleStatus[]).map((status) => (
              <SelectItem key={status} value={status} className="text-right text-xs">
                {articleStatusLabels[status]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="ms-auto h-8 shrink-0 px-3 text-xs"
          disabled={showTableLoading}
          onClick={handleResetFilters}
        >
          إعادة تعيين
        </Button>
      </div>

      {isError && (
        <div className="flex items-center gap-3 rounded-md border border-destructive/30 bg-destructive/5 px-4 py-3">
          <p className="flex-1 text-sm text-destructive">
            تعذّر تحميل المقالات. حاول مرة أخرى.
          </p>
          <Button type="button" size="sm" variant="outline" onClick={() => refetch()}>
            إعادة المحاولة
          </Button>
        </div>
      )}

      {!showTableLoading && articles.length === 0 ? (
        <EmptyState
          icon="content"
          title="لا توجد مقالات حتى الآن"
          description="أنشئ مقالاً جديداً من الزر أعلاه."
        />
      ) : (
        <ContentTable
          rows={articles}
          isLoading={showTableLoading}
          onEdit={handleEdit}
          onDelete={(id) => {
            deleteModal.open({ id });
          }}
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

      <ContentFormSheet
        open={contentForm.isOpen}
        mode={contentForm.mode === "edit" ? "edit" : "create"}
        articleId={contentForm.id ?? undefined}
        onOpenChange={(nextOpen) => {
          if (!nextOpen) contentForm.close();
        }}
      />

      <Dialog
        open={deleteModal.isOpen}
        onOpenChange={(nextOpen) => {
          if (!deleteMutation.isPending && !nextOpen) deleteModal.close();
        }}
      >
        <DialogContent dir="rtl" className="sm:max-w-md">
          <DialogHeader className="pe-12 text-right sm:text-right">
            <DialogTitle>حذف المقال؟</DialogTitle>
            <DialogDescription>
              سيتم حذف المقال{" "}
              <span className="font-semibold text-foreground">
                {displayOrDash(deleteTarget?.title)}
              </span>{" "}
              نهائياً.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="sm:justify-start">
            <Button
              type="button"
              variant="outline"
              disabled={deleteMutation.isPending}
              onClick={() => deleteModal.close()}
            >
              إلغاء
            </Button>
            <Button
              type="button"
              variant="destructive"
              disabled={deleteMutation.isPending}
              onClick={handleDelete}
            >
              حذف
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  );
}
