import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { ClientManagementComponent } from './features/client-management/client-management.component';
import { SubscriberManagementComponent } from './features/subscriber-management/subscriber-management.component';
import { EnrollmentComponent } from './features/enrollment/enrollment.component';
import { AgentLayoutComponent } from './layout/agent-layout.component';

const routes: Routes = [
  {
    path: '',
    component: AgentLayoutComponent,
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'clients', component: ClientManagementComponent },
      { path: 'subscribers', component: SubscriberManagementComponent },
      { path: 'enrollments', component: EnrollmentComponent },

      {
        path: 'audit-logs',
        loadComponent: () =>
          import('../audit/features/audit-logs.component')
            .then(m => m.AuditLogsComponent)
      },

      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AgentRoutingModule {}
