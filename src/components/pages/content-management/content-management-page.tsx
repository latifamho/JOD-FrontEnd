"use client";

import * as React from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { ContentTable } from "@/components/pages/content-management/content-table";
import { AppIcons } from "@/constant/icons";
import { routePaths } from "@/constant/routes";
import { EmptyState, PaginationControls } from "@/components/shared";
import { DEFAULT_PAGE_SIZE, PAGE_SIZE_OPTIONS } from "@/constant/pagination";
import { usePagination } from "@/hooks/use-pagination";
import { useAdminArticles } from "@/features/admin/articles/admin.articles.query";

export function ContentManagementPage() {
  const router = useRouter();

  const [pageSize, setPageSize] = React.useState<number>(DEFAULT_PAGE_SIZE);
  const [apiTotal, setApiTotal] = React.useState(0);

  const pagination = usePagination({ totalItems: apiTotal, pageSize });
  const { setCurrentPage } = pagination;

  const { data, isLoading, isError, refetch } = useAdminArticles({
    page: pagination.currentPage,
    perPage: pageSize,
    sort: "-createdAt",
  });

  React.useEffect(() => {
    if (data?.meta.total !== undefined) {
      setApiTotal(data.meta.total);
    }
  }, [data?.meta.total]);

  React.useEffect(() => {
    setCurrentPage(1);
  }, [pageSize, setCurrentPage]);

  const articles = data?.data ?? [];

  const handleEdit = React.useCallback(
    (id: string) => {
      router.push(routePaths.adminScope.contentEdit(id));
    },
    [router],
  );

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
          disabled={isLoading}
          onClick={() => router.push(routePaths.adminScope.contentNew)}
        >
          <AppIcons.content className="size-4" />
          مقال جديد
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

      {!isLoading && articles.length === 0 ? (
        <EmptyState
          icon="content"
          title="لا توجد مقالات حتى الآن"
          description="أنشئ مقالاً جديداً من الزر أعلاه."
        />
      ) : (
        <ContentTable rows={articles} onEdit={handleEdit} />
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
