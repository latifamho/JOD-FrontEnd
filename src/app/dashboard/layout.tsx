import type { ReactNode } from "react"

import { AppBreadcrumb, Header, SectionTabs, SideBar } from "@/components/base"

export default function DashboardLayout({
  children,
}: {
  children: ReactNode
}) {
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <SideBar />
      <div className="flex min-w-0 flex-1 flex-col">
        <Header />
        <AppBreadcrumb />
        <SectionTabs />
        <main className="flex-1 flex overflow-y-auto p-4 bg-card sm:p-6">{children}</main>
      </div>
    </div>
  )
}
