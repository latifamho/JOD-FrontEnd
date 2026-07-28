"use client";

import * as React from "react";
import Link from "next/link";
import { useMutation } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { AppIcons } from "@/constant/icons";
import { routePaths } from "@/constant/routes";
import { dashboardProfileDefaultsByScope } from "@/components/pages/dashboard-profile/dashboard-profile.data";
import type { DashboardProfileScope } from "@/components/pages/dashboard-profile/dashboard-profile.types";
import { formatUtcDateOrDash } from "@/lib/date";
import { displayOrDash } from "@/lib/text";
import { getPostStatusBadgeClass } from "@/components/pages/organization-posts-management/helpers";
import { authServices } from "@/features/shared/auth.services/auth.service";
import { useAuth } from "@/providers/AuthProvider";
import { setUser } from "@/lib/cookies";
import { normalizeApiError } from "@/lib/api-errors";
import {
  organizationPostStatusLabels,
  organizationPostTypeLabels,
  organizationPostsStaticData,
} from "@/components/pages/organization-posts-management/static-data";

type DashboardProfilePageProps = {
  scope: DashboardProfileScope;
};

const scopeLabels = {
  admin: "الملف الشخصي للأدمن",
  "org-owner": "ملف المنظمة",
  "org-staff": "الملف الشخصي",
};

type PostsRouteGroup = {
  all: string;
  draft: string;
  published: string;
  archived: string;
};

function getProfileInitials(name: string): string {
  const segments = name
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  if (segments.length === 0) {
    return "؟";
  }
  if (segments.length === 1) {
    return segments[0].slice(0, 2).toUpperCase();
  }
  return `${segments[0][0] ?? ""}${segments[1][0] ?? ""}`.toUpperCase();
}

