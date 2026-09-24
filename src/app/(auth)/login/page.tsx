import { redirect } from "next/navigation";

import { routePaths } from "@/constant/routes";

/** Legacy `/login` bookmarks and old landing links go to organization login. */
export default function LegacyLoginRedirectPage() {
  redirect(routePaths.auth.orgLogin);
}
