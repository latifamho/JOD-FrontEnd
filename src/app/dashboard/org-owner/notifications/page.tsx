import { redirect } from "next/navigation";

import { routePaths } from "@/constant/routes";

export default function OrgOwnerNotificationsPage() {
  redirect(routePaths.organizationOwnerScope.notificationsInbox);
}
