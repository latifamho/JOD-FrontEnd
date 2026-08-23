"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Controller, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2 } from "lucide-react";

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
import { syrianGovernorateOptions } from "@/components/pages/organization-campaigns/static-data";
import { isCampaignRelatedPostType } from "@/components/pages/organization-posts-management/helpers";
import { organizationPostTypeLabels } from "@/components/pages/organization-posts-management/static-data";
import { routePaths } from "@/constant/routes";
import {
  useOrgPost,
  useUpdateOrgPost,
} from "@/features/org/posts/org.posts.query";
import { useAuth } from "@/providers/AuthProvider";

const postEditSchema = z
  .object({
    title: z
      .string()
      .min(1, "عنوان المنشور مطلوب")
      .max(255, "عنوان المنشور يجب ألا يتجاوز 255 حرفًا")
      .refine((value) => value.trim().length > 0, "عنوان المنشور مطلوب"),
    summary: z
      .string()
      .min(1, "محتوى المنشور مطلوب")
      .refine((value) => value.trim().length > 0, "محتوى المنشور مطلوب"),
    type: z.enum([
      "general",
      "job_opportunity",
      "campaign_teaser",
      "campaign_update",
      "campaign_summary",
    ]),
    location: z
      .string()
      .min(1, "المحافظة مطلوبة")
      .refine(
        (value) => syrianGovernorateOptions.some((option) => option.value === value),
        "اختر محافظة سورية صحيحة",
      ),
    campaignTitle: z.string(),
  })
  .superRefine((values, context) => {
    if (
      isCampaignRelatedPostType(values.type) &&
      values.campaignTitle.trim().length === 0
    ) {
      context.addIssue({
        code: "custom",
        path: ["campaignTitle"],
        message: "الحملة المرتبطة مطلوبة لهذا النوع من المنشورات",
      });
    }
  });

type PostEditValues = z.infer<typeof postEditSchema>;

type OrganizationPostEditPageProps = {
  postId: string;
  scope: "owner" | "staff";
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
        count={6}
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
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<PostEditValues>({
    resolver: zodResolver(postEditSchema),
    defaultValues: initialValues,
  });
  const selectedType = useWatch({ control, name: "type" });
  const campaignRelated = isCampaignRelatedPostType(selectedType);
  const isSubmitting = updateMutation.isPending;

  return (
    <section className="flex flex-1 flex-col gap-4">
      <div>
        <h2 className="text-lg font-semibold text-foreground">تعديل المنشور</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          حدّث بيانات المنشور ثم احفظ التغييرات. حالة المنشور تُدار من إجراءات قائمة المنشورات.
        </p>
      </div>

      <form
        noValidate
        className="space-y-5 rounded-xl border border-border bg-card p-4 shadow-sm sm:p-6"
        onSubmit={handleSubmit((values) => {
          updateMutation.mutate(
            {
              postId,
              body: {
                title: values.title.trim(),
                summary: values.summary.trim(),
                type: values.type,
                location: values.location,
                campaignTitle: isCampaignRelatedPostType(values.type)
                  ? values.campaignTitle.trim()
                  : undefined,
              },
            },
            { onSuccess: () => router.push(detailsRoute) },
          );
        })}
      >
        <div className="space-y-2">
          <Label htmlFor="post-edit-title">عنوان المنشور</Label>
          <Input
            id="post-edit-title"
            disabled={isSubmitting}
            aria-invalid={Boolean(errors.title)}
            {...register("title")}
          />
          {errors.title ? (
            <p className="text-xs text-destructive">{errors.title.message}</p>
          ) : null}
        </div>

        <div className="space-y-2">
          <Label htmlFor="post-edit-summary">محتوى مختصر</Label>
          <Textarea
            id="post-edit-summary"
            className="min-h-32"
            disabled={isSubmitting}
            aria-invalid={Boolean(errors.summary)}
            {...register("summary")}
          />
          {errors.summary ? (
            <p className="text-xs text-destructive">{errors.summary.message}</p>
          ) : null}
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label>نوع المنشور</Label>
            <Controller
              control={control}
              name="type"
              render={({ field }) => (
                <Select
                  dir="rtl"
                  value={field.value}
                  disabled={isSubmitting}
                  onValueChange={field.onChange}
                >
                  <SelectTrigger
                    className="w-full text-right"
                    aria-invalid={Boolean(errors.type)}
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent align="start" position="popper" className="text-right">
                    {Object.entries(organizationPostTypeLabels).map(([value, label]) => (
                      <SelectItem key={value} value={value} className="text-right text-xs">
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          <div className="space-y-2">
            <Label>المحافظة</Label>
            <Controller
              control={control}
              name="location"
              render={({ field }) => (
                <Select
                  dir="rtl"
                  value={field.value || undefined}
                  disabled={isSubmitting}
                  onValueChange={field.onChange}
                >
                  <SelectTrigger
                    className="w-full text-right"
                    aria-invalid={Boolean(errors.location)}
                  >
                    <SelectValue placeholder="اختر المحافظة" />
                  </SelectTrigger>
                  <SelectContent align="start" position="popper" className="text-right">
                    {syrianGovernorateOptions.map((option) => (
                      <SelectItem
                        key={option.value}
                        value={option.value}
                        className="text-right text-xs"
                      >
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.location ? (
              <p className="text-xs text-destructive">{errors.location.message}</p>
            ) : null}
          </div>
        </div>

        {campaignRelated ? (
          <div className="space-y-2">
            <Label htmlFor="post-edit-campaign">الحملة المرتبطة</Label>
            <Input
              id="post-edit-campaign"
              disabled={isSubmitting}
              aria-invalid={Boolean(errors.campaignTitle)}
              {...register("campaignTitle")}
            />
            {errors.campaignTitle ? (
              <p className="text-xs text-destructive">{errors.campaignTitle.message}</p>
            ) : null}
          </div>
        ) : null}

        <div className="flex flex-wrap gap-2 border-t border-border pt-4">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? <Loader2 className="size-4 animate-spin" /> : null}
            {isSubmitting ? "جاري الحفظ..." : "حفظ التعديلات"}
          </Button>
          <Button
            type="button"
            variant="outline"
            disabled={isSubmitting}
            onClick={() => router.push(detailsRoute)}
          >
            إلغاء
          </Button>
        </div>
      </form>
    </section>
  );
}
