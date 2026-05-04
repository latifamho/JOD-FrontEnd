import type { AppIconName } from "@/constant/icons";

type RouteBuilder = (id?: string | number) => string;

export const routePaths = {
  dashboardScope: {
    root: "/dashboard",
    adminRoot: "/dashboard/admin",
    orgOwnerRoot: "/dashboard/org-owner",
    orgStaffRoot: "/dashboard/org-staff",
  },
  adminScope: {
    overview: "/dashboard/admin",
    postsReview: "/dashboard/admin/posts/review",
    postsApproved: "/dashboard/admin/posts/approved",
    postsRejected: "/dashboard/admin/posts/rejected",
    campaignsReview: "/dashboard/admin/campaigns/review",
    campaignsApproved: "/dashboard/admin/campaigns/approved",
    campaignsRejected: "/dashboard/admin/campaigns/rejected",
    reports: "/dashboard/admin/reports",
    reportsNew: "/dashboard/admin/reports/new",
    reportsInProgress: "/dashboard/admin/reports/in-progress",
    reportsClosed: "/dashboard/admin/reports/closed",
    users: "/dashboard/admin/users",
    organizations: "/dashboard/admin/organizations",
    organizationDetails: (id = ":id") => `/dashboard/admin/organizations/${id}`,
    organizationDetailsTemplate: "/dashboard/admin/organizations/:id",
    verification: "/dashboard/admin/organizations/verification",
    rewards: "/dashboard/admin/rewards",
    notifications: "/dashboard/admin/notifications",
    notificationsInbox: "/dashboard/admin/notifications/inbox",
    notificationsSent: "/dashboard/admin/notifications/sent",
    content: "/dashboard/admin/content",
    contentNew: "/dashboard/admin/content/new",
    contentEdit: (id = ":id") => `/dashboard/admin/content/${id}/edit`,
    contentEditTemplate: "/dashboard/admin/content/:id/edit",
    analytics: "/dashboard/admin/analytics",
    auditLog: "/dashboard/admin/audit-log",
    profile: "/dashboard/admin/profile",
    settings: "/dashboard/admin/settings",
  },
  organizationOwnerScope: {
    overview: "/dashboard/org-owner",
    campaigns: "/dashboard/org-owner/campaigns",
    campaignsDraft: "/dashboard/org-owner/campaigns/draft",
    campaignsActive: "/dashboard/org-owner/campaigns/active",
    campaignsClosed: "/dashboard/org-owner/campaigns/closed",
    campaignDetails: (id = ":id") => `/dashboard/org-owner/campaigns/${id}`,
    campaignDetailsTemplate: "/dashboard/org-owner/campaigns/:id",
    posts: "/dashboard/org-owner/posts",
    postsDraft: "/dashboard/org-owner/posts/draft",
    postsPublished: "/dashboard/org-owner/posts/published",
    postsArchived: "/dashboard/org-owner/posts/archived",
    donors: "/dashboard/org-owner/donors",
    donorsApplicants: "/dashboard/org-owner/donors/applicants",
    staff: "/dashboard/org-owner/staff",
    staffRoles: "/dashboard/org-owner/staff/roles",
    notifications: "/dashboard/org-owner/notifications",
    notificationsInbox: "/dashboard/org-owner/notifications/inbox",
    notificationsSent: "/dashboard/org-owner/notifications/sent",
    reports: "/dashboard/org-owner/reports",
    profile: "/dashboard/org-owner/profile",
    settings: "/dashboard/org-owner/settings",
  },
  organizationStaffScope: {
    overview: "/dashboard/org-staff",
    campaigns: "/dashboard/org-staff/campaigns",
    campaignsActive: "/dashboard/org-staff/campaigns/active",
    campaignsClosed: "/dashboard/org-staff/campaigns/closed",
    campaignDetails: (id = ":id") => `/dashboard/org-staff/campaigns/${id}`,
    campaignDetailsTemplate: "/dashboard/org-staff/campaigns/:id",
    posts: "/dashboard/org-staff/posts",
    donors: "/dashboard/org-staff/donors",
    donorsApplicants: "/dashboard/org-staff/donors/applicants",
    notifications: "/dashboard/org-staff/notifications",
    notificationsInbox: "/dashboard/org-staff/notifications/inbox",
    notificationsSent: "/dashboard/org-staff/notifications/sent",
    reports: "/dashboard/org-staff/reports",
    profile: "/dashboard/org-staff/profile",
    settings: "/dashboard/org-staff/settings",
  },
} as const;

