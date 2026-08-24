"use client";

import * as React from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import { postTypeLabels, type ReviewPostItem, type ReviewPostType } from "./posts-review.types";
import { useAdminPostDetail, useUpdateAdminPost } from "@/features/admin/posts/admin.posts.query";
import type { ReviewPostDetail } from "@/features/admin/posts/admin.posts.types";

function EditPostForm({
  detail,
  onSaved,
}: {
  detail: ReviewPostDetail;
  onSaved: () => void;
}) {
  const mutation = useUpdateAdminPost();
  const [title, setTitle] = React.useState(detail.title ?? "");
  const [summary, setSummary] = React.useState(detail.summary ?? "");
  const [content, setContent] = React.useState(detail.content ?? detail.body ?? "");
  const [type, setType] = React.useState<ReviewPostType>(detail.type);
  const [location, setLocation] = React.useState(detail.location ?? "");
  const [formError, setFormError] = React.useState<string | null>(null);

  const save = async () => {
    const cleanTitle = title.trim();
    const cleanContent = content.trim();
    if (!cleanTitle || !cleanContent) {
      setFormError("العنوان ومحتوى المنشور مطلوبان.");
      return;
    }
    setFormError(null);
    try {
      await mutation.mutateAsync({
        postId: detail.id,
        body: {
          title: cleanTitle,
          summary: summary.trim() || null,
          content: cleanContent,
          type,
          location: location.trim() || null,
        },
      });
      onSaved();
    } catch {
      // The shared API interceptor already shows the server validation/error toast.
    }
  };

  return (
    <div className="space-y-4 overflow-y-auto px-4 pb-4">
      <div className="space-y-2">
        <Label htmlFor="admin-post-title">العنوان</Label>
        <Input id="admin-post-title" value={title} onChange={(event) => setTitle(event.target.value)} maxLength={255} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="admin-post-summary">الملخص</Label>
        <Textarea id="admin-post-summary" value={summary} onChange={(event) => setSummary(event.target.value)} maxLength={255} rows={3} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="admin-post-content">المحتوى</Label>
        <Textarea id="admin-post-content" value={content} onChange={(event) => setContent(event.target.value)} rows={8} />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label>نوع المنشور</Label>
          <Select value={type} onValueChange={(value) => setType(value as ReviewPostType)} dir="rtl">
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {(Object.keys(postTypeLabels) as ReviewPostType[]).map((postType) => (
                <SelectItem key={postType} value={postType}>{postTypeLabels[postType]}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="admin-post-location">الموقع</Label>
          <Input id="admin-post-location" value={location} onChange={(event) => setLocation(event.target.value)} maxLength={255} />
        </div>
      </div>
      {formError ? <p className="text-xs text-destructive">{formError}</p> : null}
      <SheetFooter className="sm:justify-start">
        <Button type="button" onClick={() => void save()} disabled={mutation.isPending}>
          {mutation.isPending ? <Loader2 className="size-4 animate-spin" /> : null}
          حفظ التعديلات
        </Button>
      </SheetFooter>
    </div>
  );
}

export function EditPostDialog({
  open,
  onOpenChange,
  post,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  post: ReviewPostItem | null;
}) {
  const detailQuery = useAdminPostDetail(open && post ? post.id : null);
  const detail = detailQuery.data?.data;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" dir="rtl" className="w-[95vw] p-0 sm:max-w-2xl">
        <SheetHeader className="border-b border-border pe-12 text-right">
          <SheetTitle className="text-right">تعديل المنشور</SheetTitle>
        </SheetHeader>
        {detailQuery.isLoading ? (
          <div className="space-y-4 p-4">
            {Array.from({ length: 5 }).map((_, index) => <div key={index} className="h-12 animate-pulse rounded bg-muted" />)}
          </div>
        ) : detailQuery.isError || !detail ? (
          <p className="p-4 text-sm text-destructive">تعذر تحميل بيانات المنشور للتعديل.</p>
        ) : (
          <EditPostForm key={`${detail.id}-${detail.updatedAt ?? "loaded"}`} detail={detail} onSaved={() => onOpenChange(false)} />
        )}
      </SheetContent>
    </Sheet>
  );
}
