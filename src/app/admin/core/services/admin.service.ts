import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private isAuthenticated: boolean = true; // Pour le mock, toujours authentifié
  
  constructor(private http: HttpClient) { }
  
  login(email: string, password: string): Observable<any> {
    // Mock implementation
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
  
  logout(): Observable<any> {
    // Mock implementation
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
  
  getAdminDashboardStats(): Observable<any> {
    // Mock dashboard stats
    return of({
      totalAgents: 53,
      activeAgents: 48,
      pendingTransactions: 34,
      flaggedTransactions: 7,
      totalCurrencies: 12
    });
  }
}