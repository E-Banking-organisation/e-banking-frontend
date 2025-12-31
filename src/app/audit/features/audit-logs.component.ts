import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import { AuditGraphqlService } from '../core/services/audit-graphql.service';
import { AuditEvent } from '../core/models/audit.model';
import { AuthService } from '../../auth/services/auth.service';

import { UserRole } from '../../auth/models/user-role.enum';

@Component({
  selector: 'app-audit-logs',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './audit-logs.component.html',
  styleUrls: ['./audit-logs.component.css']
})
export class AuditLogsComponent implements OnInit {

  currentRole: UserRole | null = null;

  logs: AuditEvent[] = [];

  hasAccess = false;
  isAdmin = false;
  isAgent = false;

  activeFilter = 'all';
  lastUpdate = new Date();

  constructor(
    private auditService: AuditGraphqlService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.checkAccess();

    if (this.hasAccess) {
      this.loadInitialData();
    }
  }

  get roleClass(): string {
    return this.isAdmin ? 'audit-admin' : 'audit-agent';
  }

  private checkAccess(): void {
    const user = this.authService.getCurrentUser();

    if (!user) {
      this.router.navigate(['/auth/login']);
      return;
    }

    this.currentRole = user.role;

    this.isAdmin = user.role === 'ADMIN';
    this.isAgent = user.role === 'AGENT';
    this.hasAccess = this.isAdmin || this.isAgent;

    if (!this.hasAccess) {
      console.warn('Accès refusé : rôle insuffisant');
    }
  }

  private loadInitialData(): void {
    if (this.isAdmin) {
      this.loadAll();
    } else if (this.isAgent) {
      this.loadMyActions();
    }
  }

  loadAll(): void {
    this.activeFilter = 'all';
    this.auditService.getAuditEvents(undefined, undefined, undefined, 100)
      .subscribe({
        next: logs => {
          this.logs = logs;
          this.lastUpdate = new Date();
        },
        error: err => this.handleError(err)
      });
  }

  loadMyActions(): void {
    const user = this.authService.getCurrentUser();
    if (!user) return;

    this.activeFilter = 'mine';
    this.auditService.getAuditEvents(user.id, undefined, undefined, 50)
      .subscribe({
        next: logs => {
          this.logs = logs;
          this.lastUpdate = new Date();
        },
        error: err => this.handleError(err)
      });
  }

  loadByService(serviceName: string): void {
    this.activeFilter = serviceName;
    this.auditService.getAuditEvents(undefined, serviceName, undefined, 50)
      .subscribe({
        next: logs => {
          this.logs = logs;
          this.lastUpdate = new Date();
        },
        error: err => this.handleError(err)
      });
  }

  loadBySeverity(severity: 'INFO' | 'WARNING' | 'ERROR' | 'CRITICAL'): void {
    this.activeFilter = severity;
    this.auditService.getAuditEvents(undefined, undefined, severity, 50)
      .subscribe({
        next: logs => {
          this.logs = logs;
          this.lastUpdate = new Date();
        },
        error: err => this.handleError(err)
      });
  }

  formatAction(action: string): string {
    return action
      .replace(/_/g, ' ')
      .toLowerCase()
      .replace(/\b\w/g, c => c.toUpperCase());
  }

  trackByLogId(_: number, log: AuditEvent): string {
    return log.id;
  }

  private handleError(err: Error): void {
    console.error('Erreur audit logs :', err);
    alert('Erreur lors du chargement des logs d’audit');
  }

  goBack(): void {
    this.router.navigate(['/']);
  }
}
