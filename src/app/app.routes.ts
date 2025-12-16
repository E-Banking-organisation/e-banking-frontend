import { Routes } from '@angular/router';
import { AuthGuard } from './auth/guards/auth.guard';
import { AUTH_ROUTES } from './auth/auth.routes';

export const routes: Routes = [
  // Route par défaut qui redirige vers l'authentification
  { path: '', redirectTo: '/auth', pathMatch: 'full' },

  // Routes d'authentification
  { path: 'auth', children: AUTH_ROUTES },

  // Client routes - protégées par guard d'authentification
  {
    path: 'client',
    loadChildren: () => import('./client/client.module').then(m => m.ClientModule),
    canActivate: [AuthGuard],
    canActivateChild: [AuthGuard],
    data: { roles: ['CLIENT'] }
  },

  // Agent routes - protégées par guard d'authentification
  {
    path: 'agent',
    loadChildren: () => import('./agent/agent.module').then(m => m.AgentModule),
    canActivate: [AuthGuard],
    canActivateChild: [AuthGuard],
    data: { roles: ['AGENT'] }
  },

  // Admin routes - protégées par guard d'authentification
  {
    path: 'admin',
    loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule),
    canActivate: [AuthGuard],
    canActivateChild: [AuthGuard],
    data: { roles: ['ADMIN'] }
  },

  // Catch-all route
  { path: '**', redirectTo: '/auth/login' },
];
