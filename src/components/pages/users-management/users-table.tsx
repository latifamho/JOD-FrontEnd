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
import { formatUtcDateTime } from "@/lib/date";
import {
  userStatusLabels,
  type AdminUserItem,
} from "@/components/pages/users-management/static-data";
import { getUserStatusBadgeClass } from "@/components/pages/users-management/helpers";
import { AppIcons } from "@/constant/icons";

type UsersTableProps = {
  rows: AdminUserItem[];
  onEditUser: (userId: string) => void;
  onToggleUserStatus: (userId: string) => void;
  onChangeUserPassword: (userId: string) => void;
  onDeleteUser: (userId: string) => void;
};

export function UsersTable({
  rows,
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
          {rows.length > 0 ? (
            rows.map((user) => (
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
                      onClick={() => onEditUser(user.id)}
                      className="shadow-sm"
                    >
                      <AppIcons.UserRoundPen className="size-4 text-info" />
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
                      onClick={() => onDeleteUser(user.id)}
                      className="shadow-sm"
                    >
                      <AppIcons.Trash className="size-4 text-destructive" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
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
