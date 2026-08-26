"use client";

import Image from "next/image";
import { CheckCircle2, Clock3, FileSearch, LogOut, RefreshCw, Sparkles } from "lucide-react";

import waitInviteImage from "@/assets/images/wait-invite.jpg";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { authServices } from "@/features/shared/auth.services/auth.service";
import {
  getAuthenticatedLanding,
  isOrganizationApprovalPending,
  PENDING_APPROVAL_ROUTE,
} from "@/features/shared/auth.services/auth.utils";
import { useAuth } from "@/providers/AuthProvider";
import { useLogout } from "@/features/shared/auth.services/auth.query";
import { useRouter } from "next/navigation";
import * as React from "react";

const reviewSteps = [
  {
    icon: CheckCircle2,
    title: "طھظ… ط§ط³طھظ„ط§ظ… ط§ظ„ط·ظ„ط¨",
    description: "ظˆطµظ„طھ ط¨ظٹط§ظ†ط§طھ ط§ظ„ظ…ظ†ط¸ظ…ط© ظˆط­ط³ط§ط¨ ط§ظ„ظ…ط§ظ„ظƒ ط¥ظ„ظ‰ ظ…ظ†طµط© ط¬ظˆط¯ ط¨ظ†ط¬ط§ط­.",
    done: true,
  },
  {
    icon: FileSearch,
    title: "ظ…ط±ط§ط¬ط¹ط© ط§ظ„ط¨ظٹط§ظ†ط§طھ",
    description: "ظٹظ‚ظˆظ… ظپط±ظٹظ‚ظ†ط§ ط§ظ„ط¢ظ† ط¨ظ…ط·ط§ط¨ظ‚ط© ط§ظ„ط¨ظٹط§ظ†ط§طھ ط§ظ„ط±ط³ظ…ظٹط© ظˆط§ظ„طھط­ظ‚ظ‚ ظ…ظ†ظ‡ط§.",
    done: false,
  },
  {
    icon: Sparkles,
    title: "طھظپط¹ظٹظ„ ظ…ط³ط§ط­ط© ط§ظ„ط¹ظ…ظ„",
    description: "ط¨ط¹ط¯ ط§ظ„ظ…ظˆط§ظپظ‚ط© ط³طھطµط¨ط­ ط¬ظ…ظٹط¹ ط£ط¯ظˆط§طھ ط¥ط¯ط§ط±ط© ط§ظ„ظ…ظ†ط¸ظ…ط© ظ…طھط§ط­ط© طھظ„ظ‚ط§ط¦ظٹط§ظ‹.",
    done: false,
  },
];

