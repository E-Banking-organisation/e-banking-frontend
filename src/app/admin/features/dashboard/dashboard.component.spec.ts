import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { DashboardComponent } from './dashboard.component';
import { AdminService } from '../../core/services/admin.service';
import { ClientService } from '../../../agent/core/services/client.service';
import { AuthService } from '../../../auth/services/auth.service';
import { TransactionVerificationService } from '../../core/services/transaction-verification.service';

describe('Admin DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;

  beforeEach(async () => {
    const adminServiceMock = {
      getAdminDashboardStats: jasmine.createSpy().and.returnValue(of({
        totalClients: 0,
        totalAgents: 0,
        pendingTransactions: 0,
        totalTransactions: 0
      }))
    };

    const clientServiceMock = {
      getClients: jasmine.createSpy().and.returnValue(of([]))
    };

    const authServiceMock = {
      isAuthenticated: jasmine.createSpy().and.returnValue(true),
      getCurrentUser: jasmine.createSpy().and.returnValue({
        id: 1,
        role: 'ADMIN'
      })
    };

    const transactionVerificationServiceMock = {
      getPendingTransactions: jasmine.createSpy().and.returnValue(of([]))
    };

    await TestBed.configureTestingModule({
      imports: [DashboardComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: AdminService, useValue: adminServiceMock },
        { provide: ClientService, useValue: clientServiceMock },
        { provide: AuthService, useValue: authServiceMock },
        { provide: TransactionVerificationService, useValue: transactionVerificationServiceMock },
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
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
