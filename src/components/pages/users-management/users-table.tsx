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
import { formatUtcDateTime } from "@/lib/date";
import {
  userStatusLabels,
  type AdminUserItem,
} from "@/components/pages/users-management/static-data";
import { getUserStatusBadgeClass } from "@/components/pages/users-management/helpers";
import { AppIcons } from "@/constant/icons";

const SKELETON_ROW_COUNT = 5;

type UsersTableProps = {
  rows: AdminUserItem[];
  isLoading: boolean;
  loadingRowIds: Set<string>;
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
            <TableHead>المستخدم</TableHead>
            <TableHead>الحالة</TableHead>
            <TableHead>بيانات التواصل</TableHead>
            <TableHead>النشاط</TableHead>
            <TableHead>التواريخ</TableHead>
            <TableHead className="w-48">الإجراءات</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {isLoading ? (
            Array.from({ length: SKELETON_ROW_COUNT }).map((_, i) => (
              <TableRow key={i}>
                <TableCell>
                  <SkeletonPulse className="h-3.5 w-28 mb-1.5" />
                  <SkeletonPulse className="h-3 w-16" />
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
                  <div className="flex items-center gap-2">
                    {Array.from({ length: 4 }).map((_, j) => (
                      <SkeletonPulse key={j} className="h-8 w-8 rounded-md" />
                    ))}
                  </div>
                </TableCell>
              </TableRow>
            ))
          ) : rows.length > 0 ? (
            rows.map((user) => {
              const isRowLoading = loadingRowIds.has(user.id);
              return (
                <TableRow key={user.id}>
                  <TableCell>
                    <p className="font-semibold text-foreground">{user.name}</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {user.id}
                    </p>
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
                    <p className="text-xs text-foreground">{user.email}</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {user.phone}
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
                    <div className="flex items-center justify-start gap-2">
                      <Button
                        type="button"
                        size="icon"
                        variant="ghost"
                        title="تعديل المستخدم"
                        disabled={isRowLoading}
                        onClick={() => onEditUser(user.id)}
                        className="shadow-sm"
                      >
                        {isRowLoading ? (
                          <Loader2 className="size-4 animate-spin text-muted-foreground" />
                        ) : (
                          <AppIcons.UserRoundPen className="size-4 text-info" />
                        )}
                      </Button>
                      <Button
                        type="button"
                        size="icon"
                        variant="ghost"
                        title={
                          user.status === "active"
                            ? "تعطيل المستخدم"
                            : "تفعيل المستخدم"
                        }
                        disabled={isRowLoading}
                        onClick={() => onToggleUserStatus(user.id)}
                        className="shadow-sm"
                      >
                        <AppIcons.UserRoundX className="size-4 text-warning" />
                      </Button>
                      <Button
                        type="button"
                        size="icon"
                        variant="ghost"
                        title="تغيير كلمة المرور"
                        disabled={isRowLoading}
                        onClick={() => onChangeUserPassword(user.id)}
                        className="shadow-sm"
                      >
                        <AppIcons.UserLock className="size-4 text-success" />
                      </Button>
                      <Button
                        type="button"
                        size="icon"
                        variant="ghost"
                        title="حذف المستخدم"
                        disabled={isRowLoading}
                        onClick={() => onDeleteUser(user.id)}
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
                colSpan={6}
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