export type RouteScopes = typeof routePaths;
export type RouteKey<S extends keyof RouteScopes> = keyof RouteScopes[S];

const isBuilder = (value: unknown): value is RouteBuilder =>
  typeof value === "function";

const normalizePathname = (pathname: string): string => {
  const normalized = pathname.trim().replace(/\/+$/, "");
  return normalized === "" ? "/" : normalized;
};

export function resolveRoute<S extends keyof RouteScopes>(
  scope: S,
  key: RouteKey<S>,
  params: Record<string, string | number> = {},
): string {
  const route = routePaths[scope][key];

  if (isBuilder(route)) {
    const firstParam = Object.values(params)[0];
    return route(firstParam !== undefined ? String(firstParam) : ":id");
  }

  let resolvedRoute = route as string;
  Object.entries(params).forEach(([paramName, paramValue]) => {
    resolvedRoute = resolvedRoute.replaceAll(
      `:${paramName}`,
      String(paramValue),
    );
  });

  return resolvedRoute;
}

export function isRouteActive(pathname: string, href: string): boolean {
  const current = normalizePathname(pathname);
  const target = normalizePathname(href);

  if (current === target) {
    return true;
  }

  if (target === "/") {
    return current === "/";
  }

  if (target.includes(":")) {
    const pattern = target.replace(/:[^/]+/g, "[^/]+");
    const matcher = new RegExp(`^${pattern}(?:/|$)`);
    return matcher.test(current);
  }

  return current.startsWith(`${target}/`);
}

export type DashboardRole =
  | "admin"
  | "organization_owner"
  | "organization_staff";

export const dashboardRoleLabels: Record<DashboardRole, string> = {
  admin: "لوحة الأدمن",
  organization_owner: "لوحة مالك المنظمة",
  organization_staff: "لوحة موظف المنظمة",
};

export type SectionTabLink = {
  label: string;
  href: string;
  icon: AppIconName;
};

export type AppNavLink = {
  label: string;
  href: string;
  icon: AppIconName;
  section: string;
  tabs?: SectionTabLink[];
};

const adminLinks: AppNavLink[] = [
  {
    label: "لوحة التحكم",
    href: routePaths.adminScope.overview,
    icon: "dashboard",
    section: "الرئيسية",
  },
  {
    label: "مراجعة المنشورات",
    href: routePaths.adminScope.postsReview,
    icon: "posts",
    section: "الإدارة",
    tabs: [
      {
        label: "قيد المراجعة",
        href: routePaths.adminScope.postsReview,
        icon: "verification",
      },
      {
        label: "مقبولة",
        href: routePaths.adminScope.postsApproved,
        icon: "posts",
      },
      {
        label: "مرفوضة",
        href: routePaths.adminScope.postsRejected,
        icon: "reports",
      },
    ],
  },
  {
    label: "مراجعة الحملات",
    href: routePaths.adminScope.campaignsReview,
    icon: "campaigns",
    section: "الإدارة",
    tabs: [
      {
        label: "قيد المراجعة",
        href: routePaths.adminScope.campaignsReview,
        icon: "verification",
      },
      {
        label: "مقبولة",
        href: routePaths.adminScope.campaignsApproved,
        icon: "campaigns",
      },
      {
        label: "مرفوضة",
        href: routePaths.adminScope.campaignsRejected,
        icon: "reports",
      },
    ],
  },
  {
    label: "إدارة البلاغات",
    href: routePaths.adminScope.reportsNew,
    icon: "reports",
    section: "الإدارة",
    tabs: [
      {
        label: "جديد",
        href: routePaths.adminScope.reportsNew,
        icon: "reports",
      },
      {
        label: "قيد المعالجة",
        href: routePaths.adminScope.reportsInProgress,
        icon: "verification",
      },
      {
        label: "مغلق",
        href: routePaths.adminScope.reportsClosed,
        icon: "auditLog",
      },
    ],
  },
  {
    label: "إدارة المستخدمين",
    href: routePaths.adminScope.users,
    icon: "users",
    section: "الإدارة",
  },
  {
    label: "إدارة المنظمات",
    href: routePaths.adminScope.organizations,
    icon: "organizations",
    section: "الإدارة",
  },
  {
    label: "الشارات والمكافآت",
    href: routePaths.adminScope.rewards,
    icon: "rewards",
    section: "الإدارة",
  },
  {
    label: "المحتوى والمدونة",
    href: routePaths.adminScope.content,
    icon: "content",
    section: "الإدارة",
  },
  {
    label: "التحليلات",
    href: routePaths.adminScope.analytics,
    icon: "analytics",
    section: "الإدارة",
  },
  {
    label: "الإشعارات",
    href: routePaths.adminScope.notificationsInbox,
    icon: "notifications",
    section: "المتابعة",
    tabs: [
      {
        label: "الوارد",
        href: routePaths.adminScope.notificationsInbox,
        icon: "mailOpen",
      },
      {
        label: "المرسل",
        href: routePaths.adminScope.notificationsSent,
        icon: "send",
      },
    ],
  },
  {
    label: "الحساب والإعدادات",
    href: routePaths.adminScope.profile,
    icon: "settings",
    section: "الحساب",
    tabs: [
      {
        label: "الملف الشخصي",
        href: routePaths.adminScope.profile,
        icon: "profile",
      },
      {
        label: "الإعدادات",
        href: routePaths.adminScope.settings,
        icon: "settings",
      },
      {
        label: "سجل النشاط",
        href: routePaths.adminScope.auditLog,
        icon: "auditLog",
      },
    ],
  },
];

