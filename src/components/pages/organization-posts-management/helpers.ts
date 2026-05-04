import type {
  OrganizationPostItem,
  OrganizationPostStatus,
  OrganizationPostType,
} from "@/components/pages/organization-posts-management/static-data";

export function createNextPostId(posts: OrganizationPostItem[]): string {
  const maxId = posts.reduce((currentMax, post) => {
    const numericPart = Number.parseInt(post.id.replace(/\D/g, ""), 10);
    if (Number.isNaN(numericPart)) {
      return currentMax;
    }
    return Math.max(currentMax, numericPart);
  }, 2000);

  return `ORG-POST-${maxId + 1}`;
}

const LEGACY_STATUS_ALIASES: Record<string, OrganizationPostStatus> = {
  posted: "published",
  archive: "archived",
  pending: "draft",
  rejected: "draft",
  needs_update: "draft",
};

function isOrganizationPostStatus(value: string): value is OrganizationPostStatus {
  return value === "draft" || value === "published" || value === "archived";
}

export function normalizePostStatus(status: string): OrganizationPostStatus {
  const normalizedStatus = status.trim().toLowerCase();

  if (isOrganizationPostStatus(normalizedStatus)) {
    return normalizedStatus;
  }

  return LEGACY_STATUS_ALIASES[normalizedStatus] ?? "draft";
}

export function getPostStatusBadgeClass(status: OrganizationPostStatus | string): string {
  const normalizedStatus = normalizePostStatus(status);

  if (normalizedStatus === "published") {
    return "border-emerald-200/70 bg-emerald-100 text-emerald-800 dark:border-emerald-500/40 dark:bg-emerald-500/20 dark:text-emerald-100";
  }

  if (normalizedStatus === "draft") {
    return "border-amber-200/70 bg-amber-100 text-amber-800 dark:border-amber-500/40 dark:bg-amber-500/20 dark:text-amber-100";
  }

  return "border-slate-200/70 bg-slate-100 text-slate-800 dark:border-slate-500/40 dark:bg-slate-500/20 dark:text-slate-100";
}

export function isCampaignRelatedPostType(type: OrganizationPostType): boolean {
  return (
    type === "campaign_teaser" ||
    type === "campaign_update" ||
    type === "campaign_summary"
  );
}

export function getWorkflowActionForStatus(status: OrganizationPostStatus | string): {
  key: "publish" | "archive" | "restore";
  label: string;
} {
  const normalizedStatus = normalizePostStatus(status);

  if (normalizedStatus === "draft") {
    return { key: "publish", label: "نشر" };
  }

  if (normalizedStatus === "published") {
    return { key: "archive", label: "أرشفة" };
  }

  return { key: "restore", label: "استعادة كمسودة" };
}
