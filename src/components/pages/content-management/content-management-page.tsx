"use client";

import * as React from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { ContentTable } from "@/components/pages/content-management/content-table";
import {
  type ArticleItem,
} from "@/components/pages/content-management/static-data";
import { readStoredArticles } from "@/components/pages/content-management/helpers";
import { AppIcons } from "@/constant/icons";
import { routePaths } from "@/constant/routes";

export function ContentManagementPage() {
  const router = useRouter();
  const [articles, setArticles] = React.useState<ArticleItem[]>(() =>
    readStoredArticles(),
  );

  React.useEffect(() => {
    setArticles(readStoredArticles());
  }, []);

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
            {articles.length} مقال
          </p>
        </div>
        <Button
          size="sm"
          className="w-fit"
          onClick={() => router.push(routePaths.adminScope.contentNew)}
        >
          <AppIcons.content className="size-4" />
          مقال جديد
        </Button>
      </div>

      {articles.length === 0 ? (
        <div className="flex min-h-64 flex-col items-center justify-center rounded-xl border border-dashed border-border bg-background px-6 text-center">
          <p className="text-sm font-medium text-foreground">
            لا توجد مقالات حتى الآن
          </p>
        </div>
      ) : (
        <ContentTable rows={articles} onEdit={handleEdit} />
      )}
    </section>
  );
}
