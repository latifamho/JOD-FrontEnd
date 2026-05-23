/** بيانات تجريبية — سجل نشاط الأدمن */

export type AuditLogActionType =
  | "authentication"
  | "moderation"
  | "verification"
  | "security"
  | "content";

export type AuditLogEntry = {
  id: string;
  action: string;
  user: string;
  type: AuditLogActionType;
  reference?: string;
  at: string;
};

export const auditLogStaticData: AuditLogEntry[] = [
  {
    id: "AUD-001",
    action: "تسجيل دخول",
    user: "admin@jod.sa",
    type: "authentication",
    reference: "AUTH-LOGIN",
    at: "2026-03-15T10:00:00",
  },
  {
    id: "AUD-002",
    action: "قبول منشور POST-1001",
    user: "admin@jod.sa",
    type: "moderation",
    reference: "POST-1001",
    at: "2026-03-15T09:45:00",
  },
  {
    id: "AUD-004",
    action: "توثيق مؤسسة ORG-204",
    user: "admin@jod.sa",
    type: "verification",
    reference: "ORG-204",
    at: "2026-03-14T11:20:00",
  },
  {
    id: "AUD-005",
    action: "تجميد حساب مستخدم (بلاغ مؤكد)",
    user: "admin@jod.sa",
    type: "security",
    reference: "USR-920",
    at: "2026-03-13T14:05:00",
  },
  {
    id: "AUD-006",
    action: "تعديل إعدادات التنبيهات العامة",
    user: "ops@jod.sa",
    type: "content",
    reference: "SET-311",
    at: "2026-03-13T09:22:00",
  },
  {
    id: "AUD-007",
    action: "إعادة تعيين كلمة مرور مستخدم",
    user: "security@jod.sa",
    type: "security",
    reference: "USR-447",
    at: "2026-03-12T18:40:00",
  },
  {
    id: "AUD-008",
    action: "نشر مقال توعوي جديد",
    user: "content@jod.sa",
    type: "content",
    reference: "BLOG-088",
    at: "2026-03-12T12:05:00",
  },
  {
    id: "AUD-009",
    action: "تسجيل خروج",
    user: "admin@jod.sa",
    type: "authentication",
    reference: "AUTH-LOGOUT",
    at: "2026-03-12T11:55:00",
  },
];
