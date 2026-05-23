import { Suspense } from "react";

import { ReportsManagementPage } from "@/components/pages/reports-management";

export default function AdminReportsInProgressPage() {
  return (
    <Suspense fallback={null}>
      <ReportsManagementPage status="in_progress" />
    </Suspense>
  );
}

