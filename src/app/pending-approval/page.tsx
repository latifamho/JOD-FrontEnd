import type { Metadata } from "next";

import { OrganizationPendingApprovalPage } from "@/components/pages/organization-pending-approval";

export const metadata: Metadata = {
  title: "طلب المنظمة قيد المراجعة | منصة جود",
  description: "متابعة حالة طلب تسجيل المنظمة على منصة جود",
};

export default function PendingApprovalPage() {
  return <OrganizationPendingApprovalPage />;
}
