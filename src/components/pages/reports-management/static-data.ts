export type ReportStatus =
  | "new"
  | "in_progress"
  | "waiting_response"
  | "closed";

export type ReportSeverity = "low" | "medium" | "high" | "critical";

export type ReportEntityType = "post" | "campaign" | "user" | "organization";

export type ReportTimelineEntry = {
  id: string;
  action: string;
  actor: string;
  at: string;
  note?: string;
};

export type ReportEvidence = {
  id: string;
  label: string;
  type: "link" | "image" | "document";
  value: string;
};

export type ReportItem = {
  id: string;
  title: string;
  description: string;
  status: ReportStatus;
  severity: ReportSeverity;
  entityType: ReportEntityType;
  entityId: string;
  organizationName: string;
  reporterName: string;
  createdAt: string;
  assignee?: string;
  timeline: ReportTimelineEntry[];
  evidence: ReportEvidence[];
};

export const reportStatusLabels: Record<ReportStatus, string> = {
  new: "جديد",
  in_progress: "قيد المعالجة",
  waiting_response: "بانتظار الرد",
  closed: "مغلق",
};

export const reportSeverityLabels: Record<ReportSeverity, string> = {
  low: "منخفض",
  medium: "متوسط",
  high: "مرتفع",
  critical: "حرج",
};

export const reportEntityTypeLabels: Record<ReportEntityType, string> = {
  post: "منشور",
  campaign: "حملة",
  user: "مستخدم",
  organization: "منظمة",
};

