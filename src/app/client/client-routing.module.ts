//app.client.client-rouing.module.ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {ClientLayoutComponent} from './layout/client-layout.component';
import {MainComponent} from './main/main.component';
import {AccountComponent} from './features/account/account.component';
import {VirementComponent} from './features/virement/virement.component';
import {RechargeComponent} from './features/recharge/recharge.component';
import {CryptoComponent} from './features/crypto/crypto.component';
import {BudgetComponent} from './features/budget/budget.component';
import {AssistantComponent} from './features/assistant/assistant.component';
import {SettingsComponent} from './features/settings/settings.component';
import {ParrainageComponent} from './features/parrainage/parrainage.component';

const routes: Routes = [
  {
    path: '',
    component: ClientLayoutComponent,
    children: [
      { path: '', component: MainComponent },
      { path: 'account', component: AccountComponent },
      { path: 'virement', component: VirementComponent },
      { path: 'recharges', component: RechargeComponent },
      { path: 'crypto', component: CryptoComponent },
      { path: 'budget', component: BudgetComponent },
      { path: 'assistant', component: AssistantComponent },
      { path: 'settings', component: SettingsComponent },
      { path: 'parrainage', component: ParrainageComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ClientRoutingModule { }
