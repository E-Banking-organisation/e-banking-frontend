import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { Router } from '@angular/router';

/* =======================
   Types
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

  // ⬇️ utilisés dans login.component.ts
  pinId?: string;
  phoneNumber?: string;
}

export interface VerifyResponse {
  token: string;
  role: UserRole;
  clientId: string;
}

/* =======================
   Auth Service (MOCK)
======================= */

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private currentUserSubject = new BehaviorSubject<User | null>(null);
  currentUser$ = this.currentUserSubject.asObservable();

  /* =======================
     Fake users
  ======================= */

  private users: Record<UserRole, User> = {
    ADMIN: {
      id: '1',
      email: 'admin@test.com',
      firstName: 'Admin',
      lastName: 'User',
      role: 'ADMIN',
      token: 'ADMIN_TOKEN'
    },
    AGENT: {
      id: '2',
      email: 'agent@test.com',
      firstName: 'Agent',
      lastName: 'User',
      role: 'AGENT',
      token: 'AGENT_TOKEN'
    },
    CLIENT: {
      id: '3',
      email: 'client@test.com',
      firstName: 'Client',
      lastName: 'User',
      role: 'CLIENT',
      token: 'CLIENT_TOKEN'
    }
  };

  constructor(private router: Router) {
    this.restoreSession();
  }

  /* =======================
     GETTERS (IMPORTANT)
  ======================= */

  get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  getRole(): UserRole | null {
    return this.currentUserSubject.value?.role ?? null;
  }

  /* =======================
     LOGIN
  ======================= */

  login(email: string, password: string): Observable<LoginResponse> {
    const user = Object.values(this.users).find(u => u.email === email);

    if (!user) {
      return throwError(() => new Error('Utilisateur introuvable'));
    }

    localStorage.setItem('token', user.token);
    localStorage.setItem('role', user.role);
    this.currentUserSubject.next(user);

    return of({
      message: 'Connexion réussie',
      token: user.token,
      role: user.role,
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,

      // Mock MFA
      pinId: '123456',
      phoneNumber: '+2126XXXXXXX'
    });
  }

  /* =======================
     MFA VERIFY (MOCK)
  ======================= */

  verifyCode(code: string): Observable<VerifyResponse> {
    if (code !== '123456') {
      return throwError(() => new Error('Code invalide'));
    }

    const user = this.currentUserValue;
    if (!user) {
      return throwError(() => new Error('Utilisateur non connecté'));
    }

    return of({
      token: user.token,
      role: user.role,
      clientId: user.id
    });
  }

  /* =======================
     REDIRECTION
  ======================= */

  redirectBasedOnRole(user?: User): void {
    const role = user?.role ?? this.getRole();

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
     LOGOUT
  ======================= */

  logout(): void {
    localStorage.clear();
    this.currentUserSubject.next(null);
    this.router.navigate(['/auth/login']);
  }

  /* =======================
     PASSWORD RESET
  ======================= */

  forgotPassword(email: string): Observable<{ message: string }> {
    return of({ message: `Lien envoyé à ${email}` });
  }

  resetPassword(token: string, newPassword: string): Observable<{ message: string }> {
    return of({ message: 'Mot de passe réinitialisé avec succès' });
  }

  /* =======================
     SESSION RESTORE
  ======================= */

  private restoreSession(): void {
    const token = localStorage.getItem('token');
    if (!token) return;

    const user = Object.values(this.users).find(u => u.token === token);
    if (user) {
      this.currentUserSubject.next(user);
    }
  }

  /** Vérifie si un utilisateur est connecté */
  isLoggedIn(): boolean {
    return !!this.currentUserSubject.value;
  }

  /** Retourne l'utilisateur courant */
  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

}
