"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { routePaths } from "@/constant/routes";
import { useCreateArticle } from "@/features/admin/articles/admin.articles.query";
import { useAuth } from "@/providers/AuthProvider";

const contentCreateSchema = z.object({
  title: z.string().trim().min(1, "العنوان مطلوب"),
  description: z.string().trim().min(1, "الوصف مطلوب"),
});

type ContentCreateFormValues = z.infer<typeof contentCreateSchema>;

export function ContentCreatePage() {
  const router = useRouter();
  const { user } = useAuth();
  const createMutation = useCreateArticle();
  const { register, handleSubmit, formState: { errors } } = useForm<ContentCreateFormValues>({
    resolver: zodResolver(contentCreateSchema),
    defaultValues: { title: "", description: "" },
  });

  return (
    <section className="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-4">
      <div>
        <h2 className="text-base font-semibold text-foreground">إضافة مقال جديد</h2>
        <p className="mt-1 text-xs text-muted-foreground">أضف عنوان المقال ووصفه. حقل الصور محفوظ في الواجهة لحين دعم المقالات في Media API.</p>
      </div>
      <form
        noValidate
        className="space-y-5 rounded-xl border border-border bg-card p-4 shadow-sm sm:p-6"
        onSubmit={handleSubmit(({ title, description }) => {
          createMutation.mutate({
            title: title.trim(),
            excerpt: description.trim(),
            content: description.trim(),
            authorName: user?.name?.trim() || "مدير النظام",
            status: "draft",
          }, { onSuccess: () => router.push(routePaths.adminScope.content) });
        })}
      >
        <div className="space-y-2">
          <Label htmlFor="article-title">العنوان</Label>
          <Input id="article-title" disabled={createMutation.isPending} aria-invalid={Boolean(errors.title)} placeholder="اكتب عنوان المقال" {...register("title")} />
          {errors.title ? <p className="text-xs text-destructive">{errors.title.message}</p> : null}
        </div>
        <div className="space-y-2">
          <Label htmlFor="article-description">الوصف</Label>
          <Textarea id="article-description" disabled={createMutation.isPending} aria-invalid={Boolean(errors.description)} rows={8} placeholder="اكتب وصف المقال" {...register("description")} />
          {errors.description ? <p className="text-xs text-destructive">{errors.description.message}</p> : null}
        </div>
        <div className="space-y-2">
          <Label htmlFor="article-images">الصور</Label>
          <Input id="article-images" type="file" accept="image/*" multiple disabled />
          <p className="rounded-md border border-border bg-muted/40 px-3 py-2 text-xs leading-5 text-muted-foreground">
            رفع صور المقالات غير متاح حالياً لأن Media API يدعم المنظمة والحملة والبوست فقط. لن نرسل الصور إلى endpoint غير معرّف.
          </p>
        </div>
        <div className="flex flex-wrap justify-end gap-2 border-t border-border pt-4">
          <Button type="button" variant="outline" disabled={createMutation.isPending} onClick={() => router.push(routePaths.adminScope.content)}>إلغاء</Button>
          <Button type="submit" disabled={createMutation.isPending}>{createMutation.isPending ? <Loader2 className="size-4 animate-spin" /> : null}إضافة المقال</Button>
        </div>
      </form>
    </section>
  );
}