export function OrganizationPendingApprovalPage() {
  const router = useRouter();
  const {
    dashboardContext,
    isAuthenticated,
    isLoading,
    setDashboardContext,
  } = useAuth();
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
      if (landing !== "/pending-approval") {
        router.replace(landing);
        return;
      }
      setCheckMessage("ظ…ط§ ط²ط§ظ„ ط§ظ„ط·ظ„ط¨ ظ‚ظٹط¯ ط§ظ„ظ…ط±ط§ط¬ط¹ط©. ط³ظ†ط¨ظ‚ظٹظƒ ط¹ظ„ظ‰ ط§ط·ظ„ط§ط¹ ظپظˆط± طھط­ط¯ظٹط« ط§ظ„ط­ط§ظ„ط©.");
    } catch {
      setCheckMessage("طھط¹ط°ظ‘ط± طھط­ط¯ظٹط« ط§ظ„ط­ط§ظ„ط© ط§ظ„ط¢ظ†. ط¬ط±ظ‘ط¨ ظ…ط±ط© ط£ط®ط±ظ‰ ط¨ط¹ط¯ ظ‚ظ„ظٹظ„.");
    } finally {
      setIsChecking(false);
    }
  }

  if (
    isLoading ||
    !isAuthenticated ||
    !dashboardContext ||
    !isOrganizationApprovalPending(dashboardContext)
  ) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background">
        <div className="space-y-3 text-center" role="status" aria-live="polite">
          <div className="mx-auto size-12 animate-pulse rounded-full bg-primary/15" />
          <p className="text-sm text-muted-foreground">ط¬ط§ط±ظچ ط§ظ„طھط­ظ‚ظ‚ ظ…ظ† ط­ط§ظ„ط© ط§ظ„ط·ظ„ط¨...</p>
        </div>
      </main>
    );
  }

  const organization = dashboardContext?.organization;
  const ownerName = dashboardContext?.profile.name;

  return (
    <main className="relative min-h-screen overflow-hidden bg-background px-4 py-6 sm:px-6 lg:px-8">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(64,93,114,0.18),transparent_38%),radial-gradient(circle_at_bottom_left,rgba(159,174,184,0.24),transparent_42%)]" />
      <div className="relative mx-auto grid min-h-[calc(100vh-3rem)] max-w-6xl overflow-hidden rounded-[2rem] border border-border/70 bg-card shadow-2xl lg:grid-cols-[1.05fr_0.95fr]">
        <section className="flex flex-col justify-center p-6 sm:p-10 lg:p-14">
          <div className="max-w-2xl">
            <Badge className="gap-2 rounded-full px-4 py-2" variant="secondary">
              <Clock3 className="size-4" />
              ط·ظ„ط¨ ط§ظ„ط§ظ†ط¶ظ…ط§ظ… ظ‚ظٹط¯ ط§ظ„ظ…ط±ط§ط¬ط¹ط©
            </Badge>

            <p className="mt-6 text-sm font-medium text-primary">
              ط£ظ‡ظ„ط§ظ‹ {ownerName || "ط¨ظƒ"} ظپظٹ ط¬ظˆط¯
            </p>
            <h1 className="mt-2 text-3xl font-semibold leading-tight text-foreground sm:text-4xl">
              ط·ظ„ط¨ ظ…ظ†ط¸ظ…طھظƒ ظˆطµظ„ ط¨ط£ظ…ط§ظ†طŒ ظˆط§ظ„ط¨ط§ظ‚ظٹ ط¹ظ„ظٹظ†ط§
            </h1>
            <p className="mt-4 text-sm leading-8 text-muted-foreground sm:text-base">
              ظ†ط±ط§ط¬ط¹ ط§ظ„ط¢ظ† ط¨ظٹط§ظ†ط§طھ {organization?.name ? `ظ…ظ†ط¸ظ…ط© ${organization.name}` : "ظ…ظ†ط¸ظ…طھظƒ"}
              {" "}ط¨ط¹ظ†ط§ظٹط©. ط®ظ„ط§ظ„ ظ‡ط°ظ‡ ط§ظ„ظپطھط±ط© ط³طھط¨ظ‚ظ‰ ظ…ط³ط§ط­ط© ط§ظ„ط¹ظ…ظ„ ظ…ط­ظ…ظٹط©طŒ ظˆط¹ظ†ط¯ ط§ط¹طھظ…ط§ط¯ ط§ظ„ط·ظ„ط¨
              ط³طھطھظ…ظƒظ† ظ…ظ† ط§ظ„ط¯ط®ظˆظ„ ط¥ظ„ظ‰ ظ„ظˆط­ط© ط§ظ„ظ…ظ†ط¸ظ…ط© ظ…ط¨ط§ط´ط±ط© ط¨ظ†ظپط³ ط§ظ„ط­ط³ط§ط¨.
            </p>

            <div className="mt-8 space-y-3">
              {reviewSteps.map((step, index) => {
                const Icon = step.icon;
                return (
                  <div
                    key={step.title}
                    className="flex gap-4 rounded-2xl border border-border/70 bg-background/70 p-4"
                  >
                    <div
                      className={`flex size-11 shrink-0 items-center justify-center rounded-2xl ${
                        step.done
                          ? "bg-emerald-500/12 text-emerald-600"
                          : index === 1
                            ? "bg-primary/12 text-primary"
                            : "bg-muted text-muted-foreground"
                      }`}
                    >
                      <Icon className="size-5" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground">{step.title}</p>
                      <p className="mt-1 text-xs leading-6 text-muted-foreground">
                        {step.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {checkMessage ? (
              <p className="mt-5 rounded-xl border border-border bg-muted/50 px-4 py-3 text-xs leading-6 text-muted-foreground">
                {checkMessage}
              </p>
            ) : null}

            <div className="mt-7 flex flex-wrap gap-3">
              <Button type="button" disabled={isChecking} onClick={checkStatus}>
                <RefreshCw className="size-4" />
                {isChecking ? "ط¬ط§ط±ظچ طھط­ط¯ظٹط« ط§ظ„ط­ط§ظ„ط©..." : "طھط­ط¯ظٹط« ط­ط§ظ„ط© ط§ظ„ط·ظ„ط¨"}
              </Button>
              <Button
                type="button"
                variant="outline"
                disabled={logoutMutation.isPending}
                onClick={() => logoutMutation.mutate()}
              >
                <LogOut className="size-4" />
                طھط³ط¬ظٹظ„ ط§ظ„ط®ط±ظˆط¬
              </Button>
            </div>
          </div>
        </section>

        <aside className="relative min-h-80 overflow-hidden bg-muted lg:min-h-full">
          <Image
            src={waitInviteImage}
            alt="ط·ظ„ط¨ طھط³ط¬ظٹظ„ ط§ظ„ظ…ظ†ط¸ظ…ط© ظ‚ظٹط¯ ط§ظ„ظ…ط±ط§ط¬ط¹ط©"
            fill
            priority
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/65 via-slate-900/10 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 p-7 text-white sm:p-10">
            <p className="text-xs font-medium text-white/75">ط±ط­ظ„ط© ظ…ظ†ط¸ظ…طھظƒ ط¨ط¯ط£طھ</p>
            <p className="mt-2 max-w-md text-xl font-semibold leading-8">
              ظƒظ„ ط£ط«ط± ظƒط¨ظٹط± ظٹط¨ط¯ط£ ط¨ط®ط·ظˆط© ظ…ظˆط«ظˆظ‚ط©طŒ ظˆط·ظ„ط¨ظƒ ط§ظ„ط¢ظ† ظپظٹ ط§ظ„ط·ط±ظٹظ‚ ط§ظ„طµط­ظٹط­.
            </p>
          </div>
        </aside>
      </div>
    </main>
  );
}
