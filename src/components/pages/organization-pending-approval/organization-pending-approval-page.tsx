"use client";

import Image from "next/image";
import { CheckCircle2, Clock3, FileSearch, LogOut, RefreshCw, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import * as React from "react";

import waitInviteImage from "@/assets/images/wait-invite.jpg";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { authServices } from "@/features/shared/auth.services/auth.service";
import { useLogout } from "@/features/shared/auth.services/auth.query";
import { getAuthenticatedLanding, isOrganizationApprovalPending, PENDING_APPROVAL_ROUTE } from "@/features/shared/auth.services/auth.utils";
import { useAuth } from "@/providers/AuthProvider";

const reviewSteps = [
  { icon: CheckCircle2, title: "تم استلام الطلب", description: "وصلت بيانات المنظمة وحساب المالك إلى منصة جود بنجاح.", done: true },
  { icon: FileSearch, title: "مراجعة البيانات", description: "يقوم فريقنا الآن بمطابقة البيانات الرسمية والتحقق منها.", done: false },
  { icon: Sparkles, title: "تفعيل مساحة العمل", description: "بعد الموافقة ستصبح أدوات إدارة المنظمة متاحة تلقائياً.", done: false },
];

export function OrganizationPendingApprovalPage() {
  const router = useRouter();
  const { dashboardContext, isAuthenticated, isLoading, setDashboardContext } = useAuth();
  const logoutMutation = useLogout();
  const [isChecking, setIsChecking] = React.useState(false);
  const [checkMessage, setCheckMessage] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (isLoading) return;
    if (!isAuthenticated || !dashboardContext) {
      router.replace("/login");
      return;
    }
    if (!isOrganizationApprovalPending(dashboardContext)) {
      const landing = getAuthenticatedLanding(dashboardContext);
      if (landing !== PENDING_APPROVAL_ROUTE) router.replace(landing);
    }
  }, [dashboardContext, isAuthenticated, isLoading, router]);

  async function checkStatus() {
    setIsChecking(true);
    setCheckMessage(null);
    try {
      const response = await authServices.getDashboardContext();
      const context = response.data;
      setDashboardContext(context);
      const landing = getAuthenticatedLanding(context);
      if (landing !== PENDING_APPROVAL_ROUTE) {
        router.replace(landing);
        return;
      }
      setCheckMessage("ما زال الطلب قيد المراجعة. سنبقيك على اطلاع فور تحديث الحالة.");
    } catch {
      setCheckMessage("تعذر تحديث الحالة الآن. جرّب مرة أخرى بعد قليل.");
    } finally {
      setIsChecking(false);
    }
  }

  if (isLoading || !isAuthenticated || !dashboardContext || !isOrganizationApprovalPending(dashboardContext)) {
    return <main className="flex min-h-screen items-center justify-center bg-background" dir="rtl"><div className="space-y-3 text-center" role="status" aria-live="polite"><div className="mx-auto size-12 animate-pulse rounded-full bg-primary/15" /><p className="text-sm text-muted-foreground">جارٍ التحقق من حالة الطلب...</p></div></main>;
  }

  const organization = dashboardContext.organization;
  const ownerName = dashboardContext.profile.name;

  return (
    <main dir="rtl" className="relative min-h-screen overflow-hidden bg-background px-4 py-6 sm:px-6 lg:px-8">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(74,151,130,0.16),transparent_38%),radial-gradient(circle_at_bottom_left,rgba(74,151,130,0.10),transparent_42%)]" />
      <div className="relative mx-auto grid min-h-[calc(100vh-3rem)] max-w-6xl overflow-hidden rounded-[2rem] border border-border/70 bg-card shadow-2xl lg:grid-cols-[1.05fr_0.95fr]">
        <section className="flex flex-col justify-center p-6 text-right sm:p-10 lg:p-14">
          <div className="max-w-2xl">
            <Badge className="gap-2 rounded-full px-4 py-2" variant="secondary"><Clock3 className="size-4" />طلب الانضمام قيد المراجعة</Badge>
            <p className="mt-6 text-sm font-medium text-primary">أهلاً {ownerName || "بك"} في جود</p>
            <h1 className="mt-2 text-3xl font-semibold leading-tight text-foreground sm:text-4xl">طلب منظمتك وصل بأمان، والباقي علينا</h1>
            <p className="mt-4 text-sm leading-8 text-muted-foreground sm:text-base">نراجع الآن بيانات {organization?.name ? `منظمة ${organization.name}` : "منظمتك"} بعناية. خلال هذه الفترة ستبقى مساحة العمل محمية، وعند اعتماد الطلب ستتمكن من الدخول إلى لوحة المنظمة مباشرة بنفس الحساب.</p>
            <div className="mt-8 space-y-3">
              {reviewSteps.map((step, index) => {
                const Icon = step.icon;
                return <div key={step.title} className="flex flex-row-reverse gap-4 rounded-2xl border border-border/70 bg-background/70 p-4"><div className={`flex size-11 shrink-0 items-center justify-center rounded-2xl ${step.done ? "bg-emerald-500/12 text-emerald-600" : index === 1 ? "bg-primary/12 text-primary" : "bg-muted text-muted-foreground"}`}><Icon className="size-5" /></div><div className="flex-1 text-right"><p className="text-sm font-semibold text-foreground">{step.title}</p><p className="mt-1 text-xs leading-6 text-muted-foreground">{step.description}</p></div></div>;
              })}
            </div>
            {checkMessage ? <p className="mt-5 rounded-xl border border-border bg-muted/50 px-4 py-3 text-xs leading-6 text-muted-foreground">{checkMessage}</p> : null}
            <div className="mt-7 flex flex-wrap gap-3"><Button type="button" disabled={isChecking} onClick={checkStatus}><RefreshCw className={`size-4 ${isChecking ? "animate-spin" : ""}`} />{isChecking ? "جارٍ تحديث الحالة..." : "تحديث حالة الطلب"}</Button><Button type="button" variant="outline" disabled={logoutMutation.isPending} onClick={() => logoutMutation.mutate()}><LogOut className="size-4" />تسجيل الخروج</Button></div>
          </div>
        </section>
        <aside className="relative min-h-80 overflow-hidden bg-muted lg:min-h-full"><Image src={waitInviteImage} alt="طلب تسجيل المنظمة قيد المراجعة" fill priority className="object-cover" /><div className="absolute inset-0 bg-gradient-to-t from-slate-950/65 via-slate-900/10 to-transparent" /><div className="absolute inset-x-0 bottom-0 p-7 text-right text-white sm:p-10"><p className="text-xs font-medium text-white/75">رحلة منظمتك بدأت</p><p className="mt-2 max-w-md text-xl font-semibold leading-8">كل أثر كبير يبدأ بخطوة موثوقة، وطلبك الآن في الطريق الصحيح.</p></div></aside>
      </div>
    </main>
  );
}
