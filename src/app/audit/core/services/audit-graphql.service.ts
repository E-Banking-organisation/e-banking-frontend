import { Injectable } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import {
  AuditEvent,
  AuditEventInput,
  AuditSeverity,
  CreateAuditEventResponse,
  AuditEventsResponse
} from '../models/audit.model';

const CREATE_AUDIT_EVENT = gql`
  mutation CreateAuditEvent($input: AuditEventInput!) {
    createAuditEvent(input: $input) {
      id
      userId
      action
      serviceName
      severity
      timestamp
      details
    }
  }
`;

// ✅ Correction : "auditEvents" au lieu de "auditEvent"
const AUDIT_EVENTS_QUERY = gql`
  query GetAuditEvents($userId: String, $serviceName: String, $severity: AuditSeverity, $limit: Int) {
    auditEvents(userId: $userId, serviceName: $serviceName, severity: $severity, limit: $limit) {
      id
      userId
      action
      serviceName
      severity
      timestamp
      details
    }
  }
`;

@Injectable({
  providedIn: 'root'
})
export class AuditGraphqlService {

  constructor(private apollo: Apollo) {}

  logEvent(
    userId: string,
    action: string,
    serviceName: string,
    severity: AuditSeverity = 'INFO',
    details?: string
  ): Observable<AuditEvent> {
    const input: AuditEventInput = {
      userId,
      action,
      serviceName,
      severity,
      details
    };

    return this.apollo
      .mutate<CreateAuditEventResponse>({
        mutation: CREATE_AUDIT_EVENT,
        variables: { input }
      })
      .pipe(
        map(result => {
          if (!result.data) {
            throw new Error('Aucune donnée retournée par la mutation');
          }
          console.log('✅ Événement d\'audit créé:', result.data.createAuditEvent);
          return result.data.createAuditEvent;
        }),
        catchError(error => {
          console.error('❌ Erreur lors de la création de l\'événement d\'audit:', error);
          throw error;
        })
      );
  }

  getAuditEvents(
    userId?: string,
    serviceName?: string,
    severity?: AuditSeverity,
    limit?: number
  ): Observable<AuditEvent[]> {
    return this.apollo
      .query<AuditEventsResponse>({
        query: AUDIT_EVENTS_QUERY,
        variables: { userId, serviceName, severity, limit },
        fetchPolicy: 'network-only'
      })
      .pipe(
        map(result => {
          if (!result.data) {
            throw new Error('Aucune donnée retournée par la requête');
          }
          console.log('✅ Événements d\'audit récupérés:', result.data.auditEvents.length);
          return result.data.auditEvents;
        }),
        catchError(error => {
          console.error('❌ Erreur lors de la récupération des événements:', error);
          throw error;
        })
      );
  }
}
