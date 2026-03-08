export type AuditEvent = {
  id: string;
  eventType: string;
  actorId: string | null;
  actorRole: string | null;
  payload: Record<string, unknown>;
  createdAt: string;
};

const events: AuditEvent[] = [];

export function recordAuditEvent(input: Omit<AuditEvent, "id" | "createdAt">): AuditEvent {
  const event: AuditEvent = {
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    ...input
  };

  events.unshift(event);
  return event;
}

export function listAuditEvents(limit = 50): AuditEvent[] {
  return events.slice(0, limit);
}
