import type {
  AdminUserItem,
  UserStatus,
} from "@/components/pages/users-management/users-management.types";

export function createNextUserId(users: AdminUserItem[]): string {
  const maxId = users.reduce((currentMax, user) => {
    const numericPart = Number.parseInt(user.id.replace(/\D/g, ""), 10);
    if (Number.isNaN(numericPart)) {
      return currentMax;
    }
    return Math.max(currentMax, numericPart);
  }, 1000);

  return `USR-${maxId + 1}`;
}

export function getUserStatusBadgeClass(status: UserStatus): string {
  if (status === "active") {
    return "border-emerald-200/70 bg-emerald-100 text-emerald-800 dark:border-emerald-500/40 dark:bg-emerald-500/20 dark:text-emerald-100";
  }

  return "border-slate-200/70 bg-slate-100 text-slate-800 dark:border-slate-500/40 dark:bg-slate-500/20 dark:text-slate-100";
}
