"use client";

import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TableRowActions } from "@/components/shared";
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
import type { OrgCategoryBriefItem } from "@/features/org/categories/org.categories.types";

type WorkflowAction = "publish" | "archive" | "restore";

type PostsTableProps = {
  rows: OrganizationPostItem[];
  categories: OrgCategoryBriefItem[];
  onOpenDetails: (postId: string) => void;
  onWorkflowAction: (postId: string, action: WorkflowAction) => void;
  onDeletePost: (postId: string) => void;
  workflowPendingPostIds: string[];
  canPublish: boolean;
  canArchive: boolean;
  canRestore: boolean;
  canDelete: boolean;
};

function getWorkflowIcon(key: WorkflowAction) {
  if (key === "publish") {
    return <AppIcons.verification className="size-4 text-success" />;
  }
  if (key === "archive") {
    return <AppIcons.archive className="size-4 text-warning" />;
  }
  return <AppIcons.rotateCw className="size-4 text-info" />;
}

export function PostsTable({
  rows,
  categories,
  onOpenDetails,
  onWorkflowAction,
  onDeletePost,
  workflowPendingPostIds,
  canPublish,
  canArchive,
  canRestore,
  canDelete,
}: PostsTableProps) {
  const categoryNames = new Map(categories.map((category) => [category.id, category.name]));
  return (
    <div className="flex flex-1 overflow-auto rounded-md border border-border shadow-xs">
      <Table className="min-w-320 bg-background">
        <TableHeader className="bg-muted/35">
          <TableRow>
            <TableHead>البوست</TableHead>
            <TableHead>النوع</TableHead>
            <TableHead>التصنيف</TableHead>
            <TableHead>الحالة</TableHead>
            <TableHead>الارتباط</TableHead>
            <TableHead>الموقع</TableHead>
            <TableHead>المؤشرات</TableHead>
            <TableHead>التواريخ</TableHead>
            <TableHead className="w-14">الإجراءات</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {rows.length > 0 ? (
            rows.map((post) => {
              const normalizedStatus = normalizePostStatus(post.status);
              const workflowPending = workflowPendingPostIds.includes(post.id);
              const workflow = getWorkflowActionForStatus(normalizedStatus);
              const canRunWorkflow =
                normalizedStatus === "draft"
                  ? canPublish
                  : normalizedStatus === "published"
                    ? canArchive
                    : canRestore;

              return (
                <TableRow key={post.id}>
                  <TableCell>
                    <p className="font-semibold text-foreground">{post.title}</p>
                    <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
                      {post.summary}
                    </p>

                  </TableCell>

                  <TableCell>
                    <Badge variant="outline">{organizationPostTypeLabels[post.type]}</Badge>
                  </TableCell>

                  <TableCell>
                    <Badge variant="outline">{displayOrDash(categoryNames.get(post.categoryId ?? ""))}</Badge>
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
                    <p className="text-xs text-foreground">{displayOrDash(post.location)}</p>
                  </TableCell>

                  <TableCell>
                    <p className="text-xs text-muted-foreground">
                      المشاهدات:{" "}
                      <span className="font-semibold text-foreground">{post.viewsCount}</span>
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      التفاعلات:{" "}
                      <span className="font-semibold text-foreground">{post.reactionsCount}</span>
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      المتقدمون:{" "}
                      <span className="font-semibold text-foreground">{post.applicationsCount}</span>
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
                    <TableRowActions
                      loading={workflowPending}
                      actions={[
                        {
                          id: "details",
                          label: "عرض التفاصيل",
                          icon: <AppIcons.eye className="size-4 text-info" />,
                          onSelect: () => onOpenDetails(post.id),
                        },
                        {
                          id: "workflow",
                          label: workflowPending
                            ? "جاري تنفيذ الإجراء..."
                            : workflow.label,
                          icon: getWorkflowIcon(workflow.key),
                          onSelect: () =>
                            onWorkflowAction(post.id, workflow.key),
                          hidden: !canRunWorkflow,
                        },
                        {
                          id: "delete",
                          label: "حذف البوست",
                          icon: (
                            <AppIcons.Trash className="size-4 text-destructive" />
                          ),
                          onSelect: () => onDeletePost(post.id),
                          destructive: true,
                          separatorBefore: true,
                          hidden: !canDelete,
                        },
                      ]}
                    />
                  </TableCell>
                </TableRow>
              );
            })
          ) : (
            <TableRow>
              <TableCell
                colSpan={9}
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
