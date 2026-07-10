"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { AppIcons } from "@/constant/icons";
import { formatUtcDateTime, formatUtcDateTimeOrDash } from "@/lib/date";
import { displayOrDash } from "@/lib/text";
import {
  getPostStatusBadgeClass,
  getWorkflowActionForStatus,
  isCampaignRelatedPostType,
  normalizePostStatus,
} from "@/components/pages/organization-posts-management/helpers";
import {
  organizationPostStatusLabels,
  organizationPostTypeLabels,
  type OrganizationPostItem,
} from "@/components/pages/organization-posts-management/static-data";

type WorkflowAction =
  | "publish"
  | "archive"
  | "restore";

type PostsTableProps = {
  rows: OrganizationPostItem[];
  onOpenDetails: (postId: string) => void;
  onEditPost: (postId: string) => void;
  onWorkflowAction: (postId: string, action: WorkflowAction) => void;
  onDeletePost: (postId: string) => void;
};

function WorkflowActionButton({
  status,
  onClick,
}: {
  status: OrganizationPostItem["status"];
  onClick: () => void;
}) {
  const workflow = getWorkflowActionForStatus(status);

  if (workflow.key === "publish") {
    return (
      <Button
        type="button"
        size="icon"
        variant="ghost"
        title={workflow.label}
        onClick={onClick}
        className="shadow-sm"
      >
        <AppIcons.verification className="size-4 text-success" />
      </Button>
    );
  }

  if (workflow.key === "archive") {
    return (
      <Button
        type="button"
        size="icon"
        variant="ghost"
        title={workflow.label}
        onClick={onClick}
        className="shadow-sm"
      >
        <AppIcons.archive className="size-4 text-warning" />
      </Button>
    );
  }

  return (
    <Button
      type="button"
      size="icon"
      variant="ghost"
      title={workflow.label}
      onClick={onClick}
      className="shadow-sm"
    >
      <AppIcons.rotateCw className="size-4 text-info" />
    </Button>
  );
}

export function PostsTable({
  rows,
  onOpenDetails,
  onEditPost,
  onWorkflowAction,
  onDeletePost,
}: PostsTableProps) {
  return (
    <div className="overflow-auto flex flex-1 rounded-md border border-border shadow-xs">
      <Table className="min-w-320 bg-background">
        <TableHeader className="bg-muted/35">
          <TableRow>
            <TableHead>البوست</TableHead>
            <TableHead>النوع</TableHead>
            <TableHead>الحالة</TableHead>
            <TableHead>الارتباط</TableHead>
            <TableHead>الكاتب والموقع</TableHead>
            <TableHead>المؤشرات</TableHead>
            <TableHead>التواريخ</TableHead>
            <TableHead className="w-48">الإجراءات</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {rows.length > 0 ? (
            rows.map((post) => {
              const normalizedStatus = normalizePostStatus(post.status);

              return (
                <TableRow key={post.id}>
                <TableCell>
                  <p className="font-semibold text-foreground">{post.title}</p>
                  <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
                    {post.summary}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">{post.id}</p>
                </TableCell>

                <TableCell>
                  <Badge variant="outline">
                    {organizationPostTypeLabels[post.type]}
                  </Badge>
                </TableCell>

                <TableCell>
                  <Badge
                    variant="outline"
                    className={getPostStatusBadgeClass(normalizedStatus)}
                  >
                    {organizationPostStatusLabels[normalizedStatus]}
                  </Badge>
                </TableCell>

                <TableCell>
                  {isCampaignRelatedPostType(post.type) ? (
                    <p className="text-xs text-foreground">
                      {displayOrDash(post.campaignTitle)}
                    </p>
                  ) : (
                    <p className="text-xs text-muted-foreground">مستقل</p>
                  )}
                </TableCell>

                <TableCell>
                  <p className="text-xs text-foreground">
                    {displayOrDash(post.authorName)}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {displayOrDash(post.location)}
                  </p>
                </TableCell>

                <TableCell>
                  <p className="text-xs text-muted-foreground">
                    المشاهدات:{" "}
                    <span className="font-semibold text-foreground">
                      {post.viewsCount}
                    </span>
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    التفاعلات:{" "}
                    <span className="font-semibold text-foreground">
                      {post.reactionsCount}
                    </span>
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    المتقدمون:{" "}
                    <span className="font-semibold text-foreground">
                      {post.applicationsCount}
                    </span>
                  </p>
                </TableCell>

                <TableCell>
                  <p className="text-xs text-muted-foreground">
                    الإنشاء: {formatUtcDateTime(post.createdAt)}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    التحديث: {formatUtcDateTime(post.updatedAt)}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    النشر: {formatUtcDateTimeOrDash(post.publishedAt)}
                  </p>
                </TableCell>

                <TableCell>
                  <div className="flex items-center justify-start gap-1">
                    <Button
                      type="button"
                      size="icon"
                      variant="ghost"
                      title="عرض التفاصيل"
                      onClick={() => onOpenDetails(post.id)}
                      className="shadow-sm"
                    >
                      <AppIcons.eye className="size-4 text-info" />
                    </Button>
                    <Button
                      type="button"
                      size="icon"
                      variant="ghost"
                      title="تعديل البوست"
                      onClick={() => onEditPost(post.id)}
                      className="shadow-sm"
                    >
                      <AppIcons.PencilLine className="size-4 text-info" />
                    </Button>
                    <WorkflowActionButton
                      status={normalizedStatus}
                      onClick={() =>
                        onWorkflowAction(
                          post.id,
                          getWorkflowActionForStatus(normalizedStatus).key,
                        )
                      }
                    />
                    <Button
                      type="button"
                      size="icon"
                      variant="ghost"
                      title="حذف البوست"
                      onClick={() => onDeletePost(post.id)}
                      className="shadow-sm"
                    >
                      <AppIcons.Trash className="size-4 text-destructive" />
                    </Button>
                  </div>
                </TableCell>
                </TableRow>
              );
            })
          ) : (
            <TableRow>
              <TableCell
                colSpan={8}
                className="py-10 text-center text-sm text-muted-foreground"
              >
                لا توجد بوستات مطابقة لخيارات العرض الحالية.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
