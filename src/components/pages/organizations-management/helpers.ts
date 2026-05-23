import type {
  AdminOrganizationItem,
  OrganizationStatus,
  OrganizationVerificationStatus,
} from "@/components/pages/organizations-management/static-data";

const MOST_ACTIVE_SCORE_THRESHOLD = 80;

export function createNextOrganizationId(
  organizations: AdminOrganizationItem[],
): string {
  const maxId = organizations.reduce((currentMax, organization) => {
    const numericPart = Number.parseInt(organization.id.replace(/\D/g, ""), 10);
    if (Number.isNaN(numericPart)) {
      return currentMax;
    }
    return Math.max(currentMax, numericPart);
  }, 1000);

  return `ORG-${maxId + 1}`;
}

export function getOrganizationStatusBadgeClass(
  status: OrganizationStatus,
): string {
  if (status === "active") {
    return "border-emerald-200/70 bg-emerald-100 text-emerald-800 dark:border-emerald-500/40 dark:bg-emerald-500/20 dark:text-emerald-100";
  }

  return "border-slate-200/70 bg-slate-100 text-slate-800 dark:border-slate-500/40 dark:bg-slate-500/20 dark:text-slate-100";
}

export function getOrganizationVerificationBadgeClass(
  verificationStatus: OrganizationVerificationStatus,
): string {
  if (verificationStatus === "verified") {
    return "border-sky-200/70 bg-sky-100 text-sky-800 dark:border-sky-500/40 dark:bg-sky-500/20 dark:text-sky-100";
  }

  return "border-amber-200/70 bg-amber-100 text-amber-800 dark:border-amber-500/40 dark:bg-amber-500/20 dark:text-amber-100";
}

export function isMostActiveOrganization(
  organization: AdminOrganizationItem,
): boolean {
  return organization.activityScore >= MOST_ACTIVE_SCORE_THRESHOLD;
}
