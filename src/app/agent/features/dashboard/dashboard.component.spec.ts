import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { DashboardComponent } from './dashboard.component';
import { ClientService } from '../../core/services/client.service';
import { AuthService } from '../../../auth/services/auth.service';

xdescribe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;

  beforeEach(async () => {
    const clientServiceMock = {
      getClients: jasmine.createSpy().and.returnValue(of([]))
    };

    const authServiceMock = {
      isAuthenticated: jasmine.createSpy().and.returnValue(true),
      getCurrentUser: jasmine.createSpy().and.returnValue({
        id: 1,
        role: 'AGENT'
      })
    };

    await TestBed.configureTestingModule({
      imports: [DashboardComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: ClientService, useValue: clientServiceMock },
        { provide: AuthService, useValue: authServiceMock },
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