const organizationOwnerLinks: AppNavLink[] = [
  {
    label: "لوحة التحكم",
    href: routePaths.organizationOwnerScope.overview,
    icon: "dashboard",
    section: "الرئيسية",
  },
  {
    label: "الحملات",
    href: routePaths.organizationOwnerScope.campaigns,
    icon: "campaigns",
    section: "الإدارة",
    tabs: [
      {
        label: "الكل",
        href: routePaths.organizationOwnerScope.campaigns,
        icon: "goal",
      },
      {
        label: "مسودات",
        href: routePaths.organizationOwnerScope.campaignsDraft,
        icon: "posts",
      },
      {
        label: "نشطة",
        href: routePaths.organizationOwnerScope.campaignsActive,
        icon: "campaigns",
      },
      {
        label: "مغلقة",
        href: routePaths.organizationOwnerScope.campaignsClosed,
        icon: "reports",
      },
    ],
  },
  {
    label: "إدارة البوستات",
    href: routePaths.organizationOwnerScope.posts,
    icon: "posts",
    section: "الإدارة",
    tabs: [
      {
        label: "الكل",
        href: routePaths.organizationOwnerScope.posts,
        icon: "posts",
      },
      {
        label: "مسودات",
        href: routePaths.organizationOwnerScope.postsDraft,
        icon: "goal",
      },
      {
        label: "منشور",
        href: routePaths.organizationOwnerScope.postsPublished,
        icon: "posts",
      },
      {
        label: "مؤرشف",
        href: routePaths.organizationOwnerScope.postsArchived,
        icon: "auditLog",
      },
    ],
  },
  {
    label: "المتبرعون والمتقدمون",
    href: routePaths.organizationOwnerScope.donors,
    icon: "donors",
    section: "الإدارة",
    tabs: [
      {
        label: "المتبرعون",
        href: routePaths.organizationOwnerScope.donors,
        icon: "donors",
      },
      {
        label: "المتقدمون",
        href: routePaths.organizationOwnerScope.donorsApplicants,
        icon: "users",
      },
    ],
  },
  {
    label: "الموظفون والصلاحيات",
    href: routePaths.organizationOwnerScope.staff,
    icon: "staff",
    section: "الإدارة",
    tabs: [
      {
        label: "الموظفون",
        href: routePaths.organizationOwnerScope.staff,
        icon: "staff",
      },
      {
        label: "الصلاحيات",
        href: routePaths.organizationOwnerScope.staffRoles,
        icon: "settings",
      },
    ],
  },
  {
    label: "الإشعارات",
    href: routePaths.organizationOwnerScope.notificationsInbox,
    icon: "notifications",
    section: "المتابعة",
    tabs: [
      {
        label: "الوارد",
        href: routePaths.organizationOwnerScope.notificationsInbox,
        icon: "mailOpen",
      },
      {
        label: "المرسل",
        href: routePaths.organizationOwnerScope.notificationsSent,
        icon: "send",
      },
    ],
  },
  {
    label: "الحساب والإعدادات",
    href: routePaths.organizationOwnerScope.profile,
    icon: "settings",
    section: "الحساب",
    tabs: [
      {
        label: "الملف الشخصي",
        href: routePaths.organizationOwnerScope.profile,
        icon: "profile",
      },
      {
        label: "الإعدادات",
        href: routePaths.organizationOwnerScope.settings,
        icon: "settings",
      },
    ],
  },
];

