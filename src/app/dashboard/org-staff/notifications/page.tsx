import { redirect } from "next/navigation";

import { routePaths } from "@/constant/routes";

export default function OrgStaffNotificationsPage() {
  redirect(routePaths.organizationStaffScope.notificationsInbox);
}
