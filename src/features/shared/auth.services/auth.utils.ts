import { routePaths } from "@/constant/routes";
import type {
  DashboardContextData,
  DashboardRole,
  LoginAccountType,
} from "@/features/shared/auth.services/auth.type";

export const PENDING_APPROVAL_ROUTE = "/pending-approval";

export class AuthFlowError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AuthFlowError";
  }
}

export function isOrganizationDashboardRole(
  role: DashboardRole | null,
): role is "org_owner" | "org_staff" {
  return role === "org_owner" || role === "org_staff";
}

export function isOrganizationApprovalPending(
  context: DashboardContextData | null,
): boolean {
  if (!context || !isOrganizationDashboardRole(context.profile.dashboardRole)) {
    return false;
  }

  return (
    context.organization === null ||
    context.organization.status !== "active" ||
    context.organization.verificationStatus !== "verified"
  );
}

export function isAccountTypeCompatible(
  accountType: LoginAccountType,
  role: DashboardRole | null,
): boolean {
  if (accountType === "admin") return role === "admin";
  return isOrganizationDashboardRole(role);
}

export function getDashboardHome(role: DashboardRole): string {
  if (role === "admin") return routePaths.adminScope.overview;
  if (role === "org_owner") return routePaths.organizationOwnerScope.overview;
  return routePaths.organizationStaffScope.overview;
}

export function getAuthenticatedLanding(context: DashboardContextData): string {
  const role = context.profile.dashboardRole;
  if (!role) return "/login";
  if (isOrganizationApprovalPending(context)) return PENDING_APPROVAL_ROUTE;
  return getDashboardHome(role);
}
