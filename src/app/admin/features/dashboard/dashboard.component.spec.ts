import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { of, throwError } from 'rxjs';

import { DashboardComponent } from './dashboard.component';
import { AdminService } from '../../core/services/admin.service';
import { TransactionVerificationService } from '../../core/services/transaction-verification.service';
import { AgentService } from '../../core/services/agent.service';
import { CurrencyService } from '../../core/services/currency.service';
import { setupApolloTestingModule } from '../../../test.config';

xdescribe('Admin DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;
  let adminService: jasmine.SpyObj<AdminService>;
  let transactionService: jasmine.SpyObj<TransactionVerificationService>;
  let agentService: jasmine.SpyObj<AgentService>;
  let currencyService: jasmine.SpyObj<CurrencyService>;

  const mockDashboardStats = {
    totalAgents: 15,
    activeAgents: 12,
    pendingTransactions: 8,
    flaggedTransactions: 2,
    totalCurrencies: 5
  };

  beforeEach(async () => {
    setupApolloTestingModule();

    adminService = jasmine.createSpyObj('AdminService', ['getAdminDashboardStats']);
    transactionService = jasmine.createSpyObj('TransactionVerificationService', [
      'getPendingTransactions',
      'getFlaggedTransactions'
    ]);
    agentService = jasmine.createSpyObj('AgentService', ['getActiveAgents', 'getAllAgents']);
    currencyService = jasmine.createSpyObj('CurrencyService', ['getCurrencies', 'getCurrencyCount']);

    adminService.getAdminDashboardStats.and.returnValue(of(mockDashboardStats));
    transactionService.getPendingTransactions.and.returnValue(of([]));
    transactionService.getFlaggedTransactions.and.returnValue(of([]));
    agentService.getAllAgents.and.returnValue(of([]));

    await TestBed.configureTestingModule({
      imports: [DashboardComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: AdminService, useValue: adminService },
        { provide: TransactionVerificationService, useValue: transactionService },
        { provide: AgentService, useValue: agentService },
        { provide: CurrencyService, useValue: currencyService },
        {
          provide: ActivatedRoute,
          useValue: {
            params: of({}),
            queryParams: of({}),
            snapshot: { params: {}, queryParams: {} }
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load dashboard data on init', () => {
    fixture.detectChanges();
    component.ngOnInit();

    expect(adminService.getAdminDashboardStats).toHaveBeenCalled();
    expect(component.totalAgents).toBe(15);
    expect(component.activeAgents).toBe(12);
    expect(component.pendingTransactions).toBe(8);
    expect(component.flaggedTransactions).toBe(2);
    expect(component.totalCurrencies).toBe(5);
  });

  it('should update totalAgents property', () => {
    adminService.getAdminDashboardStats.and.returnValue(
      of({ ...mockDashboardStats, totalAgents: 20 })
    );

    component.loadDashboardData();

    expect(component.totalAgents).toBe(20);
  });

  it('should update activeAgents property', () => {
    adminService.getAdminDashboardStats.and.returnValue(
      of({ ...mockDashboardStats, activeAgents: 18 })
    );

    component.loadDashboardData();

    expect(component.activeAgents).toBe(18);
  });

  it('should update pendingTransactions property', () => {
    adminService.getAdminDashboardStats.and.returnValue(
      of({ ...mockDashboardStats, pendingTransactions: 5 })
    );

    component.loadDashboardData();

    expect(component.pendingTransactions).toBe(5);
  });

  it('should update flaggedTransactions property', () => {
    adminService.getAdminDashboardStats.and.returnValue(
      of({ ...mockDashboardStats, flaggedTransactions: 3 })
    );

    component.loadDashboardData();

    expect(component.flaggedTransactions).toBe(3);
  });

  it('should update totalCurrencies property', () => {
    adminService.getAdminDashboardStats.and.returnValue(
      of({ ...mockDashboardStats, totalCurrencies: 8 })
    );

    component.loadDashboardData();

    expect(component.totalCurrencies).toBe(8);
  });

  it('should handle error when loading dashboard stats', () => {
    adminService.getAdminDashboardStats.and.returnValue(
      throwError(() => new Error('API Error'))
    );
    spyOn(console, 'error');

    component.loadDashboardData();

    expect(console.error).toHaveBeenCalled();
  });

  it('should display zero values initially', () => {
    expect(component.totalAgents).toBe(0);
    expect(component.activeAgents).toBe(0);
    expect(component.pendingTransactions).toBe(0);
    expect(component.flaggedTransactions).toBe(0);
    expect(component.totalCurrencies).toBe(0);
  });

  it('should call loadDashboardData on component init', () => {
    spyOn(component, 'loadDashboardData');
    component.ngOnInit();

    expect(component.loadDashboardData).toHaveBeenCalled();
  });

  it('should have all required services injected', () => {
    expect(component['adminService']).toBeDefined();
    expect(component['transactionService']).toBeDefined();
    expect(component['agentService']).toBeDefined();
    expect(component['currencyService']).toBeDefined();
  });
});
