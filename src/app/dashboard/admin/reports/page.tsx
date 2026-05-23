import { redirect } from "next/navigation";

import { routePaths } from "@/constant/routes";

export default function AdminReportsRootPage() {
  redirect(routePaths.adminScope.reportsNew);
}

