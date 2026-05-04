/** بيانات تجريبية — سجل نشاط الأدمن */

export type AuditLogEntry = {
  id: string;
  action: string;
  user: string;
  at: string;
};

export const auditLogStaticData: AuditLogEntry[] = [
  {
    id: "AUD-001",
    action: "تسجيل دخول",
    user: "admin@jod.sa",
    at: "2026-03-15T10:00:00",
  },
  {
    id: "AUD-002",
    action: "قبول منشور POST-1001",
    user: "admin@jod.sa",
    at: "2026-03-15T09:45:00",
  },
  {
    id: "AUD-003",
    action: "رفض حملة مع سبب (محتوى غير مكتمل)",
    user: "admin@jod.sa",
    at: "2026-03-14T16:30:00",
  },
  {
    id: "AUD-004",
    action: "توثيق مؤسسة ORG-204",
    user: "admin@jod.sa",
    at: "2026-03-14T11:20:00",
  },
  {
    id: "AUD-005",
    action: "تجميد حساب مستخدم (بلاغ مؤكد)",
    user: "admin@jod.sa",
    at: "2026-03-13T14:05:00",
  },
];
