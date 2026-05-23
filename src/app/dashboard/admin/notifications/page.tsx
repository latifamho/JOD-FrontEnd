import { redirect } from "next/navigation";

import { routePaths } from "@/constant/routes";

export default function AdminNotificationsRootPage() {
  redirect(routePaths.adminScope.notificationsInbox);
}
