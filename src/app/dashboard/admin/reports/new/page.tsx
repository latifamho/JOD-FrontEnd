import { Suspense } from "react";

import { ReportsManagementPage } from "@/components/pages/reports-management";

export default function AdminReportsNewPage() {
  return (
    <Suspense fallback={null}>
      <ReportsManagementPage status="new" />
    </Suspense>
  );
}

