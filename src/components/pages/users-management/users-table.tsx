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
import { formatUtcDateTime } from "@/lib/date";
import { displayOrDash } from "@/lib/text";
import {
  getUserType,
  userRoleLabels,
  userStatusLabels,
  type AdminUserItem,
} from "@/components/pages/users-management/users-management.types";
import { getUserStatusBadgeClass } from "@/components/pages/users-management/helpers";
import { AppIcons } from "@/constant/icons";
import { routePaths } from "@/constant/routes";

const SKELETON_ROW_COUNT = 5;

type UsersTableProps = {
  rows: AdminUserItem[];
  isLoading: boolean;
  loadingRowIds: Set<string>;
  currentUserId: string | null;
  onEditUser: (userId: string) => void;
  onToggleUserStatus: (userId: string) => void;
  onChangeUserPassword: (userId: string) => void;
  onDeleteUser: (userId: string) => void;
};

function SkeletonPulse({ className }: { className: string }) {
  return <div className={`animate-pulse rounded bg-muted ${className}`} />;
}

export function UsersTable({
  rows,
  isLoading,
  loadingRowIds,
  currentUserId,
  onEditUser,
  onToggleUserStatus,
  onChangeUserPassword,
  onDeleteUser,
}: UsersTableProps) {
  return (
    <div className="overflow-auto flex flex-1 rounded-md border border-border shadow-xs">
      <Table className="min-w-255 bg-background">
        <TableHeader className="bg-muted/35">
          <TableRow>
            <TableHead className="w-12">#</TableHead>
            <TableHead>المستخدم</TableHead>
            <TableHead>النوع</TableHead>
            <TableHead>الحالة</TableHead>
            <TableHead>بيانات التواصل</TableHead>
            <TableHead>النشاط</TableHead>
            <TableHead>التواريخ</TableHead>
            <TableHead className="w-14">الإجراءات</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {isLoading ? (
            Array.from({ length: SKELETON_ROW_COUNT }).map((_, i) => (
              <TableRow key={i}>
                <TableCell>
                  <SkeletonPulse className="h-3 w-6" />
                </TableCell>
                <TableCell>
                  <SkeletonPulse className="h-3.5 w-28" />
                </TableCell>
                <TableCell>
                  <SkeletonPulse className="h-5 w-16 rounded-full" />
                </TableCell>
                <TableCell>
                  <SkeletonPulse className="h-5 w-16 rounded-full" />
                </TableCell>
                <TableCell>
                  <SkeletonPulse className="h-3 w-36 mb-1.5" />
                  <SkeletonPulse className="h-3 w-24" />
                </TableCell>
                <TableCell>
                  <SkeletonPulse className="h-3 w-20 mb-1.5" />
                  <SkeletonPulse className="h-3 w-20" />
                </TableCell>
                <TableCell>
                  <SkeletonPulse className="h-3 w-32 mb-1.5" />
                  <SkeletonPulse className="h-3 w-32" />
                </TableCell>
                <TableCell>
                  <SkeletonPulse className="h-8 w-8 rounded-md" />
                </TableCell>
              </TableRow>
            ))
          ) : rows.length > 0 ? (
            rows.map((user, index) => {
              const isToggleLoading = loadingRowIds.has(user.id);
              return (
                <TableRow key={user.id}>
                  <TableCell className="text-sm text-muted-foreground">
                    {index + 1}
                  </TableCell>

                  <TableCell>
                    <p className="font-semibold text-foreground">
                      {displayOrDash(user.name)}
                    </p>
                  </TableCell>

                  <TableCell>
                    <Badge variant="outline">
                      {userRoleLabels[getUserType(user)]}
                    </Badge>
                  </TableCell>

                  <TableCell>
                    <Badge
                      variant="outline"
                      className={getUserStatusBadgeClass(user.status)}
                    >
                      {userStatusLabels[user.status]}
                    </Badge>
                  </TableCell>

                  <TableCell>
                    <p className="text-xs text-foreground">
                      {displayOrDash(user.email)}
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {displayOrDash(user.phone)}
                    </p>
                  </TableCell>

                  <TableCell>
                    <p className="text-xs text-muted-foreground">
                      المنشورات:{" "}
                      <span className="font-semibold text-foreground">
                        {user.postsCount}
                      </span>
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      البلاغات عليه:{" "}
                      <span className="font-semibold text-foreground">
                        {user.reportsCount}
                      </span>
                    </p>
                  </TableCell>

                  <TableCell>
                    <p className="text-xs text-muted-foreground">
                      الانضمام: {formatUtcDateTime(user.createdAt)}
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      آخر نشاط: {formatUtcDateTime(user.lastActiveAt)}
                    </p>
                  </TableCell>

                  <TableCell>
                    <TableRowActions
                      loading={isToggleLoading}
                      actions={[
                        {
                          id: "view",
                          label: "عرض التفاصيل",
                          icon: <AppIcons.eye className="size-4 text-info" />,
                          href: routePaths.adminScope.userDetails(user.id),
                        },
                        {
                          id: "edit",
                          label: "تعديل المستخدم",
                          icon: (
                            <AppIcons.UserRoundPen className="size-4 text-info" />
                          ),
                          onSelect: () => onEditUser(user.id),
                        },
                        {
                          id: "toggle-status",
                          label:
                            user.status === "active"
                              ? "تعطيل المستخدم"
                              : "تفعيل المستخدم",
                          icon: (
                            <AppIcons.UserRoundX className="size-4 text-warning" />
                          ),
                          onSelect: () => onToggleUserStatus(user.id),
                        },
                        {
                          id: "change-password",
                          label: "تغيير كلمة المرور",
                          icon: (
                            <AppIcons.UserLock className="size-4 text-success" />
                          ),
                          onSelect: () => onChangeUserPassword(user.id),
                        },
                        {
                          id: "delete",
                          label: "حذف المستخدم",
                          icon: (
                            <AppIcons.Trash className="size-4 text-destructive" />
                          ),
                          onSelect: () => onDeleteUser(user.id),
                          destructive: true,
                          separatorBefore: true,
                          hidden: user.id === currentUserId,
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
                colSpan={8}
                className="py-10 text-center text-sm text-muted-foreground"
              >
                لا توجد بيانات مستخدمين للعرض.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
