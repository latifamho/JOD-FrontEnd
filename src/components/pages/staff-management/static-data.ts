export type StaffRole = "owner" | "manager" | "editor" | "viewer";

export type StaffMemberItem = {
  id: string;
  name: string;
  email: string;
  role: StaffRole;
  invitedAt: string;
};

export type StaffRoleItem = {
  id: string;
  role: StaffRole;
  description: string;
  permissions: string[];
  updatedAt: string;
  isActive: boolean;
  isSystem?: boolean;
};

export type StaffPermissionOption = {
  id: string;
  label: string;
  description: string;
};

export const staffRoleLabels: Record<StaffRole, string> = {
  owner: "مالك المنظمة",
  manager: "مدير",
  editor: "محرر",
  viewer: "مشاهد",
};

export const staffPermissionCatalog: StaffPermissionOption[] = [
  {
    id: "permission-campaigns-manage",
    label: "إدارة الحملات",
    description: "إنشاء وتعديل وإغلاق الحملات ومتابعة حالتها.",
  },
  {
    id: "permission-posts-manage",
    label: "إدارة البوستات",
    description: "إنشاء وتعديل ونشر وأرشفة البوستات.",
  },
  {
    id: "permission-donors-manage",
    label: "إدارة المتبرعين والمتقدمين",
    description: "إدارة سجلات المتبرعين وطلبات المتقدمين.",
  },
  {
    id: "permission-donors-view",
    label: "عرض المتبرعين والمتقدمين",
    description: "عرض بيانات المتبرعين والمتقدمين بدون تعديل.",
  },
  {
    id: "permission-staff-manage",
    label: "إدارة الموظفين والصلاحيات",
    description: "إدارة الموظفين وإسناد الأدوار والصلاحيات.",
  },
  {
    id: "permission-notifications-manage",
    label: "إدارة الإشعارات",
    description: "إرسال وتنظيم إشعارات المنظمة.",
  },
  {
    id: "permission-notifications-view",
    label: "عرض الإشعارات",
    description: "عرض الإشعارات الواردة والصادرة بدون تعديل.",
  },
  {
    id: "permission-reports-view",
    label: "عرض التقارير",
    description: "متابعة تقارير الأداء والإحصائيات.",
  },
  {
    id: "permission-dashboard-view",
    label: "عرض اللوحة",
    description: "الوصول إلى لوحة التحكم وعرض البيانات.",
  },
  {
    id: "permission-settings-manage",
    label: "إعدادات المنظمة",
    description: "إدارة إعدادات المنظمة والبيانات العامة.",
  },
];

export const staffStaticData: StaffMemberItem[] = [
  {
    id: "STF-001",
    name: "أحمد المدير",
    email: "ahmed@khair-med.org.sa",
    role: "manager",
    invitedAt: "2026-02-01T09:00:00",
  },
  {
    id: "STF-002",
    name: "سارة المحررة",
    email: "sara@khair-med.org.sa",
    role: "viewer",
    invitedAt: "2026-02-10T14:00:00",
  },
  {
    id: "STF-003",
    name: "نورة العاملي",
    email: "noura.staff@khair-med.org.sa",
    role: "manager",
    invitedAt: "2026-02-18T11:30:00",
  },
  {
    id: "STF-004",
    name: "عبدالله الخطيب",
    email: "abdullah@khair-med.org.sa",
    role: "editor",
    invitedAt: "2026-02-19T10:20:00",
  },
  {
    id: "STF-005",
    name: "هبة يونس",
    email: "hiba@khair-med.org.sa",
    role: "editor",
    invitedAt: "2026-02-20T08:10:00",
  },
  {
    id: "STF-006",
    name: "أيمن سالم",
    email: "ayman@khair-med.org.sa",
    role: "viewer",
    invitedAt: "2026-02-21T09:45:00",
  },
  {
    id: "STF-007",
    name: "جمانة الشريف",
    email: "jumana@khair-med.org.sa",
    role: "manager",
    invitedAt: "2026-02-22T15:00:00",
  },
  {
    id: "STF-008",
    name: "زياد النجار",
    email: "ziad@khair-med.org.sa",
    role: "editor",
    invitedAt: "2026-02-23T12:30:00",
  },
  {
    id: "STF-009",
    name: "ليلى محمود",
    email: "layla@khair-med.org.sa",
    role: "viewer",
    invitedAt: "2026-02-24T16:20:00",
  },
  {
    id: "STF-010",
    name: "عمر القاسم",
    email: "omar@khair-med.org.sa",
    role: "manager",
    invitedAt: "2026-02-25T11:10:00",
  },
  {
    id: "STF-011",
    name: "ريم صالح",
    email: "reem@khair-med.org.sa",
    role: "editor",
    invitedAt: "2026-02-26T09:50:00",
  },
];

export const staffRolesStaticData: StaffRoleItem[] = [
  {
    id: "ROLE-001",
    role: "owner",
    description: "صلاحية كاملة على إعدادات المنظمة والمحتوى والموظفين.",
    permissions: [
      "إدارة الحملات",
      "إدارة البوستات",
      "إدارة المتبرعين والمتقدمين",
      "إدارة الموظفين والصلاحيات",
      "إدارة الإشعارات",
      "إعدادات المنظمة",
    ],
    updatedAt: "2026-02-10T09:00:00",
    isActive: true,
    isSystem: true,
  },
  {
    id: "ROLE-002",
    role: "manager",
    description: "إدارة فرق العمل والحملات ومتابعة تقارير الأداء اليومية.",
    permissions: [
      "إدارة الحملات",
      "إدارة البوستات",
      "إدارة المتبرعين والمتقدمين",
      "عرض التقارير",
      "إدارة الإشعارات",
    ],
    updatedAt: "2026-02-14T12:30:00",
    isActive: true,
  },
  {
    id: "ROLE-003",
    role: "editor",
    description: "إنشاء وتحرير المحتوى مع متابعة المتبرعين بدون صلاحيات إعدادات.",
    permissions: [
      "إدارة البوستات",
      "عرض المتبرعين والمتقدمين",
      "عرض الإشعارات",
    ],
    updatedAt: "2026-02-16T13:20:00",
    isActive: true,
  },
  {
    id: "ROLE-004",
    role: "viewer",
    description: "عرض البيانات فقط بدون أي تعديل.",
    permissions: ["عرض اللوحة", "عرض المتبرعين والمتقدمين", "عرض الإشعارات"],
    updatedAt: "2026-02-17T10:45:00",
    isActive: true,
    isSystem: true,
  },
];
