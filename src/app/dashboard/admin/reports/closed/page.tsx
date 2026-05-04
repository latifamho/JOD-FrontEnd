import { Suspense } from "react";

import { ReportsManagementPage } from "@/components/pages/reports-management";

export default function AdminReportsClosedPage() {
  return (
    <Suspense fallback={null}>
      <ReportsManagementPage status="closed" />
    </Suspense>
  );
}

