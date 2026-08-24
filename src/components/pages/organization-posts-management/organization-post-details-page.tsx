"use client";

/* eslint-disable @next/next/no-img-element */

import Link from "next/link";

import { DetailsLoadingSkeleton, EmptyState } from "@/components/shared";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  getPostStatusBadgeClass,
  isCampaignRelatedPostType,
  normalizePostStatus,
} from "@/components/pages/organization-posts-management/helpers";
import {
  organizationPostStatusLabels,
  organizationPostTypeLabels,
} from "@/components/pages/organization-posts-management/static-data";
import { routePaths } from "@/constant/routes";
import { useOrgPost } from "@/features/org/posts/org.posts.query";
import { useOrgCategoriesBrief } from "@/features/org/categories/org.categories.query";
import { formatUtcDateTime, formatUtcDateTimeOrDash } from "@/lib/date";
import { displayOrDash } from "@/lib/text";
import { useAuth } from "@/providers/AuthProvider";

type OrganizationPostDetailsPageProps = {
  postId: string;
  scope: "owner" | "staff";
};

export function OrganizationPostDetailsPage({ postId, scope }: OrganizationPostDetailsPageProps) {
  const { can } = useAuth();
  const postQuery = useOrgPost(postId);
  const post = postQuery.data?.data;
  const categoriesBrief = useOrgCategoriesBrief();
  const postsRoute =
    scope === "staff"
      ? routePaths.organizationStaffScope.posts
      : routePaths.organizationOwnerScope.posts;
  const editRoute =
    scope === "staff"
      ? routePaths.organizationStaffScope.postEdit(postId)
      : routePaths.organizationOwnerScope.postEdit(postId);

  if (postQuery.isLoading) {
    return <DetailsLoadingSkeleton className="rounded-xl border border-border bg-card" />;
  }

  if (!post || postQuery.isError) {
    return (
      <section className="flex flex-1 flex-col gap-4">
        <EmptyState
          icon="posts"
          title="المنشور غير موجود"
          description="تأكد من معرّف المنشور أو ارجع إلى قائمة المنشورات."
        />
        <div className="flex flex-wrap gap-2">
          <Button type="button" variant="outline" onClick={() => postQuery.refetch()}>
            إعادة المحاولة
          </Button>
          <div className="flex flex-wrap gap-2">
            {can("org.posts.update") ? (
              <Button asChild>
                <Link href={editRoute}>تعديل المنشور</Link>
              </Button>
            ) : null}
            <Button asChild variant="outline">
              <Link href={postsRoute}>الرجوع إلى المنشورات</Link>
            </Button>
          </div>
        </div>
      </section>
    );
  }

  const normalizedStatus = normalizePostStatus(post.status);
  const campaignRelated = isCampaignRelatedPostType(post.type);
  const categoryName = (categoriesBrief.data?.data ?? []).find((category) => category.id === post.categoryId)?.name;

  return (
    <section className="flex flex-1 flex-col gap-4">
      <div className="rounded-xl border border-border bg-card p-4 shadow-sm sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="outline" className={getPostStatusBadgeClass(normalizedStatus)}>
                {organizationPostStatusLabels[normalizedStatus]}
              </Badge>
              <Badge variant="outline">{organizationPostTypeLabels[post.type]}</Badge>
              <Badge variant="outline">{displayOrDash(categoryName)}</Badge>
              <Badge variant="outline">{post.id}</Badge>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-foreground">{post.title}</h2>
              <p className="mt-2 max-w-3xl text-sm leading-7 text-muted-foreground">
                {post.summary}
              </p>
            </div>
          </div>

          <Button asChild variant="outline">
            <Link href={postsRoute}>الرجوع إلى المنشورات</Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
          <h3 className="text-sm font-semibold text-foreground">بيانات المنشور</h3>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <DetailItem label="الموقع" value={displayOrDash(post.location)} />
            <DetailItem label="تاريخ الإنشاء" value={formatUtcDateTime(post.createdAt)} />
            <DetailItem label="آخر تحديث" value={formatUtcDateTime(post.updatedAt)} />
            <DetailItem label="تاريخ النشر" value={formatUtcDateTimeOrDash(post.publishedAt)} />
            {campaignRelated ? (
              <DetailItem label="الحملة المرتبطة" value={displayOrDash(post.campaignTitle)} />
            ) : null}
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
          <h3 className="text-sm font-semibold text-foreground">مؤشرات المنشور</h3>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            <MetricCard label="المشاهدات" value={post.viewsCount} />
            <MetricCard label="التفاعلات" value={post.reactionsCount} />
            <MetricCard label="المتقدمون" value={post.applicationsCount} />
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card p-4 shadow-sm sm:p-6">
        <h3 className="text-sm font-semibold text-foreground">محتوى المنشور</h3>
        <p className="mt-3 whitespace-pre-wrap text-sm leading-8 text-foreground">
          {post.body ?? post.summary}
        </p>
      </div>

      {(post.images?.length ?? 0) > 0 ? (
        <div className="rounded-xl border border-border bg-card p-4 shadow-sm sm:p-6">
          <h3 className="text-sm font-semibold text-foreground">الصور المرفقة</h3>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {post.images?.map((url, index) => (
              <img
                key={`${url}-${index}`}
                src={url}
                alt={`صورة المنشور ${index + 1}`}
                className="aspect-video w-full rounded-xl border border-border object-cover"
              />
            ))}
          </div>
        </div>
      ) : null}
    </section>
  );
}

function DetailItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-1 text-sm font-medium text-foreground">{value}</p>
    </div>
  );
}

function MetricCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-lg border border-border bg-muted/30 p-4">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-2 text-xl font-semibold text-foreground">{value}</p>
    </div>
  );
}
