import { Badge } from "@/components/ui/badge";
import {
  dashboardRoleLabels,
  getPageTitle,
  getRoleFromPath,
} from "@/constant/routes";

type DashboardPageProps = {
  params: Promise<{ segments?: string[] }>;
};

export default async function DashboardFallbackPage({
  params,
}: DashboardPageProps) {
  const resolvedParams = await params;
  const routePath = resolvedParams.segments?.join("/") ?? "";
  const pathname = routePath ? `/dashboard/${routePath}` : "/dashboard";
  const role = getRoleFromPath(pathname);
  const title = getPageTitle(pathname);

  return (
    <section className="rounded-md border border-border p-6">
      <div className="space-y-3">
        <Badge className="w-fit bg-primary/20 text-primary">
          {dashboardRoleLabels[role]}
        </Badge>
        <h2 className="text-2xl font-bold text-foreground">{title}</h2>
      </div>
      <p className="mt-4 text-sm text-muted-foreground">
        هذه صفحة تجريبية لهيكل الداشبورد المخصص داخل مشروع جود.
      </p>
    </section>
  );
}
