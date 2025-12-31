import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AuditLogsComponent } from './audit-logs.component';
import { AuditGraphqlService } from '../core/services/audit-graphql.service';
import { AuthService } from '../../auth/services/auth.service';
import { Router } from '@angular/router';
import { ApolloTestingModule } from 'apollo-angular/testing';
import { of, throwError } from 'rxjs';

xdescribe('AuditLogsComponent', () => {
  let component: AuditLogsComponent;
  let fixture: ComponentFixture<AuditLogsComponent>;
  let auditService: jasmine.SpyObj<AuditGraphqlService>;
  let authService: jasmine.SpyObj<AuthService>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const auditServiceSpy = jasmine.createSpyObj('AuditGraphqlService', [
      'logEvent',
      'getAuditEvents'
    ]);
    const authServiceSpy = jasmine.createSpyObj('AuthService', [
      'getCurrentUser',
      'login',
      'logout'
    ]);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [AuditLogsComponent, ApolloTestingModule],
      providers: [
        { provide: AuditGraphqlService, useValue: auditServiceSpy },
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy }
      ]
    }).compileComponents();

    auditService = TestBed.inject(
      AuditGraphqlService
    ) as jasmine.SpyObj<AuditGraphqlService>;
    authService = TestBed.inject(
      AuthService
    ) as jasmine.SpyObj<AuthService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;

    fixture = TestBed.createComponent(AuditLogsComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    authService.getCurrentUser.and.returnValue(null);
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should redirect to login if no user', () => {
    authService.getCurrentUser.and.returnValue(null);
    fixture.detectChanges();
    expect(router.navigate).toHaveBeenCalledWith(['/auth/login']);
  });

  it('should allow access for ADMIN user', () => {
    const mockUser = {
      id: '1',
      email: 'admin@test.com',
      firstName: 'Admin',
      lastName: 'User',
      role: 'ADMIN' as const,
      token: 'token123'
    };
    authService.getCurrentUser.and.returnValue(mockUser);
    auditService.getAuditEvents.and.returnValue(of([]));

    fixture.detectChanges();

    expect(component.hasAccess).toBe(true);
    expect(component.isAdmin).toBe(true);
  });

  it('should allow access for AGENT user', () => {
    const mockUser = {
      id: '2',
      email: 'agent@test.com',
      firstName: 'Agent',
      lastName: 'User',
      role: 'AGENT' as const,
      token: 'token123'
    };
    authService.getCurrentUser.and.returnValue(mockUser);
    auditService.getAuditEvents.and.returnValue(of([]));

    fixture.detectChanges();

    expect(component.hasAccess).toBe(true);
    expect(component.isAgent).toBe(true);
  });

  it('should deny access for CLIENT user', () => {
    const mockUser = {
      id: '3',
      email: 'client@test.com',
      firstName: 'Client',
      lastName: 'User',
      role: 'CLIENT' as const,
      token: 'token123'
    };
    authService.getCurrentUser.and.returnValue(mockUser);

    fixture.detectChanges();

    expect(component.hasAccess).toBe(false);
  });

  it('should load all events for ADMIN on init', () => {
    const mockUser = {
      id: '1',
      email: 'admin@test.com',
      firstName: 'Admin',
      lastName: 'User',
      role: 'ADMIN' as const,
      token: 'token123'
    };
    const mockLogs = [
      {
        id: '1',
        userId: '1',
        action: 'LOGIN_SUCCESS',
        serviceName: 'AUTH_SERVICE',
        severity: 'INFO' as const,
        timestamp: '2024-01-15T10:30:00Z'
      }
    ];
    authService.getCurrentUser.and.returnValue(mockUser);
    auditService.getAuditEvents.and.returnValue(of(mockLogs));

    fixture.detectChanges();

    expect(auditService.getAuditEvents).toHaveBeenCalledWith(
      undefined,
      undefined,
      undefined,
      100
    );
    expect(component.logs.length).toBe(1);
  });

  it('should load user actions for AGENT on init', () => {
    const mockUser = {
      id: '2',
      email: 'agent@test.com',
      firstName: 'Agent',
      lastName: 'User',
      role: 'AGENT' as const,
      token: 'token123'
    };
    const mockLogs = [
      {
        id: '1',
        userId: '2',
        action: 'CREATE_CLIENT',
        serviceName: 'ACCOUNT_SERVICE',
        severity: 'INFO' as const,
        timestamp: '2024-01-15T10:30:00Z'
      }
    ];
    authService.getCurrentUser.and.returnValue(mockUser);
    auditService.getAuditEvents.and.returnValue(of(mockLogs));

    fixture.detectChanges();

    expect(auditService.getAuditEvents).toHaveBeenCalledWith(
      '2',
      undefined,
      undefined,
      50
    );
    expect(component.logs.length).toBe(1);
  });

  it('should filter by service', () => {
    const mockUser = {
      id: '1',
      email: 'admin@test.com',
      firstName: 'Admin',
      lastName: 'User',
      role: 'ADMIN' as const,
      token: 'token123'
    };
    const mockLogs = [
      {
        id: '1',
        userId: '1',
        action: 'LOGIN_SUCCESS',
        serviceName: 'AUTH_SERVICE',
        severity: 'INFO' as const,
        timestamp: '2024-01-15T10:30:00Z'
      }
    ];
    authService.getCurrentUser.and.returnValue(mockUser);
    auditService.getAuditEvents.and.returnValue(of(mockLogs));

    fixture.detectChanges();
    component.loadByService('AUTH_SERVICE');

    expect(auditService.getAuditEvents).toHaveBeenCalledWith(
      undefined,
      'AUTH_SERVICE',
      undefined,
      50
    );
    expect(component.activeFilter).toBe('AUTH_SERVICE');
  });

  it('should filter by severity', () => {
    const mockUser = {
      id: '1',
      email: 'admin@test.com',
      firstName: 'Admin',
      lastName: 'User',
      role: 'ADMIN' as const,
      token: 'token123'
    };
    const mockLogs = [
      {
        id: '1',
        userId: '1',
        action: 'LOGIN_FAILED',
        serviceName: 'AUTH_SERVICE',
        severity: 'ERROR' as const,
        timestamp: '2024-01-15T10:30:00Z'
      }
    ];
    authService.getCurrentUser.and.returnValue(mockUser);
    auditService.getAuditEvents.and.returnValue(of(mockLogs));

    fixture.detectChanges();
    component.loadBySeverity('ERROR');

    expect(auditService.getAuditEvents).toHaveBeenCalledWith(
      undefined,
      undefined,
      'ERROR',
      50
    );
    expect(component.activeFilter).toBe('ERROR');
  });

  it('should format action correctly', () => {
    authService.getCurrentUser.and.returnValue(null);
    fixture.detectChanges();

    expect(component.formatAction('LOGIN_SUCCESS')).toBe('Login Success');
    expect(component.formatAction('CREATE_CLIENT')).toBe('Create Client');
  });

  it('should handle error when loading events', () => {
    const mockUser = {
      id: '1',
      email: 'admin@test.com',
      firstName: 'Admin',
      lastName: 'User',
      role: 'ADMIN' as const,
      token: 'token123'
    };
    authService.getCurrentUser.and.returnValue(mockUser);
    auditService.getAuditEvents.and.returnValue(
      throwError(() => new Error('Service error'))
    );
    spyOn(window, 'alert');

    fixture.detectChanges();
    component.loadAll();

    expect(window.alert).toHaveBeenCalledWith(
      'Erreur lors du chargement des logs d\'audit'
    );
  });

  it('should navigate back on goBack', () => {
    authService.getCurrentUser.and.returnValue(null);
    fixture.detectChanges();
    component.goBack();

    expect(router.navigate).toHaveBeenCalledWith(['/']);
  });
});