export function DashboardProfilePage({ scope }: DashboardProfilePageProps) {
  const defaults = dashboardProfileDefaultsByScope[scope];
  const { user, updateUser } = useAuth();
  const [name, setName] = React.useState(defaults.name);
  const [email, setEmail] = React.useState(defaults.email);
  const [phone, setPhone] = React.useState("");
  const [profileError, setProfileError] = React.useState<string | null>(null);
  const isOrganizationScope = scope === "org-owner" || scope === "org-staff";

  React.useEffect(() => {
    if (scope !== "admin" || !user) return;
    setName(user.name);
    setEmail(user.email);
    setPhone(user.phone ?? "");
  }, [scope, user]);

  const updateProfileMutation = useMutation({
    mutationFn: () => authServices.updateProfile({
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
    }),
    onSuccess: (response) => {
      setProfileError(null);
      setUser(response.data);
      updateUser(response.data);
    },
    onError: (error) => {
      setProfileError(normalizeApiError(error).message);
    },
  });

  const profilePosts = React.useMemo(
    () =>
      [...organizationPostsStaticData].sort(
        (firstPost, secondPost) =>
          new Date(secondPost.updatedAt).getTime() -
          new Date(firstPost.updatedAt).getTime(),
      ),
    [],
  );

  const postsRoutes: PostsRouteGroup =
    scope === "org-owner"
      ? {
          all: routePaths.organizationOwnerScope.posts,
          draft: routePaths.organizationOwnerScope.postsDraft,
          published: routePaths.organizationOwnerScope.postsPublished,
          archived: routePaths.organizationOwnerScope.postsArchived,
        }
      : {
          all: routePaths.organizationStaffScope.posts,
          draft: routePaths.organizationStaffScope.postsDraft,
          published: routePaths.organizationStaffScope.postsPublished,
          archived: routePaths.organizationStaffScope.postsArchived,
        };

  const profileSubtitle =
    scope === "org-owner" ? "مالك المنظمة" : "عضو فريق المنظمة";

  const postsStatusCounts = React.useMemo(() => {
    return {
      all: profilePosts.length,
      published: profilePosts.filter((post) => post.status === "published").length,
      draft: profilePosts.filter((post) => post.status === "draft").length,
      archived: profilePosts.filter((post) => post.status === "archived").length,
    };
  }, [profilePosts]);

  if (isOrganizationScope) {
    return (
      <section className="flex w-full flex-1 flex-col gap-4">
        <div className="relative overflow-hidden rounded-2xl bg-card">
          <div className="h-44 w-full bg-gradient-to-l from-sky-700 via-sky-600 to-cyan-500 sm:h-52" />
          <div className="px-4 pb-4 sm:px-6">
            <div className="-mt-12 flex flex-col gap-4 sm:-mt-14 sm:flex-row sm:items-end sm:justify-between">
              <div className="flex items-end gap-3">
                <div className="flex size-24 items-center justify-center rounded-full border-4 border-card bg-slate-100 text-lg font-bold text-slate-700 shadow-sm sm:size-28">
                  {getProfileInitials(name)}
                </div>
                <div className="pb-1">
                  <h2 className="text-lg font-semibold text-foreground sm:text-2xl">
                    {name}
                  </h2>
                  <p className="text-xs text-muted-foreground sm:text-sm">
                    {profileSubtitle} • {email}
                  </p>
                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    {defaults.showVerifiedBadge && (
                      <Badge variant="secondary">موثّق</Badge>
                    )}
                    {defaults.showOrgBadge && (
                      <Badge variant="outline">مؤسسة موثقة</Badge>
                    )}
                    <Badge variant="outline">
                      {postsStatusCounts.all} بوست
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <Button asChild>
                  <Link href={`${postsRoutes.all}?action=create`}>
                    إضافة بوست جديد
                    <AppIcons.posts className="size-4" />
                  </Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link href={postsRoutes.all}>
                    إدارة البوستات
                    <AppIcons.settings className="size-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-4">
          <div className="grid gap-4 lg:grid-cols-[280px_minmax(0,1fr)] lg:items-start">
            <aside className="space-y-4 lg:sticky lg:top-4 lg:self-start">
            <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
              <h3 className="text-sm font-semibold text-foreground">
                تصفح البوستات
              </h3>
              <p className="mt-1 text-xs text-muted-foreground">
                من هون بتدخل مباشرة على صفحات الإدارة.
              </p>
              <div className="mt-3 space-y-2">
                <Button className="w-full justify-between" asChild>
                  <Link href={postsRoutes.all}>
                    كل البوستات
                    <span className="text-xs">{postsStatusCounts.all}</span>
                  </Link>
                </Button>
                <Button className="w-full justify-between" variant="outline" asChild>
                  <Link href={postsRoutes.published}>
                    المنشورة
                    <span className="text-xs">{postsStatusCounts.published}</span>
                  </Link>
                </Button>
                <Button className="w-full justify-between" variant="outline" asChild>
                  <Link href={postsRoutes.draft}>
                    المسودات
                    <span className="text-xs">{postsStatusCounts.draft}</span>
                  </Link>
                </Button>
                <Button className="w-full justify-between" variant="outline" asChild>
                  <Link href={postsRoutes.archived}>
                    الأرشيف
                    <span className="text-xs">{postsStatusCounts.archived}</span>
                  </Link>
                </Button>
              </div>
            </div>

            <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
              <h3 className="text-sm font-semibold text-foreground">اختصارات</h3>
              <div className="mt-3 flex flex-col gap-2">
                <Button size="sm" asChild>
                  <Link href={`${postsRoutes.all}?action=create`}>
                    إنشاء بوست
                    <AppIcons.posts className="size-4" />
                  </Link>
                </Button>
                <Button size="sm" variant="outline" asChild>
                  <Link href={postsRoutes.all}>
                    صفحة إدارة البوستات
                    <AppIcons.settings className="size-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </aside>

            <div className="mx-auto w-full space-y-4 lg:max-w-[820px]">
            <article className="rounded-xl border border-border bg-card p-4 shadow-sm">
              <div className="flex items-start gap-3">
                <div className="mt-1 flex size-10 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                  {getProfileInitials(name)}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">
                    بماذا تفكر اليوم؟
                  </p>
                  <p className="text-xs text-muted-foreground">
                    شارك تحديث جديد مع المتابعين من صفحة البوستات.
                  </p>
                </div>
                <Button size="sm" asChild>
                  <Link href={`${postsRoutes.all}?action=create`}>
                    إنشاء
                  </Link>
                </Button>
              </div>
            </article>

            {profilePosts.map((post) => (
              <article
                key={post.id}
                className="overflow-hidden rounded-xl border border-border bg-card shadow-sm"
              >
                <div className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 flex size-10 items-center justify-center rounded-full bg-muted text-xs font-semibold text-foreground">
                      {getProfileInitials(post.authorName)}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-foreground">
                        {displayOrDash(post.authorName)}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatUtcDateOrDash(post.updatedAt)} •{" "}
                        {displayOrDash(post.location)}
                      </p>
                    </div>
                    <Badge className={getPostStatusBadgeClass(post.status)}>
                      {organizationPostStatusLabels[post.status]}
                    </Badge>
                  </div>

                  <p className="mt-3 text-base font-medium text-foreground">
                    {post.title}
                  </p>
                  <p className="mt-2 text-sm leading-7 text-muted-foreground">
                    {post.summary}
                  </p>
                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    <Badge variant="outline">{organizationPostTypeLabels[post.type]}</Badge>
                    {post.campaignTitle && (
                      <Badge variant="secondary">{post.campaignTitle}</Badge>
                    )}
                  </div>
                </div>

                <div className="aspect-video w-full border-y border-border bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800/70 dark:to-slate-700/70">
                  <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                    صورة البوست
                  </div>
                </div>

                <div className="p-4">
                  <div className="grid gap-2 text-xs text-muted-foreground sm:grid-cols-3">
                    <p>المشاهدات: {post.viewsCount}</p>
                    <p>التفاعل: {post.reactionsCount}</p>
                    <p>الطلبات: {post.applicationsCount}</p>
                  </div>

                  <div className="mt-4 grid grid-cols-3 gap-2">
                    <Button size="sm" variant="ghost" className="justify-center">
                      أعجبني
                    </Button>
                    <Button size="sm" variant="ghost" className="justify-center">
                      تعليق
                    </Button>
                    <Button size="sm" variant="ghost" className="justify-center">
                      مشاركة
                    </Button>
                  </div>

                  <div className="mt-3 flex flex-wrap gap-2">
                    <Button size="sm" variant="outline" asChild>
                      <Link href={`${postsRoutes.all}?action=edit&postId=${post.id}`}>
                        تعديل
                        <AppIcons.PencilLine className="size-4" />
                      </Link>
                    </Button>
                    <Button size="sm" variant="outline" asChild>
                      <Link href={postsRoutes.archived}>
                        أرشفة
                        <AppIcons.archive className="size-4" />
                      </Link>
                    </Button>
                    <Button size="sm" variant="outline" asChild>
                      <Link href={postsRoutes.draft}>
                        نقل إلى مسودة
                        <AppIcons.goal className="size-4" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </article>
            ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="flex flex-col flex-1 gap-6">
      <div>
        <h2 className="text-lg font-semibold text-foreground">
          {scopeLabels[scope]}
        </h2>
        <p className="mt-0.5 text-sm text-muted-foreground">
          عرض وتعديل البيانات الأساسية
        </p>
      </div>

      <div className="space-y-6 rounded-xl border border-border bg-card p-4 shadow-sm sm:p-6">
        <div className="flex flex-wrap items-center gap-2">
          {defaults.showVerifiedBadge && (
            <Badge variant="secondary">موثّق</Badge>
          )}
          {defaults.showOrgBadge && (
            <Badge variant="outline">مؤسسة موثقة</Badge>
          )}
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="profile-name">الاسم</Label>
            <Input
              id="profile-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="text-right"
              dir="rtl"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="profile-email">البريد الإلكتروني</Label>
            <Input
              id="profile-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="text-right"
              dir="rtl"
            />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="profile-phone">رقم الهاتف</Label>
            <Input
              id="profile-phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="text-right"
              dir="rtl"
            />
          </div>
        </div>
        {profileError ? (
          <p className="text-sm text-destructive">{profileError}</p>
        ) : null}

        <div className="flex justify-start">
          <Button
            type="button"
            disabled={
              updateProfileMutation.isPending ||
              !name.trim() ||
              !email.trim() ||
              !phone.trim()
            }
            onClick={() => updateProfileMutation.mutate()}
          >
            {updateProfileMutation.isPending ? "جاري الحفظ..." : "حفظ التغييرات"}
          </Button>
        </div>
      </div>
    </section>
  );
}
