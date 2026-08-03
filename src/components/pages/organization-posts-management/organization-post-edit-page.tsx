"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { EmptyState, FormLoadingSkeleton } from "@/components/shared";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { isCampaignRelatedPostType } from "@/components/pages/organization-posts-management/helpers";
import {
  organizationPostStatusLabels,
  organizationPostTypeLabels,
  type OrganizationPostStatus,
  type OrganizationPostType,
} from "@/components/pages/organization-posts-management/static-data";
import { routePaths } from "@/constant/routes";
import {
  useOrgPost,
  useUpdateOrgPost,
} from "@/features/org/posts/org.posts.query";
import { useAuth } from "@/providers/AuthProvider";

type OrganizationPostEditPageProps = {
  postId: string;
  scope: "owner" | "staff";
};

type PostEditValues = {
  title: string;
  summary: string;
  type: OrganizationPostType;
  status: OrganizationPostStatus;
  authorName: string;
  location: string;
  campaignTitle: string;
};

export function OrganizationPostEditPage({
  postId,
  scope,
}: OrganizationPostEditPageProps) {
  const { can } = useAuth();
  const postQuery = useOrgPost(postId);
  const post = postQuery.data?.data;
  const detailsRoute =
    scope === "staff"
      ? routePaths.organizationStaffScope.postDetails(postId)
      : routePaths.organizationOwnerScope.postDetails(postId);
  const postsRoute =
    scope === "staff"
      ? routePaths.organizationStaffScope.posts
      : routePaths.organizationOwnerScope.posts;

  if (postQuery.isLoading) {
    return (
      <FormLoadingSkeleton
        count={7}
        className="rounded-xl border border-border bg-card p-4 sm:p-6"
      />
    );
  }

  if (!can("org.posts.update")) {
    return (
      <section className="flex flex-1 flex-col gap-4">
        <EmptyState
          icon="ShieldOff"
          title="لا تملك صلاحية تعديل المنشورات"
          description="يمكنك الرجوع إلى تفاصيل المنشور أو قائمة المنشورات."
        />
        <Button asChild variant="outline" className="w-fit">
          <Link href={detailsRoute}>الرجوع إلى تفاصيل المنشور</Link>
        </Button>
      </section>
    );
  }

  if (!post || postQuery.isError) {
    return (
      <section className="flex flex-1 flex-col gap-4">
        <EmptyState
          icon="posts"
          title="تعذّر تحميل المنشور"
          description="تأكد من معرّف المنشور أو حاول إعادة تحميل البيانات."
        />
        <div className="flex flex-wrap gap-2">
          <Button type="button" variant="outline" onClick={() => postQuery.refetch()}>
            إعادة المحاولة
          </Button>
          <Button asChild variant="outline">
            <Link href={postsRoute}>الرجوع إلى المنشورات</Link>
          </Button>
        </div>
      </section>
    );
  }

  const initialValues: PostEditValues = {
    title: post.title,
    summary: post.summary,
    type: post.type,
    status: post.status,
    authorName: post.authorName,
    location: post.location,
    campaignTitle: post.campaignTitle ?? "",
  };

  return (
    <PostEditForm
      key={`${post.id}-${post.updatedAt}`}
      postId={post.id}
      detailsRoute={detailsRoute}
      initialValues={initialValues}
    />
  );
}

function PostEditForm({
  postId,
  detailsRoute,
  initialValues,
}: {
  postId: string;
  detailsRoute: string;
  initialValues: PostEditValues;
}) {
  const router = useRouter();
  const updateMutation = useUpdateOrgPost();
  const [values, setValues] = React.useState<PostEditValues>(initialValues);
  const campaignRelated = isCampaignRelatedPostType(values.type);

  return (
    <section className="flex flex-1 flex-col gap-4">
      <div>
        <h2 className="text-lg font-semibold text-foreground">تعديل المنشور</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          حدّث بيانات المنشور ثم احفظ التغييرات.
        </p>
      </div>

      <form
        className="space-y-5 rounded-xl border border-border bg-card p-4 shadow-sm sm:p-6"
        onSubmit={(event) => {
          event.preventDefault();
          updateMutation.mutate(
            {
              postId,
              body: {
                title: values.title.trim(),
                summary: values.summary.trim(),
                type: values.type,
                status: values.status,
                authorName: values.authorName.trim(),
                location: values.location.trim(),
                campaignTitle: campaignRelated ? values.campaignTitle.trim() : undefined,
              },
            },
            { onSuccess: () => router.push(detailsRoute) },
          );
        }}
      >
        <div className="space-y-2">
          <Label htmlFor="post-edit-title">عنوان المنشور</Label>
          <Input
            id="post-edit-title"
            required
            value={values.title}
            disabled={updateMutation.isPending}
            onChange={(event) => setValues((current) => ({ ...current, title: event.target.value }))}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="post-edit-summary">محتوى مختصر</Label>
          <Textarea
            id="post-edit-summary"
            required
            className="min-h-32"
            value={values.summary}
            disabled={updateMutation.isPending}
            onChange={(event) =>
              setValues((current) => ({ ...current, summary: event.target.value }))
            }
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label>نوع المنشور</Label>
            <Select
              dir="rtl"
              value={values.type}
              disabled={updateMutation.isPending}
              onValueChange={(value) =>
                setValues((current) => ({
                  ...current,
                  type: value as OrganizationPostType,
                }))
              }
            >
              <SelectTrigger className="w-full text-right"><SelectValue /></SelectTrigger>
              <SelectContent align="start">
                {Object.entries(organizationPostTypeLabels).map(([value, label]) => (
                  <SelectItem key={value} value={value}>{label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>الحالة</Label>
            <Select
              dir="rtl"
              value={values.status}
              disabled={updateMutation.isPending}
              onValueChange={(value) =>
                setValues((current) => ({
                  ...current,
                  status: value as OrganizationPostStatus,
                }))
              }
            >
              <SelectTrigger className="w-full text-right"><SelectValue /></SelectTrigger>
              <SelectContent align="start">
                {Object.entries(organizationPostStatusLabels).map(([value, label]) => (
                  <SelectItem key={value} value={value}>{label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="post-edit-author">الكاتب</Label>
            <Input
              id="post-edit-author"
              required
              value={values.authorName}
              disabled={updateMutation.isPending}
              onChange={(event) =>
                setValues((current) => ({ ...current, authorName: event.target.value }))
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="post-edit-location">الموقع</Label>
            <Input
              id="post-edit-location"
              required
              value={values.location}
              disabled={updateMutation.isPending}
              onChange={(event) =>
                setValues((current) => ({ ...current, location: event.target.value }))
              }
            />
          </div>
        </div>

        {campaignRelated ? (
          <div className="space-y-2">
            <Label htmlFor="post-edit-campaign">الحملة المرتبطة</Label>
            <Input
              id="post-edit-campaign"
              required
              value={values.campaignTitle}
              disabled={updateMutation.isPending}
              onChange={(event) =>
                setValues((current) => ({ ...current, campaignTitle: event.target.value }))
              }
            />
          </div>
        ) : null}

        <div className="flex flex-wrap gap-2 border-t border-border pt-4">
          <Button type="submit" disabled={updateMutation.isPending}>
            {updateMutation.isPending ? "جاري الحفظ..." : "حفظ التعديلات"}
          </Button>
          <Button asChild type="button" variant="outline">
            <Link href={detailsRoute}>إلغاء</Link>
          </Button>
        </div>
      </form>
    </section>
  );
}
