import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { CurrencyManagementComponent } from './features/currency-management/currency-management.component';
import { GlobalSettingsComponent } from './features/global-settings/global-settings.component';
import { AgentManagementComponent } from './features/agent-management/agent-management.component';
import { TransactionVerificationComponent } from './features/transaction-verification/transaction-verification.component';
import { AdminLayoutComponent } from './layout/admin-layout.component';

const routes: Routes = [
  {
    path: '',
    component: AdminLayoutComponent,
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'currencies', component: CurrencyManagementComponent },
      { path: 'global-settings', component: GlobalSettingsComponent },
      { path: 'agents', component: AgentManagementComponent },
      { path: 'transactions', component: TransactionVerificationComponent },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }