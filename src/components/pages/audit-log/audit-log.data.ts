export type AuditLogActionType =
  | "authentication"
  | "moderation"
  | "verification"
  | "security"
  | "content";

export type AuditLogActor = {
  id: string | null;
  name: string | null;
  email: string | null;
};

export type AuditLogEntry = {
  id: string;
  action: string;
  user: AuditLogActor | null;
  at: string;
  entityType: string | null;
  entityId: string | null;
  metadata: Record<string, unknown> | null;
};

export function getAuditLogActionType(
  entry: Pick<AuditLogEntry, "action" | "entityType">,
): AuditLogActionType {
  const value = `${entry.action} ${entry.entityType ?? ""}`.toLowerCase();

  if (/login|logout|auth|token|session/.test(value)) return "authentication";
  if (/password|security|permission|role/.test(value)) return "security";
  if (/approve|reject|review|moderation|report/.test(value)) return "moderation";
  if (/verify|verification|accept|organization/.test(value)) return "verification";
  return "content";
}

export function getAuditLogReference(
  entry: Pick<AuditLogEntry, "entityType" | "entityId">,
): string | null {
  if (!entry.entityType && !entry.entityId) return null;
  if (!entry.entityId) return entry.entityType;
  if (!entry.entityType) return entry.entityId;
  return `${entry.entityType} · ${entry.entityId}`;
}
