import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QuickActionComponent } from './quick-action/quick-action.component';
import { AccountComponent } from '../features/account/account.component';
import { TransactionComponent } from '../features/transaction/transaction.component';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [CommonModule, QuickActionComponent, AccountComponent, TransactionComponent],
  template: `
    <div class="main-content">
      <h1>Tableau de bord</h1>
      <p>Bienvenue sur votre espace bancaire personnel</p>
      
      <section class="quick-actions-container">
        <app-quick-action type="virement"></app-quick-action>
        <app-quick-action type="crypto"></app-quick-action>
        <app-quick-action type="recharge"></app-quick-action>
      </section>
      
      <section>
        <app-account [displayMode]="'summary'"></app-account>
      </section>
      
      <section class="recent-transactions">
        <h2>Transactions récentes</h2>
        <app-transaction [displayMode]="'summary'"></app-transaction>
      </section>
    </div>
  `,
  styleUrls: ['./main.component.css']
})
export class MainComponent {}