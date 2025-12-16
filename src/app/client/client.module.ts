import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClientRoutingModule } from './client-routing.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ChartModule } from 'angular-highcharts';
import { BaseChartDirective } from 'ng2-charts';
import {AccountService} from './core/services/account.service';
import {AssistantService} from './core/services/assistant.service';
import {BudgetService} from './core/services/budget.service';
import {CryptoService} from './core/services/crypto.service';
import {ParrainageService} from './core/services/parrainage.service';
import {RechargeService} from './core/services/recharge.service';
import {SettingsService} from './core/services/settings.service';
import {VirementService} from './core/services/virement.service';
import {TransactionService} from './core/services/transaction.service';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    ClientRoutingModule,
    ChartModule,
    FontAwesomeModule,
    BaseChartDirective,

  ],

  providers: [
    AccountService,
    AssistantService,
    BudgetService,
    CryptoService,
    ParrainageService,
    RechargeService,
    SettingsService,
    TransactionService,
    VirementService

  ]
})
export class ClientModule { }
