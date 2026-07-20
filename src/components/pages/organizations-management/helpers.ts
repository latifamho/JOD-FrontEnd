import type {
  AdminOrganizationItem,
  OrganizationStatus,
  OrganizationVerificationStatus,
} from "@/components/pages/organizations-management/organizations-management.types";

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

  if (status === "pending") {
    return "border-amber-200/70 bg-amber-100 text-amber-800 dark:border-amber-500/40 dark:bg-amber-500/20 dark:text-amber-100";
  }

  if (status === "rejected") {
    return "border-rose-200/70 bg-rose-100 text-rose-800 dark:border-rose-500/40 dark:bg-rose-500/20 dark:text-rose-100";
  }

  return "border-slate-200/70 bg-slate-100 text-slate-800 dark:border-slate-500/40 dark:bg-slate-500/20 dark:text-slate-100";
}

export function getOrganizationVerificationBadgeClass(
  verificationStatus: OrganizationVerificationStatus,
): string {
  if (verificationStatus === "verified") {
    return "border-sky-200/70 bg-sky-100 text-sky-800 dark:border-sky-500/40 dark:bg-sky-500/20 dark:text-sky-100";
  }

  if (verificationStatus === "pending") {
    return "border-amber-200/70 bg-amber-100 text-amber-800 dark:border-amber-500/40 dark:bg-amber-500/20 dark:text-amber-100";
  }

  if (verificationStatus === "rejected") {
    return "border-rose-200/70 bg-rose-100 text-rose-800 dark:border-rose-500/40 dark:bg-rose-500/20 dark:text-rose-100";
  }

  return "border-slate-200/70 bg-slate-100 text-slate-800 dark:border-slate-500/40 dark:bg-slate-500/20 dark:text-slate-100";
}

export function isMostActiveOrganization(
  organization: AdminOrganizationItem,
): boolean {
  return organization.activityScore >= MOST_ACTIVE_SCORE_THRESHOLD;
}

/**
 * Verified orgs are always active; non-verified orgs are always inactive.
 * Verification is the source of truth when values disagree.
 */
export function getDisplayVerificationStatus(
  organization: Pick<AdminOrganizationItem, "verificationStatus" | "status">,
): OrganizationVerificationStatus {
  if (organization.verificationStatus === "verified") {
    return "verified";
  }
  if (
    organization.verificationStatus === "pending" ||
    organization.verificationStatus === "rejected"
  ) {
    return organization.verificationStatus;
  }
  return "unverified";
}

export function getDisplayOrganizationStatus(
  organization: Pick<AdminOrganizationItem, "verificationStatus" | "status">,
): OrganizationStatus {
  if (organization.status === "pending" || organization.status === "rejected") {
    return organization.status;
  }
  if (organization.verificationStatus === "verified") {
    return "active";
  }
  return "inactive";
}