const organizationStaffLinks: AppNavLink[] = [
  {
    label: "لوحة التحكم",
    href: routePaths.organizationStaffScope.overview,
    icon: "dashboard",
    section: "الرئيسية",
  },
  {
    label: "الحملات",
    href: routePaths.organizationStaffScope.campaigns,
    icon: "campaigns",
    section: "الإدارة",
    tabs: [
      {
        label: "الكل",
        href: routePaths.organizationStaffScope.campaigns,
        icon: "goal",
      },
      {
        label: "نشطة",
        href: routePaths.organizationStaffScope.campaignsActive,
        icon: "campaigns",
      },
      {
        label: "مغلقة",
        href: routePaths.organizationStaffScope.campaignsClosed,
        icon: "reports",
      },
    ],
  },
  {
    label: "إدارة البوستات",
    href: routePaths.organizationStaffScope.posts,
    icon: "posts",
    section: "الإدارة",
    tabs: [
      {
        label: "الكل",
        href: routePaths.organizationOwnerScope.posts,
        icon: "posts",
      },
      {
        label: "مسودات",
        href: routePaths.organizationOwnerScope.postsDraft,
        icon: "goal",
      },
      {
        label: "منشور",
        href: routePaths.organizationOwnerScope.postsPublished,
        icon: "posts",
      },
      {
        label: "مؤرشف",
        href: routePaths.organizationOwnerScope.postsArchived,
        icon: "auditLog",
      },
    ],
  },
  {
    label: "المتبرعون والمتقدمون",
    href: routePaths.organizationStaffScope.donors,
    icon: "donors",
    section: "الإدارة",
    tabs: [
      {
        label: "المتبرعون",
        href: routePaths.organizationStaffScope.donors,
        icon: "donors",
      },
      {
        label: "المتقدمون",
        href: routePaths.organizationStaffScope.donorsApplicants,
        icon: "users",
      },
    ],
  },
  {
    label: "الإشعارات",
    href: routePaths.organizationStaffScope.notificationsInbox,
    icon: "notifications",
    section: "المتابعة",
    tabs: [
      {
        label: "الوارد",
        href: routePaths.organizationStaffScope.notificationsInbox,
        icon: "mailOpen",
      },
      {
        label: "المرسل",
        href: routePaths.organizationStaffScope.notificationsSent,
        icon: "send",
      },
    ],
  },
  {
    label: "الحساب والإعدادات",
    href: routePaths.organizationStaffScope.profile,
    icon: "settings",
    section: "الحساب",
    tabs: [
      {
        label: "الملف الشخصي",
        href: routePaths.organizationStaffScope.profile,
        icon: "profile",
      },
      {
        label: "الإعدادات",
        href: routePaths.organizationStaffScope.settings,
        icon: "settings",
      },
    ],
  },
];

const roleLinks: Record<DashboardRole, AppNavLink[]> = {
  admin: adminLinks,
  organization_owner: organizationOwnerLinks,
  organization_staff: organizationStaffLinks,
};

const roleBaseRoute: Record<DashboardRole, string> = {
  admin: routePaths.dashboardScope.adminRoot,
  organization_owner: routePaths.dashboardScope.orgOwnerRoot,
  organization_staff: routePaths.dashboardScope.orgStaffRoot,
};

const roleProfileRoute: Record<DashboardRole, string> = {
  admin: routePaths.adminScope.profile,
  organization_owner: routePaths.organizationOwnerScope.profile,
  organization_staff: routePaths.organizationStaffScope.profile,
};

const roleSettingsRoute: Record<DashboardRole, string> = {
  admin: routePaths.adminScope.settings,
  organization_owner: routePaths.organizationOwnerScope.settings,
  organization_staff: routePaths.organizationStaffScope.settings,
};

