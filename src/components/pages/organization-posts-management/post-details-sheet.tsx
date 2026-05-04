"use client";

import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { formatUtcDateTime } from "@/lib/date";
import {
  getPostStatusBadgeClass,
  isCampaignRelatedPostType,
  normalizePostStatus,
} from "@/components/pages/organization-posts-management/helpers";
import {
  organizationPostStatusLabels,
  organizationPostTypeLabels,
  type OrganizationPostItem,
} from "@/components/pages/organization-posts-management/static-data";

type PostDetailsSheetProps = {
  open: boolean;
  post: OrganizationPostItem | null;
  onOpenChange: (open: boolean) => void;
};

export function PostDetailsSheet({
  open,
  post,
  onOpenChange,
}: PostDetailsSheetProps) {
  if (!post) {
    return null;
  }

  const campaignRelated = isCampaignRelatedPostType(post.type);
  const normalizedStatus = normalizePostStatus(post.status);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        dir="rtl"
        className="w-[95vw] border-border p-0 sm:max-w-2xl"
      >
        <SheetHeader className="border-b border-border pe-12 text-right">
          <SheetTitle className="text-right text-xl">{post.title}</SheetTitle>
        </SheetHeader>

        <div className="space-y-4 overflow-y-auto p-4">
          <div className="flex flex-wrap items-center gap-2">
            <Badge
              variant="outline"
              className={getPostStatusBadgeClass(normalizedStatus)}
            >
              {organizationPostStatusLabels[normalizedStatus]}
            </Badge>
            <Badge variant="outline">{organizationPostTypeLabels[post.type]}</Badge>
            <Badge variant="outline">{post.id}</Badge>
          </div>

          <div className="grid gap-3 rounded-lg border border-border bg-muted/40 p-4 sm:grid-cols-2">
            <div>
              <p className="text-xs text-muted-foreground">الكاتب</p>
              <p className="text-sm font-medium">{post.authorName}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">الموقع</p>
              <p className="text-sm font-medium">{post.location}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">تاريخ الإنشاء</p>
              <p className="text-sm font-medium">{formatUtcDateTime(post.createdAt)}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">آخر تحديث</p>
              <p className="text-sm font-medium">{formatUtcDateTime(post.updatedAt)}</p>
            </div>
            {post.publishedAt && (
              <div>
                <p className="text-xs text-muted-foreground">تاريخ النشر</p>
                <p className="text-sm font-medium">{formatUtcDateTime(post.publishedAt)}</p>
              </div>
            )}
            {campaignRelated && (
              <div>
                <p className="text-xs text-muted-foreground">الحملة المرتبطة</p>
                <p className="text-sm font-medium">{post.campaignTitle ?? "—"}</p>
              </div>
            )}
          </div>

          <div className="grid gap-3 rounded-lg border border-border bg-muted/40 p-4 sm:grid-cols-3">
            <div>
              <p className="text-xs text-muted-foreground">المشاهدات</p>
              <p className="text-base font-semibold">{post.viewsCount}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">التفاعلات</p>
              <p className="text-base font-semibold">{post.reactionsCount}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">المتقدمون</p>
              <p className="text-base font-semibold">{post.applicationsCount}</p>
            </div>
          </div>

          <div className="rounded-lg border border-border p-4">
            <p className="mb-2 text-xs text-muted-foreground">محتوى البوست</p>
            <p className="text-sm leading-7 text-foreground">{post.summary}</p>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
