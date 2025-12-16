import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminRoutingModule } from './admin-routing.module';
import { HttpClientModule} from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// Services
import { AdminService } from './core/services/admin.service';
import { CurrencyService } from './core/services/currency.service';
import { GlobalSettingService } from './core/services/global-setting.service';
import { AgentService } from './core/services/agent.service';
import { TransactionVerificationService } from './core/services/transaction-verification.service';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    AdminRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [
    AdminService,
    CurrencyService,
    GlobalSettingService,
    AgentService,
    TransactionVerificationService
  ]
})
export class AdminModule { }
