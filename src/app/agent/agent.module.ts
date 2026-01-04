import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AgentRoutingModule } from './agent-routing.module';
import { HttpClientModule } from '@angular/common/http';

// Services
// import { SubscriberService } from './core/services/subscriber.service';
import { TransactionService } from './core/services/transaction.service';
import { ClientService } from './core/services/client.service';
// import { EnrollmentService } from './core/services/enrollment.service';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    AgentRoutingModule,
    HttpClientModule
  ],
  providers: [
    // SubscriberService,
    TransactionService,
    ClientService
    // EnrollmentService
  ]
})
export class AgentModule { }