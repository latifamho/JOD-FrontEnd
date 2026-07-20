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
