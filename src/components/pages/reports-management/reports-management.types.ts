export type ReportStatus =
  | "new"
  | "in_progress"
  | "waiting_response"
  | "closed";

export type ReportSeverity = "low" | "medium" | "high" | "critical";

export type ReportEntityType =
  | "post"
  | "campaign"
  | "user"
  | "organization"
  | "comment";

export type ReportTimelineEntry = {
  id?: string;
  action: string;
  label?: string;
  by?: string;
  actor?: string;
  at: string;
  note?: string;
};

export type ReportEvidence = {
  id: string;
  label: string;
  type: "link" | "image" | "document";
  value: string;
};

export type NameObject = { id?: string; name: string; email?: string };

export type ReportItem = {
  id: string;
  title: string;
  description: string;
  status: ReportStatus;
  severity: ReportSeverity;
  entityType: ReportEntityType;
  entityId: string;
  organizationName: string | NameObject | null;
  reporterName: string | NameObject | null;
  createdAt: string;
  assignee?: string | NameObject | null;
  timeline: ReportTimelineEntry[] | null;
  evidence: ReportEvidence[] | null;
  closedAt?: string | null;
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
  comment: "تعليق",
};
