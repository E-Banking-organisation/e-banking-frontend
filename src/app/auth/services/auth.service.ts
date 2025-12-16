import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { Router } from '@angular/router';

/* =======================
   Interfaces
======================= */

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
  id: string;
  firstName: string;
  lastName: string;
}

/* =======================
   Mock Auth Service
======================= */

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private currentUserSubject = new BehaviorSubject<User | null>(null);
  currentUser$ = this.currentUserSubject.asObservable();

  /* ---------- Fake users ---------- */
  private users: Record<UserRole, User> = {
    ADMIN: {
      id: '1',
      email: 'admin@test.com',
      firstName: 'Admin',
      lastName: 'User',
      role: 'ADMIN',
      token: 'MOCK_ADMIN_TOKEN'
    },
    AGENT: {
      id: '2',
      email: 'agent@test.com',
      firstName: 'Agent',
      lastName: 'User',
      role: 'AGENT',
      token: 'MOCK_AGENT_TOKEN'
    },
    CLIENT: {
      id: '3',
      email: 'client@test.com',
      firstName: 'Client',
      lastName: 'User',
      role: 'CLIENT',
      token: 'MOCK_CLIENT_TOKEN'
    }
  };

  constructor(private router: Router) {
    this.restoreSession();
  }

  /* =======================
     Login
  ======================= */

  login(email: string, password: string): Observable<LoginResponse> {

    const user = Object.values(this.users)
      .find(u => u.email === email);

    if (!user) {
      return throwError(() => new Error('Utilisateur introuvable'));
    }

    // Password ignoré (mock)
    localStorage.setItem('token', user.token);
    localStorage.setItem('role', user.role);

    this.currentUserSubject.next(user);

    return of({
      message: 'Connexion mock réussie',
      token: user.token,
      role: user.role,
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName
    });
  }

  /* =======================
     Logout
  ======================= */

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    this.currentUserSubject.next(null);
    this.router.navigate(['/auth/login']);
  }

  /* =======================
     Check Auth
  ======================= */

  checkAuth(): Observable<User | null> {
    const token = localStorage.getItem('token');
    if (!token) {
      return of(null);
    }

    const user = Object.values(this.users)
      .find(u => u.token === token);

    if (!user) {
      this.logout();
      return of(null);
    }

    this.currentUserSubject.next(user);
    return of(user);
  }

  /* =======================
     Utils
  ======================= */

  isLoggedIn(): boolean {
    return !!this.currentUserSubject.value;
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  getRole(): UserRole | null {
    return this.currentUserSubject.value?.role || null;
  }

  redirectBasedOnRole(): void {
    const role = this.getRole();

    switch (role) {
      case 'ADMIN':
        this.router.navigate(['/admin']);
        break;
      case 'AGENT':
        this.router.navigate(['/agent']);
        break;
      case 'CLIENT':
        this.router.navigate(['/client']);
        break;
      default:
        this.router.navigate(['/auth/login']);
    }
  }

  /* =======================
     Restore Session
  ======================= */

  private restoreSession(): void {
    const token = localStorage.getItem('token');
    if (!token) return;

    const user = Object.values(this.users)
      .find(u => u.token === token);

    if (user) {
      this.currentUserSubject.next(user);
    }
  }

  get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  /* =======================
   Ajouter dans AuthService
======================= */

  forgotPassword(email: string): Observable<{ message: string }> {
    const user = Object.values(this.users).find(u => u.email === email);
    if (!user) {
      return throwError(() => new Error('Utilisateur introuvable'));
    }

    // Simuler l’envoi d’un email
    console.log(`Mock: Envoi du lien de réinitialisation à ${email}`);

    return of({ message: `Un lien de réinitialisation a été envoyé à ${email}` });
  }

}