export const reportsStaticData: ReportItem[] = [
  {
    id: "REP-3001",
    title: "بلاغ إساءة في تعليق منشور",
    description:
      "المبلغ أشار إلى استخدام ألفاظ مسيئة في التعليقات المرافقة للمنشور.",
    status: "new",
    severity: "medium",
    entityType: "post",
    entityId: "POST-1002",
    organizationName: "مؤسسة عطاء الأثر",
    reporterName: "مستخدم #4421",
    createdAt: "2026-02-26T09:15:00",
    timeline: [
      {
        id: "TL-1",
        action: "إنشاء البلاغ",
        actor: "النظام",
        at: "2026-02-26T09:15:00",
      },
    ],
    evidence: [
      {
        id: "EV-1",
        label: "رابط التعليق",
        type: "link",
        value: "https://jod.sa/posts/POST-1002#comment-88",
      },
    ],
  },
  {
    id: "REP-3002",
    title: "بلاغ محتوى احتيالي في حملة",
    description:
      "يوجد ادعاءات غير دقيقة حول نتائج الحملة مع طلب تحويلات مباشرة خارج المنصة.",
    status: "new",
    severity: "critical",
    entityType: "campaign",
    entityId: "CAM-2013",
    organizationName: "مبادرة إنقاذ",
    reporterName: "مستخدم #1192",
    createdAt: "2026-02-26T11:35:00",
    timeline: [
      {
        id: "TL-1",
        action: "إنشاء البلاغ",
        actor: "النظام",
        at: "2026-02-26T11:35:00",
      },
    ],
    evidence: [
      {
        id: "EV-1",
        label: "رابط الحملة",
        type: "link",
        value: "https://jod.sa/campaigns/CAM-2013",
      },
      {
        id: "EV-2",
        label: "لقطة شاشة",
        type: "image",
        value: "evidence-rep-3002.png",
      },
    ],
  },
  {
    id: "REP-3003",
    title: "بلاغ انتحال صفة مستخدم",
    description:
      "حساب يدّعي تمثيل منظمة مع استخدام اسم مشابه لحساب موثق.",
    status: "in_progress",
    severity: "high",
    entityType: "user",
    entityId: "USR-9811",
    organizationName: "غير مرتبط",
    reporterName: "مستخدم #981",
    createdAt: "2026-02-25T15:10:00",
    assignee: "فريق البلاغات - 1",
    timeline: [
      {
        id: "TL-1",
        action: "إنشاء البلاغ",
        actor: "النظام",
        at: "2026-02-25T15:10:00",
      },
      {
        id: "TL-2",
        action: "استلام البلاغ",
        actor: "فريق البلاغات - 1",
        at: "2026-02-25T15:45:00",
      },
    ],
    evidence: [
      {
        id: "EV-1",
        label: "رابط الحساب",
        type: "link",
        value: "https://jod.sa/users/USR-9811",
      },
    ],
  },
  {
    id: "REP-3004",
    title: "بلاغ إساءة استخدام تبرعات",
    description:
      "وجود معلومات متضاربة في تحديثات الحملة مقارنة بالتقارير السابقة.",
    status: "in_progress",
    severity: "high",
    entityType: "campaign",
    entityId: "CAM-2004",
    organizationName: "مؤسسة سكن آمن",
    reporterName: "مستخدم #2288",
    createdAt: "2026-02-25T10:25:00",
    assignee: "فريق البلاغات - 2",
    timeline: [
      {
        id: "TL-1",
        action: "إنشاء البلاغ",
        actor: "النظام",
        at: "2026-02-25T10:25:00",
      },
      {
        id: "TL-2",
        action: "استلام البلاغ",
        actor: "فريق البلاغات - 2",
        at: "2026-02-25T11:20:00",
      },
    ],
    evidence: [
      {
        id: "EV-1",
        label: "رابط التحديث محل البلاغ",
        type: "link",
        value: "https://jod.sa/campaigns/CAM-2004/updates/7",
      },
      {
        id: "EV-2",
        label: "مرفق تقرير",
        type: "document",
        value: "financial-note.pdf",
      },
    ],
  },
  {
    id: "REP-3005",
    title: "بلاغ على منظمة بمعلومات غير مكتملة",
    description:
      "صفحة المنظمة لا تتضمن وثائق تعريفية محدثة رغم تفعيل حملات جديدة.",
    status: "waiting_response",
    severity: "medium",
    entityType: "organization",
    entityId: "ORG-440",
    organizationName: "جمعية تمكين",
    reporterName: "مستخدم #991",
    createdAt: "2026-02-24T13:05:00",
    assignee: "فريق البلاغات - 1",
    timeline: [
      {
        id: "TL-1",
        action: "إنشاء البلاغ",
        actor: "النظام",
        at: "2026-02-24T13:05:00",
      },
      {
        id: "TL-2",
        action: "استلام البلاغ",
        actor: "فريق البلاغات - 1",
        at: "2026-02-24T13:40:00",
      },
      {
        id: "TL-3",
        action: "طلب معلومات إضافية",
        actor: "فريق البلاغات - 1",
        at: "2026-02-24T14:15:00",
        note: "تم طلب توثيق محدث من المنظمة.",
      },
    ],
    evidence: [
      {
        id: "EV-1",
        label: "رابط المنظمة",
        type: "link",
        value: "https://jod.sa/organizations/ORG-440",
      },
    ],
  },
  {
    id: "REP-3006",
    title: "بلاغ منشور مكرر",
    description: "تم الإبلاغ عن منشور مكرر تم نشره بنفس المحتوى خلال 24 ساعة.",
    status: "waiting_response",
    severity: "low",
    entityType: "post",
    entityId: "POST-1006",
    organizationName: "جمعية أيادي",
    reporterName: "مستخدم #7312",
    createdAt: "2026-02-24T09:00:00",
    assignee: "فريق البلاغات - 2",
    timeline: [
      {
        id: "TL-1",
        action: "إنشاء البلاغ",
        actor: "النظام",
        at: "2026-02-24T09:00:00",
      },
      {
        id: "TL-2",
        action: "استلام البلاغ",
        actor: "فريق البلاغات - 2",
        at: "2026-02-24T09:20:00",
      },
      {
        id: "TL-3",
        action: "طلب معلومات إضافية",
        actor: "فريق البلاغات - 2",
        at: "2026-02-24T10:00:00",
      },
    ],
    evidence: [
      {
        id: "EV-1",
        label: "رابط المنشور",
        type: "link",
        value: "https://jod.sa/posts/POST-1006",
      },
    ],
  },
  {
    id: "REP-3007",
    title: "بلاغ مغلق - مخالفة مثبتة",
    description:
      "تم تأكيد وجود عبارات تحريضية في محتوى الحملة واتخاذ إجراء إخفاء.",
    status: "closed",
    severity: "high",
    entityType: "campaign",
    entityId: "CAM-2014",
    organizationName: "جمعية تعليم للجميع",
    reporterName: "مستخدم #3100",
    createdAt: "2026-02-22T12:30:00",
    assignee: "فريق البلاغات - 1",
    timeline: [
      {
        id: "TL-1",
        action: "إنشاء البلاغ",
        actor: "النظام",
        at: "2026-02-22T12:30:00",
      },
      {
        id: "TL-2",
        action: "استلام البلاغ",
        actor: "فريق البلاغات - 1",
        at: "2026-02-22T13:15:00",
      },
      {
        id: "TL-3",
        action: "إغلاق البلاغ",
        actor: "فريق البلاغات - 1",
        at: "2026-02-22T15:00:00",
        note: "تمت المخالفة وتم إخفاء المحتوى.",
      },
    ],
    evidence: [
      {
        id: "EV-1",
        label: "رابط الحملة",
        type: "link",
        value: "https://jod.sa/campaigns/CAM-2014",
      },
    ],
  },
  {
    id: "REP-3008",
    title: "بلاغ مغلق - غير مثبت",
    description: "البلاغ تحقق منه الفريق ولم يتم العثور على مخالفة صريحة.",
    status: "closed",
    severity: "low",
    entityType: "user",
    entityId: "USR-4040",
    organizationName: "غير مرتبط",
    reporterName: "مستخدم #5150",
    createdAt: "2026-02-22T10:05:00",
    assignee: "فريق البلاغات - 2",
    timeline: [
      {
        id: "TL-1",
        action: "إنشاء البلاغ",
        actor: "النظام",
        at: "2026-02-22T10:05:00",
      },
      {
        id: "TL-2",
        action: "استلام البلاغ",
        actor: "فريق البلاغات - 2",
        at: "2026-02-22T10:40:00",
      },
      {
        id: "TL-3",
        action: "إغلاق البلاغ",
        actor: "فريق البلاغات - 2",
        at: "2026-02-22T11:20:00",
        note: "غير مثبت",
      },
    ],
    evidence: [
      {
        id: "EV-1",
        label: "رابط الحساب",
        type: "link",
        value: "https://jod.sa/users/USR-4040",
      },
    ],
  },
];

