import { Routes } from '@angular/router';
import { AuthGuard } from './auth/guards/auth.guard';
import { AUTH_ROUTES } from './auth/auth.routes';

export const routes: Routes = [

  { path: '', redirectTo: '/auth', pathMatch: 'full' },

  { path: 'auth', children: AUTH_ROUTES },

  {
    path: 'client',
    loadChildren: () =>
      import('./client/client.module').then(m => m.ClientModule),
    canActivate: [AuthGuard],
    canActivateChild: [AuthGuard],
    data: { roles: ['CLIENT'] }
  },

  {
    path: 'agent',
    loadChildren: () =>
      import('./agent/agent.module').then(m => m.AgentModule),
    canActivate: [AuthGuard],
    canActivateChild: [AuthGuard],
    data: { roles: ['AGENT'] }
  },

  {
    path: 'admin',
    loadChildren: () =>
      import('./admin/admin.module').then(m => m.AdminModule),
    canActivate: [AuthGuard],
    canActivateChild: [AuthGuard],
    data: { roles: ['ADMIN'] }
  },

  { path: '**', redirectTo: '/auth/login' }
];
