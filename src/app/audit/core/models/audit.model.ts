export type AuditSeverity = 'INFO' | 'WARNING' | 'ERROR' | 'CRITICAL';

export interface AuditEvent {
  id: string;
  userId: string;
  action: string;
  serviceName: string;
  severity: AuditSeverity;
  timestamp: string;
  details?: string;
}

export interface AuditEventInput {
  userId: string;
  action: string;
  serviceName: string;
  severity: AuditSeverity;
  details?: string;
}

export interface CreateAuditEventResponse {
  createAuditEvent: AuditEvent;
}

export interface AuditEventsResponse {
  auditEvents: AuditEvent[];
}
