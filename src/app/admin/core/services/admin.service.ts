import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';

interface AdminLoginResponse {
  token: string;
  userId: string;
  name: string;
  role: string;
}

interface DashboardStats {
  totalAgents: number;
  activeAgents: number;
  pendingTransactions: number;
  flaggedTransactions: number;
  totalCurrencies: number;
}

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private isAuthenticated: boolean = true;
  private http = inject(HttpClient);

  login(): Observable<AdminLoginResponse> {
    return of({
      token: 'mock-admin-token',
      userId: 'admin-123',
      name: 'Super Admin',
      role: 'ADMIN'
    }).pipe(
      tap(() => {
        this.isAuthenticated = true;
        localStorage.setItem('admin-token', 'mock-admin-token');
      })
    );
  }

  logout(): Observable<{ success: boolean }> {
    return of({ success: true }).pipe(
      tap(() => {
        this.isAuthenticated = false;
        localStorage.removeItem('admin-token');
      })
    );
  }

  isLoggedIn(): boolean {
    return this.isAuthenticated || localStorage.getItem('admin-token') !== null;
  }

  getAdminDashboardStats(): Observable<DashboardStats> {
    return of({
      totalAgents: 53,
      activeAgents: 48,
      pendingTransactions: 34,
      flaggedTransactions: 7,
      totalCurrencies: 12
    });
  }
}
