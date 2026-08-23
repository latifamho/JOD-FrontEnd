"use client";

import { Loader2 } from "lucide-react";

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

type WorkflowAction = "publish" | "archive" | "restore";

type PostsTableProps = {
  rows: OrganizationPostItem[];
  onOpenDetails: (postId: string) => void;
  onWorkflowAction: (postId: string, action: WorkflowAction) => void;
  onDeletePost: (postId: string) => void;
  workflowPendingPostIds: string[];
  canPublish: boolean;
  canArchive: boolean;
  canRestore: boolean;
  canDelete: boolean;
};

function WorkflowActionButton({
  status,
  isPending,
  onClick,
}: {
  status: OrganizationPostItem["status"];
  isPending: boolean;
  onClick: () => void;
}) {
  const workflow = getWorkflowActionForStatus(status);

  const icon =
    workflow.key === "publish" ? (
      <AppIcons.verification className="size-4 text-success" />
    ) : workflow.key === "archive" ? (
      <AppIcons.archive className="size-4 text-warning" />
    ) : (
      <AppIcons.rotateCw className="size-4 text-info" />
    );

  return (
    <Button
      type="button"
      size="icon"
      variant="ghost"
      title={isPending ? "جاري تنفيذ الإجراء..." : workflow.label}
      disabled={isPending}
      onClick={onClick}
      className="shadow-sm"
    >
      {isPending ? <Loader2 className="size-4 animate-spin" /> : icon}
    </Button>
  );
}

export function PostsTable({
  rows,
  onOpenDetails,
  onWorkflowAction,
  onDeletePost,
  workflowPendingPostIds,
  canPublish,
  canArchive,
  canRestore,
  canDelete,
}: PostsTableProps) {
  return (
    <div className="flex flex-1 overflow-auto rounded-md border border-border shadow-xs">
      <Table className="min-w-320 bg-background">
        <TableHeader className="bg-muted/35">
          <TableRow>
            <TableHead>البوست</TableHead>
            <TableHead>النوع</TableHead>
            <TableHead>الحالة</TableHead>
            <TableHead>الارتباط</TableHead>
            <TableHead>الموقع</TableHead>
            <TableHead>المؤشرات</TableHead>
            <TableHead>التواريخ</TableHead>
            <TableHead className="w-48">الإجراءات</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {rows.length > 0 ? (
            rows.map((post) => {
              const normalizedStatus = normalizePostStatus(post.status);
              const workflowPending = workflowPendingPostIds.includes(post.id);

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
                    <Badge variant="outline">{organizationPostTypeLabels[post.type]}</Badge>
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

                      {(normalizedStatus === "draft"
                        ? canPublish
                        : normalizedStatus === "published"
                          ? canArchive
                          : canRestore) ? (
                        <WorkflowActionButton
                          status={normalizedStatus}
                          isPending={workflowPending}
                          onClick={() =>
                            onWorkflowAction(
                              post.id,
                              getWorkflowActionForStatus(normalizedStatus).key,
                            )
                          }
                        />
                      ) : null}

                      {canDelete ? (
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
                      ) : null}
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
