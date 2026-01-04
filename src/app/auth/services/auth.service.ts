import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

export type UserRole = 'ADMIN' | 'AGENT' | 'CLIENT';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  token: string;
}

export interface LoginResponse {
  message: string;
  token: string;
  role: UserRole;
  userId: string;
  firstName: string;
  lastName: string;
  twoFactorEnabled: boolean;
}

export interface VerifyResponse {
  token: string;
  role: UserRole;
  clientId: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {

  private apiUrl = 'http://localhost:8080/auth';

  private currentUserSubject = new BehaviorSubject<User | null>(null);
  currentUser$ = this.currentUserSubject.asObservable();

  get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    this.restoreSession();
  }

  /* ===================== LOGIN ===================== */
  login(email: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, {
      email,
      password
    }).pipe(
      tap(response => {
        localStorage.setItem('token', response.token);
        localStorage.setItem('role', response.role);
        localStorage.setItem('userId', response.userId);

        this.currentUserSubject.next({
          id: response.userId,
          email,
          firstName: response.firstName,
          lastName: response.lastName,
          role: response.role,
          token: response.token
        });
      })
    );
  }

  /* ===================== 2FA (BACKEND NON EXISTANT) ===================== */
  verifyCode(_: string) {
    // ⚠️ Backend ne supporte pas le 2FA
    // Fonction laissée statique pour éviter les erreurs
    throw new Error('2FA non implémenté côté backend');
  }

  /* ===================== PASSWORD ===================== */
  forgotPassword(email: string): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(
      `${this.apiUrl}/forgot-password?email=${email}`,
      {}
    );
  }

  resetPassword(token: string, email: string, newPassword: string) {
    return this.http.post<{ message: string }>(
      `${this.apiUrl}/reset-password`,
      { token, email, newPassword }
    );
  }

  /* ===================== UTILS ===================== */
  logout(): void {
    localStorage.clear();
    this.currentUserSubject.next(null);
    this.router.navigate(['/auth/login']);
  }

  isLoggedIn(): boolean {
    return !!this.currentUserValue;
  }

  redirectBasedOnRole(user?: User | null): void {
    const role = user?.role ?? this.currentUserValue?.role;
    switch (role) {
      case 'ADMIN': this.router.navigate(['/admin']); break;
      case 'AGENT': this.router.navigate(['/agent']); break;
      case 'CLIENT': this.router.navigate(['/client']); break;
      default: this.router.navigate(['/auth/login']);
    }
  }

  private restoreSession(): void {
    const token = localStorage.getItem('token');
    if (!token) return;

    this.currentUserSubject.next({
      id: localStorage.getItem('userId') || '',
      email: '',
      firstName: '',
      lastName: '',
      role: localStorage.getItem('role') as UserRole,
      token
    });
  }

  getCurrentUser(): User | null {
    return this.currentUserValue;
  }

}