export function getRoleFromPath(pathname: string): DashboardRole {
  const current = normalizePathname(pathname);

  if (current.startsWith(routePaths.dashboardScope.adminRoot)) {
    return "admin";
  }

  if (current.startsWith(routePaths.dashboardScope.orgStaffRoot)) {
    return "organization_staff";
  }

  return "organization_owner";
}

export function getRoleLinks(role: DashboardRole): AppNavLink[] {
  return roleLinks[role];
}

export function getTabsForPath(
  role: DashboardRole,
  pathname: string,
): SectionTabLink[] {
  const links = getRoleLinks(role);

  const activeLinkWithTabs = links.find(
    (link) =>
      link.tabs &&
      (isRouteActive(pathname, link.href) ||
        link.tabs.some((tab) => isRouteActive(pathname, tab.href))),
  );

  return activeLinkWithTabs?.tabs ?? [];
}

export function getDashboardHomeByRole(role: DashboardRole): string {
  return roleBaseRoute[role];
}

export function getRoleProfileRoute(role: DashboardRole): string {
  return roleProfileRoute[role];
}

export function getRoleSettingsRoute(role: DashboardRole): string {
  return roleSettingsRoute[role];
}

const segmentLabels: Record<string, string> = {
  dashboard: "لوحة التحكم",
  admin: "الأدمن",
  "org-owner": "مالك المنظمة",
  "org-staff": "موظف المنظمة",
  posts: "المنشورات",
  post: "منشور",
  review: "قيد المراجعة",
  approved: "مقبولة",
  rejected: "مرفوضة",
  campaigns: "الحملات",
  campaign: "حملة",
  draft: "مسودات",
  active: "نشطة",
  closed: "مغلقة",
  reports: "البلاغات",
  users: "المستخدمون",
  organizations: "المنظمات",
  verification: "التوثيق",
  notifications: "الإشعارات",
  inbox: "الوارد",
  sent: "المرسل",
  rewards: "الشارات",
  content: "المحتوى",
  new: "جديد",
  edit: "تعديل",
  analytics: "الإحصائيات",
  "audit-log": "سجل النشاط",
  profile: "الملف الشخصي",
  settings: "الإعدادات",
  donors: "المتبرعون",
  applicants: "المتقدمون",
  staff: "الموظفون",
  roles: "الصلاحيات",
  map: "الخريطة",
};

const routeTitleMap = new Map<string, string>();

function addLinkTitle(link: AppNavLink) {
  routeTitleMap.set(normalizePathname(link.href), link.label);
  link.tabs?.forEach((tab) => {
    routeTitleMap.set(normalizePathname(tab.href), tab.label);
  });
}

Object.values(roleLinks).flat().forEach(addLinkTitle);

routeTitleMap.set(
  normalizePathname(routePaths.organizationOwnerScope.campaignDetailsTemplate),
  "تفاصيل الحملة",
);
routeTitleMap.set(
  normalizePathname(routePaths.organizationStaffScope.campaignDetailsTemplate),
  "تفاصيل الحملة",
);
routeTitleMap.set(
  normalizePathname(routePaths.adminScope.organizationDetailsTemplate),
  "تفاصيل المنظمة",
);
routeTitleMap.set(
  normalizePathname(routePaths.dashboardScope.root),
  "لوحة التحكم",
);
routeTitleMap.set(normalizePathname(routePaths.adminScope.contentNew), "مقال جديد");
routeTitleMap.set(
  normalizePathname(routePaths.adminScope.contentEditTemplate),
  "تعديل مقال",
);

export function getSegmentLabel(segment: string): string {
  const normalized = segment.toLowerCase();
  if (segmentLabels[normalized]) {
    return segmentLabels[normalized];
  }

  return normalized.replaceAll("-", " ");
}

export function getPathLabel(pathname: string): string {
  const normalizedPath = normalizePathname(pathname);
  const exactLabel = routeTitleMap.get(normalizedPath);

  if (exactLabel) {
    return exactLabel;
  }

  for (const [template, label] of routeTitleMap) {
    if (template.includes(":") && isRouteActive(normalizedPath, template)) {
      return label;
    }
  }

  const segments = normalizedPath.split("/").filter(Boolean);
  const lastSegment = segments.at(-1);

  if (!lastSegment) {
    return "لوحة التحكم";
  }

  return getSegmentLabel(lastSegment);
}

export function getPageTitle(pathname: string): string {
  return getPathLabel(pathname);
}
