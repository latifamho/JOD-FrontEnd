import type { ReactNode } from "react"

import { DashboardGuard } from "@/components/auth/dashboard-guard"
import { AppBreadcrumb, Header, SectionTabs, SideBar } from "@/components/base"

export default function DashboardLayout({
  children,
}: {
  children: ReactNode
}) {
  return (
    <DashboardGuard>
      <div className="flex h-screen overflow-hidden bg-background">
        <SideBar />
        <div className="flex min-w-0 flex-1 flex-col">
          <Header />
          <AppBreadcrumb />
          <SectionTabs />
          <main className="flex flex-1 overflow-y-auto bg-card p-4 sm:p-6">{children}</main>
        </div>
      </div>
    </DashboardGuard>
  )
}